import { clearAdminSession, getAdminAccessToken } from "../utils/adminAuth";

const API_BASE_URL = "https://ktt.everionai.com/api/v1/wheel-giveaways/web/";
const MISSING_ADMIN_SESSION_MESSAGE =
  "Yönetim paneli oturumu bulunamadı. Lütfen tekrar giriş yapın.";

export const GIVEAWAY_CAMPAIGN_STATUS_LABELS = {
  draft: "Hazırlık",
  active: "Aktif",
  closed: "Katılım Kapalı",
  drawn: "Çekiliş Yapıldı",
  archived: "Arşivlendi",
};

function buildGiveawayUrl(path) {
  const normalizedPath = path.replace(/^\/+/, "");

  return `${API_BASE_URL.replace(/\/+$/, "")}/${normalizedPath}`;
}

function assertCampaignId(campaignId) {
  if (
    campaignId === null ||
    campaignId === undefined ||
    `${campaignId}`.trim() === ""
  ) {
    throw new Error("Kampanya ID zorunludur.");
  }
}

function assertResourceId(id, label) {
  if (id === null || id === undefined || `${id}`.trim() === "") {
    throw new Error(`${label} ID zorunludur.`);
  }
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

export function listGiveawayCampaigns() {
  return requestGiveaway("campaigns/");
}

export function getGiveawayCampaign(id) {
  assertResourceId(id, "Kampanya");

  return requestGiveaway(`campaigns/${id}/`);
}

export function updateGiveawayCampaign(id, payload) {
  assertResourceId(id, "Kampanya");

  return requestGiveaway(`campaigns/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

export function startGiveawayCampaignFromDefaults(payload = {}) {
  return requestGiveaway("campaigns/start-from-defaults/", {
    method: "POST",
    body: payload,
  });
}

export function closeGiveawayCampaign(campaignId) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/close/`, {
    method: "POST",
    body: {},
  });
}

export function listGiveawayParticipants(campaignId) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/participants/`);
}

export function previewGiveawayDraw(campaignId) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/draw/preview/`, {
    method: "POST",
    body: {
      force_new: false,
    },
  });
}

export function refreshGiveawayDrawPreview(campaignId) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/draw/preview/`, {
    method: "POST",
    body: {
      force_new: true,
    },
  });
}

export function cancelGiveawayDrawPreview(campaignId) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/draw/cancel-preview/`, {
    method: "POST",
    body: {},
  });
}

export function confirmGiveawayDraw(campaignId) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/draw/confirm/`, {
    method: "POST",
    body: {},
  });
}

export function listGiveawayWinners(campaignId) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/winners/`);
}

export function listCampaignPrizes(campaignId) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/prizes/`);
}

export function createCampaignPrize(campaignId, payload) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/prizes/`, {
    method: "POST",
    body: payload,
  });
}

export function updateCampaignPrize(prizeId, payload) {
  assertResourceId(prizeId, "Hediye");

  return requestGiveaway(`prizes/${prizeId}/`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCampaignPrize(prizeId) {
  assertResourceId(prizeId, "Hediye");

  return requestGiveaway(`prizes/${prizeId}/`, {
    method: "DELETE",
  });
}

export function listCampaignSegments(campaignId) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/segments/`);
}

export function createCampaignSegment(campaignId, payload) {
  assertCampaignId(campaignId);

  return requestGiveaway(`campaigns/${campaignId}/segments/`, {
    method: "POST",
    body: payload,
  });
}

export function updateCampaignSegment(segmentId, payload) {
  assertResourceId(segmentId, "Çark dilimi");

  return requestGiveaway(`segments/${segmentId}/`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCampaignSegment(segmentId) {
  assertResourceId(segmentId, "Çark dilimi");

  return requestGiveaway(`segments/${segmentId}/`, {
    method: "DELETE",
  });
}

export function getWheelGiveawaySettings() {
  return requestGiveaway("settings/");
}

export function updateWheelGiveawaySettings(payload) {
  return requestGiveaway("settings/", {
    method: "PATCH",
    body: payload,
  });
}

export function listDefaultPrizes() {
  return requestGiveaway("default-prizes/");
}

export function createDefaultPrize(payload) {
  return requestGiveaway("default-prizes/", {
    method: "POST",
    body: payload,
  });
}

export function updateDefaultPrize(id, payload) {
  assertResourceId(id, "Varsayılan hediye");

  return requestGiveaway(`default-prizes/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteDefaultPrize(id) {
  assertResourceId(id, "Varsayılan hediye");

  return requestGiveaway(`default-prizes/${id}/`, {
    method: "DELETE",
  });
}

export function listDefaultSegments() {
  return requestGiveaway("default-segments/");
}

export function createDefaultSegment(payload) {
  return requestGiveaway("default-segments/", {
    method: "POST",
    body: payload,
  });
}

export function updateDefaultSegment(id, payload) {
  assertResourceId(id, "Varsayılan çark dilimi");

  return requestGiveaway(`default-segments/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteDefaultSegment(id) {
  assertResourceId(id, "Varsayılan çark dilimi");

  return requestGiveaway(`default-segments/${id}/`, {
    method: "DELETE",
  });
}
