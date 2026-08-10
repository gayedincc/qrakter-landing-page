import { getAdminAccessToken, clearAdminSession } from "../utils/adminAuth";

const API_BASE = "https://ktt.everionai.com/api/v1/raffles/";

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.assign("/panel/giris");
  }
}

async function request(path, options = {}) {
  const token = getAdminAccessToken();
  if (!token) {
    clearAdminSession();
    redirectToLogin();
    throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
  }

  const url = `${API_BASE.replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const isJson = (response.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearAdminSession();
      redirectToLogin();
    }
    const detail = data?.detail || data?.error || `İşlem başarısız (${response.status}).`;
    throw new Error(detail);
  }
  return data;
}

// Meta: kriter tipleri, şans modelleri, mantık, il listesi, kulüpler
export const getRaffleMeta = () => request("meta/");

// Manuel ekleme için kullanıcı arama
export const searchUsers = (q) => request(`users/search/?q=${encodeURIComponent(q || "")}`);

// Çekiliş CRUD
export const listRaffles = () => request("");
export const createRaffle = (payload) => request("", { method: "POST", body: payload });
export const getRaffle = (id) => request(`${id}/`);
export const updateRaffle = (id, payload) => request(`${id}/`, { method: "PATCH", body: payload });
export const deleteRaffle = (id) => request(`${id}/`, { method: "DELETE" });

// Kriterler
export const addCriterion = (id, payload) => request(`${id}/criteria/`, { method: "POST", body: payload });
export const deleteCriterion = (id, cid) => request(`${id}/criteria/${cid}/`, { method: "DELETE" });

// Ödüller
export const addPrize = (id, payload) => request(`${id}/prizes/`, { method: "POST", body: payload });
export const deletePrize = (id, prizeId) => request(`${id}/prizes/${prizeId}/`, { method: "DELETE" });

// Canlı katılımcı önizleme (kriterlere göre sayım)
export const previewPool = (id) => request(`${id}/preview/`);

// Havuzu oluştur (kriterlerden snapshot)
export const buildPool = (id) => request(`${id}/build-pool/`, { method: "POST", body: {} });

// Katılımcılar
export const getEntries = (id) => request(`${id}/entries/`);
export const addManualEntry = (id, userId) => request(`${id}/entries/manual/`, { method: "POST", body: { user_id: userId } });
export const deleteEntry = (id, entryId) => request(`${id}/entries/${entryId}/`, { method: "DELETE" });

// Çekiliş + kazananlar
export const drawRaffle = (id) => request(`${id}/draw/`, { method: "POST", body: {} });
export const getWinners = (id) => request(`${id}/winners/`);
