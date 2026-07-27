import { clearAdminSession, getAdminAccessToken } from "../utils/adminAuth";

const API_BASE_URL = "https://ktt.everionai.com/api/v1/profiles/";
const MISSING_ADMIN_SESSION_MESSAGE =
  "Yönetim paneli oturumu bulunamadı. Lütfen tekrar giriş yapın.";

function buildGiveawayUrl(path) {
  const normalizedPath = path.replace(/^\/+/, "");

  return `${API_BASE_URL.replace(/\/+$/, "")}/${normalizedPath}`;
}

function getErrorMessage(data) {
  return (
    data?.detail ||
    data?.message ||
    data?.error ||
    (Array.isArray(data?.non_field_errors)
      ? data.non_field_errors.join(" ")
      : data?.non_field_errors) ||
    "İşlem şu anda tamamlanamadı."
  );
}

function redirectToPanelLogin() {
  if (typeof window === "undefined" || window.location.pathname === "/panel/giris") {
    return;
  }

  window.location.replace("/panel/giris");
}

async function requestGiveaway(path, options = {}) {
  const accessToken = getAdminAccessToken();

  if (!accessToken) {
    clearAdminSession();
    redirectToPanelLogin();
    throw new Error(MISSING_ADMIN_SESSION_MESSAGE);
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    ...options.headers,
  };

  const response = await fetch(buildGiveawayUrl(path), {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const isJsonResponse =
    response.headers.get("content-type")?.includes("application/json") ?? false;

  const data = isJsonResponse ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearAdminSession();
      redirectToPanelLogin();
    }

    throw new Error(getErrorMessage(data));
  }

  return data;
}

export function drawGiveaway(payload) {
  return requestGiveaway("giveaway/draw/", {
    method: "POST",
    body: payload,
  });
}

export function loadGiveawayParticipants(payload) {
  return requestGiveaway("giveaway/draw/", {
    method: "POST",
    body: payload,
  });
}

export function getGiveawaySettings() {
  return requestGiveaway("giveaway/settings/");
}

export function sendGiveawayTicket(winnerRecordId) {
  return requestGiveaway(`giveaway/send-ticket/${winnerRecordId}/`, {
    method: "POST",
  });
}
