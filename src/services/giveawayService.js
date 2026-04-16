const API_BASE_URL = "https://ktt.everionai.com/api/v1/profiles/";
const API_TOKEN = "mUfVhyyM3JiSZXqTzfLweWqeHMNwLGiJ";

function buildGiveawayUrl(path) {
  const normalizedPath = path.replace(/^\/+/, "");

  return `${API_BASE_URL.replace(/\/+$/, "")}/${normalizedPath}`;
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
    throw new Error(data?.detail || "İşlem şu anda tamamlanamadı.");
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

export function sendGiveawayTicket(winnerRecordId) {
  return requestGiveaway(`giveaway/send-ticket/${winnerRecordId}/`, {
    method: "POST",
  });
}
