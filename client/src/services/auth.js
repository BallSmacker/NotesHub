const TOKEN_KEY = "noteshub_token";
const USER_KEY = "noteshub_user";

// --------------------
// TOKEN
// --------------------

export function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token, remember = true) {
  if (typeof window === "undefined") return;

  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearToken() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);

  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function isAuthed() {
  return !!getToken();
}

// --------------------
// USER
// --------------------

export function setUser(user) {
  if (typeof window === "undefined") return;

  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);

  return raw ? JSON.parse(raw) : null;
}
