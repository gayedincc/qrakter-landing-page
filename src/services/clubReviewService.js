const API_BASE_URL = "https://ktt.everionai.com/api/v1";

const CLUB_REVIEW_ACCESS_TOKEN_KEY = "qrakter_club_review_access_token";
const CLUB_REVIEW_REFRESH_TOKEN_KEY = "qrakter_club_review_refresh_token";
const CLUB_REVIEW_USER_KEY = "qrakter_club_review_user";

const NO_REVIEW_ACCESS_MESSAGE = "Bu panele erişim yetkiniz yok.";
const INVALID_CREDENTIALS_MESSAGE = "E-posta/telefon ya da şifre hatalı.";
const SESSION_EXPIRED_MESSAGE = "Oturum süreniz doldu. Lütfen tekrar giriş yapın.";
const LOGIN_FAILED_MESSAGE = "Giriş işlemi şu anda tamamlanamadı.";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function buildApiUrl(path, params) {
  const normalizedPath = path.replace(/^\/+/, "");
  const url = new URL(`${API_BASE_URL.replace(/\/+$/, "")}/${normalizedPath}`);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

function buildLoginPayload(identifier, password) {
  return {
    identifier: identifier.trim(),
    password,
  };
}

function extractTokens(data) {
  return {
    access: data?.access || data?.token || data?.data?.access || data?.data?.token || "",
    refresh: data?.refresh || data?.data?.refresh || "",
  };
}

function extractClubReviewUser(data) {
  const user = data?.user || data?.data?.user || null;

  if (!user) {
    return null;
  }

  return {
    ...user,
    can_review_club_applications:
      data?.can_review_club_applications === true ||
      data?.data?.can_review_club_applications === true,
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

function getClubReviewAccessToken() {
  return getStorage()?.getItem(CLUB_REVIEW_ACCESS_TOKEN_KEY) || "";
}

function getClubReviewRefreshToken() {
  return getStorage()?.getItem(CLUB_REVIEW_REFRESH_TOKEN_KEY) || "";
}

function setClubReviewSession(tokens, user) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const accessToken = tokens?.access || tokens?.token || "";
  const refreshToken = tokens?.refresh || "";

  if (accessToken) {
    storage.setItem(CLUB_REVIEW_ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    storage.setItem(CLUB_REVIEW_REFRESH_TOKEN_KEY, refreshToken);
  } else {
    storage.removeItem(CLUB_REVIEW_REFRESH_TOKEN_KEY);
  }

  if (user) {
    storage.setItem(CLUB_REVIEW_USER_KEY, JSON.stringify(user));
  } else {
    storage.removeItem(CLUB_REVIEW_USER_KEY);
  }
}

export function clearClubReviewSession() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(CLUB_REVIEW_ACCESS_TOKEN_KEY);
  storage.removeItem(CLUB_REVIEW_REFRESH_TOKEN_KEY);
  storage.removeItem(CLUB_REVIEW_USER_KEY);
}

export function getStoredClubReviewUser() {
  const rawUser = getStorage()?.getItem(CLUB_REVIEW_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    clearClubReviewSession();
    return null;
  }
}

export function hasClubReviewAccess() {
  return Boolean(getClubReviewAccessToken()) && getStoredClubReviewUser()?.can_review_club_applications === true;
}

function redirectToClubReviewLogin() {
  if (typeof window === "undefined" || window.location.pathname === "/kulup-onay/giris") {
    return;
  }

  window.location.replace("/kulup-onay/giris");
}

async function parseJsonResponse(response) {
  const isJsonResponse = response.headers.get("content-type")?.includes("application/json") ?? false;

  if (!isJsonResponse) {
    return null;
  }

  return response.json();
}

async function requestClubReview(path, { method = "GET", body, params, token, redirectOnForbidden = true } = {}) {
  const accessToken = token || getClubReviewAccessToken();
  const normalizedPath = path.replace(/^\/+/, "");
  const isLoginRequest = normalizedPath === "auth/login/";

  if (!accessToken && !isLoginRequest) {
    clearClubReviewSession();
    if (redirectOnForbidden) {
      redirectToClubReviewLogin();
    }
    throw new Error(SESSION_EXPIRED_MESSAGE);
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(buildApiUrl(path, params), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    if (isLoginRequest) {
      clearClubReviewSession();
      if (response.status === 400 || response.status === 401) {
        throw new Error(INVALID_CREDENTIALS_MESSAGE);
      }
      throw new Error(LOGIN_FAILED_MESSAGE);
    }

    if (response.status === 401) {
      clearClubReviewSession();
      if (redirectOnForbidden) {
        redirectToClubReviewLogin();
      }
      throw new Error(SESSION_EXPIRED_MESSAGE);
    }

    if (response.status === 403) {
      clearClubReviewSession();
      if (redirectOnForbidden) {
        redirectToClubReviewLogin();
      }
      throw new Error(NO_REVIEW_ACCESS_MESSAGE);
    }

    throw new Error(extractErrorMessage(data));
  }

  return data;
}

function assertClubReviewer(user) {
  if (user?.can_review_club_applications !== true) {
    clearClubReviewSession();
    throw new Error(NO_REVIEW_ACCESS_MESSAGE);
  }
}

export async function loginClubReview(identifier, password) {
  clearClubReviewSession();

  try {
    const loginResponse = await requestClubReview("auth/login/", {
      method: "POST",
      body: buildLoginPayload(identifier, password),
      redirectOnForbidden: false,
    });
    const tokens = extractTokens(loginResponse);

    if (!tokens.access) {
      throw new Error(LOGIN_FAILED_MESSAGE);
    }

    const meResponse = await requestClubReview("clubs/review/me/", {
      token: tokens.access,
      redirectOnForbidden: false,
    });
    const user = extractClubReviewUser(meResponse);

    assertClubReviewer(user);
    setClubReviewSession(tokens, user);

    return { tokens, user };
  } catch (error) {
    clearClubReviewSession();

    if (
      error instanceof Error &&
      [
        INVALID_CREDENTIALS_MESSAGE,
        NO_REVIEW_ACCESS_MESSAGE,
        SESSION_EXPIRED_MESSAGE,
        LOGIN_FAILED_MESSAGE,
      ].includes(error.message)
    ) {
      throw error;
    }

    throw new Error(LOGIN_FAILED_MESSAGE);
  }
}

export async function getReviewMe() {
  const meResponse = await requestClubReview("clubs/review/me/", {
    redirectOnForbidden: true,
  });
  const user = extractClubReviewUser(meResponse);

  assertClubReviewer(user);
  setClubReviewSession(
    {
      access: getClubReviewAccessToken(),
      refresh: getClubReviewRefreshToken(),
    },
    user,
  );

  return user;
}

export function getApplications(params) {
  return requestClubReview("clubs/review/applications/", { params });
}

export function getApplicationDetail(id) {
  return requestClubReview(`clubs/review/applications/${id}/`);
}

export function approveApplication(id) {
  return requestClubReview(`clubs/review/applications/${id}/approve/`, {
    method: "POST",
    body: {},
  });
}

export function rejectApplication(id, rejectionReason) {
  return requestClubReview(`clubs/review/applications/${id}/reject/`, {
    method: "POST",
    body: {
      rejection_reason: rejectionReason,
    },
  });
}

export function resetApplicationRejection(id) {
  return requestClubReview(`clubs/review/applications/${id}/reset-rejection/`, {
    method: "POST",
    body: {},
  });
}
