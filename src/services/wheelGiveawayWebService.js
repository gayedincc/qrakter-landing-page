const API_BASE_URL = "https://ktt.everionai.com/api/v1/wheel-giveaways/web/";
const API_TOKEN = "mUfVhyyM3JiSZXqTzfLweWqeHMNwLGiJ";

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

async function requestGiveaway(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    "X-Giveaway-Api-Key": API_TOKEN,
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
    throw new Error(getErrorMessage(data));
  }

  return data;
}

export function listGiveawayCampaigns() {
  return requestGiveaway("campaigns/");
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
