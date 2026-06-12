const ADMIN_ACCESS_TOKEN_KEY = "qrakter_admin_access_token";
const ADMIN_REFRESH_TOKEN_KEY = "qrakter_admin_refresh_token";
const ADMIN_USER_KEY = "qrakter_admin_user";

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

export function getAdminAccessToken() {
  return getStorage()?.getItem(ADMIN_ACCESS_TOKEN_KEY) || "";
}

export function getAdminRefreshToken() {
  return getStorage()?.getItem(ADMIN_REFRESH_TOKEN_KEY) || "";
}

export function setAdminSession(tokens, user) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const accessToken = tokens?.access || tokens?.token || "";
  const refreshToken = tokens?.refresh || "";

  if (accessToken) {
    storage.setItem(ADMIN_ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    storage.setItem(ADMIN_REFRESH_TOKEN_KEY, refreshToken);
  } else {
    storage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  }

  if (user) {
    storage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  } else {
    storage.removeItem(ADMIN_USER_KEY);
  }
}

export function clearAdminSession() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  storage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  storage.removeItem(ADMIN_USER_KEY);
}

export function getStoredAdminUser() {
  const rawUser = getStorage()?.getItem(ADMIN_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    clearAdminSession();
    return null;
  }
}

export function isAdminUser(user) {
  return (
    user?.is_staff === true ||
    user?.is_superuser === true ||
    user?.role === "admin" ||
    user?.user_type === "admin" ||
    user?.type === "admin"
  );
}
