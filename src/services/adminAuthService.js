import {
  clearAdminSession,
  getAdminAccessToken,
  getAdminRefreshToken,
  getStoredAdminUser,
  isAdminUser,
  setAdminSession,
} from "../utils/adminAuth";

const API_BASE_URL = "https://ktt.everionai.com/api/v1";
const UNVERIFIED_PERMISSION_MESSAGE = "Bu panel için yetki bilgisi doğrulanamadı.";
const UNAUTHORIZED_PANEL_MESSAGE = "Bu panel için yetkiniz bulunmuyor.";

function buildAuthUrl(path) {
  const normalizedPath = path.replace(/^\/+/, "");

  return `${API_BASE_URL.replace(/\/+$/, "")}/${normalizedPath}`;
}

function buildLoginPayload(identifier, password) {
  const normalizedIdentifier = identifier.trim();

  return {
    identifier: normalizedIdentifier,
    password,
  };
}

function extractErrorMessage(data, fallbackMessage = "İşlem şu anda tamamlanamadı.") {
  if (!data || typeof data !== "object") {
    return fallbackMessage;
  }

  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (Array.isArray(data.non_field_errors)) return data.non_field_errors.join(" ");
  if (typeof data.non_field_errors === "string") return data.non_field_errors;

  const firstFieldError = Object.values(data).find((value) => {
    return typeof value === "string" || Array.isArray(value);
  });

  if (Array.isArray(firstFieldError)) {
    return firstFieldError.join(" ");
  }

  return firstFieldError || fallbackMessage;
}

function extractTokens(data) {
  return {
    access: data?.access || data?.token || data?.data?.access || data?.data?.token || "",
    refresh: data?.refresh || data?.data?.refresh || "",
  };
}

function extractUser(data) {
  return data?.user || data?.data?.user || data?.data || data || null;
}

function hasAdminMarker(user) {
  if (!user || typeof user !== "object") {
    return false;
  }

  // /auth/me/ must expose at least one staff/admin marker; a token alone is not enough for panel access.
  return ["is_staff", "is_superuser", "role", "user_type", "type"].some((key) => {
    return Object.prototype.hasOwnProperty.call(user, key);
  });
}

async function parseJsonResponse(response) {
  const isJsonResponse =
    response.headers.get("content-type")?.includes("application/json") ?? false;

  if (!isJsonResponse) {
    return null;
  }

  return response.json();
}

async function requestAuth(path, { method = "GET", body, token } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  const accessToken = token || getAdminAccessToken();

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(buildAuthUrl(path), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
}

function assertVerifiedAdmin(user) {
  if (!hasAdminMarker(user)) {
    throw new Error(UNVERIFIED_PERMISSION_MESSAGE);
  }

  if (!isAdminUser(user)) {
    throw new Error(UNAUTHORIZED_PANEL_MESSAGE);
  }
}

export async function loginAdmin(identifier, password) {
  clearAdminSession();

  const loginResponse = await requestAuth("auth/login/", {
    method: "POST",
    body: buildLoginPayload(identifier, password),
  });
  const tokens = extractTokens(loginResponse);

  if (!tokens.access) {
    throw new Error("Giriş yanıtında access token bulunamadı.");
  }

  const meResponse = await requestAuth("auth/me/", {
    token: tokens.access,
  });
  const user = extractUser(meResponse);

  assertVerifiedAdmin(user);
  setAdminSession(tokens, user);

  return { tokens, user };
}

export async function getAdminMe() {
  const meResponse = await requestAuth("auth/me/");
  const user = extractUser(meResponse);

  assertVerifiedAdmin(user);
  setAdminSession(
    {
      access: getAdminAccessToken(),
      refresh: getAdminRefreshToken(),
    },
    user,
  );

  return user;
}

export async function logoutAdmin() {
  const refresh = getAdminRefreshToken();

  try {
    if (getAdminAccessToken()) {
      await requestAuth("auth/logout/", {
        method: "POST",
        body: refresh ? { refresh } : {},
      });
    }
  } finally {
    clearAdminSession();
  }
}

export async function refreshAdminToken() {
  const refresh = getAdminRefreshToken();

  if (!refresh) {
    clearAdminSession();
    throw new Error("Yönetim paneli oturumu bulunamadı. Lütfen tekrar giriş yapın.");
  }

  const response = await requestAuth("auth/token/refresh/", {
    method: "POST",
    body: { refresh },
    token: "",
  });
  const tokens = extractTokens(response);

  if (!tokens.access) {
    clearAdminSession();
    throw new Error("Oturum yenileme yanıtında access token bulunamadı.");
  }

  setAdminSession(
    {
      access: tokens.access,
      refresh: tokens.refresh || refresh,
    },
    getStoredAdminUser(),
  );

  return tokens;
}
