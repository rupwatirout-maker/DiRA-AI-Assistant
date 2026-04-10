const USERNAME_KEY = "dira_username";
const PASSWORD_KEY = "dira_password";
const LOGGED_IN_KEY = "dira_logged_in";

export function hasSavedCredentials() {
  const username = localStorage.getItem(USERNAME_KEY);
  const password = localStorage.getItem(PASSWORD_KEY);
  return Boolean(username && password);
}

export function isAuthenticated() {
  return localStorage.getItem(LOGGED_IN_KEY) === "true";
}

export function saveCredentials(username, password) {
  localStorage.setItem(USERNAME_KEY, username.trim());
  localStorage.setItem(PASSWORD_KEY, password.trim());
  localStorage.setItem(LOGGED_IN_KEY, "true");
}

export function loginUser(username, password) {
  const savedUsername = localStorage.getItem(USERNAME_KEY);
  const savedPassword = localStorage.getItem(PASSWORD_KEY);

  if (
    username.trim() === savedUsername &&
    password.trim() === savedPassword
  ) {
    localStorage.setItem(LOGGED_IN_KEY, "true");
    return true;
  }

  return false;
}

export function logoutUser() {
  localStorage.setItem(LOGGED_IN_KEY, "false");
}

export function resetCredentials() {
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(PASSWORD_KEY);
  localStorage.removeItem(LOGGED_IN_KEY);
}

export function getSavedUsername() {
  return localStorage.getItem(USERNAME_KEY) || "User";
}