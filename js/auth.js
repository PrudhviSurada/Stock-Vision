/**
 * auth.js
 * -------
 * Client-only authentication for Stock Lens.
 * - Registered users persist in LocalStorage (key: "stocklens_users").
 * - The active session lives in SessionStorage (key: "stocklens_session")
 *   so it clears automatically when the browser tab/window closes.
 *
 * This is intentionally NOT secure (passwords are stored in plain text in
 * the browser) — it exists only to demonstrate a working front-end auth
 * flow with no backend, per the project's technology constraints.
 */

const USERS_KEY = "stocklens_users";
const SESSION_KEY = "stocklens_session";

/* ---------- storage helpers ---------- */

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch (e) {
    return null;
  }
}

function setSession(user) {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ fullName: user.fullName, email: user.email })
  );
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

/* ---------- validation helpers ---------- */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone.replace(/\D/g, "").slice(-10));
}

function isValidPassword(password) {
  // At least 6 characters — kept simple and clearly stated to the user.
  return password.length >= 6;
}

/* ---------- core auth actions ---------- */

/**
 * Registers a new user.
 * @returns {{ok: boolean, message: string}}
 */
function registerUser({ fullName, phone, email, password, confirmPassword }) {
  if (!fullName || fullName.trim().length < 2) {
    return { ok: false, message: "Please enter your full name." };
  }
  if (!isValidPhone(phone)) {
    return { ok: false, message: "Please enter a valid 10-digit phone number." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (!isValidPassword(password)) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }
  if (password !== confirmPassword) {
    return { ok: false, message: "Passwords do not match." };
  }

  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { ok: false, message: "An account with this email already exists. Please sign in instead." };
  }

  users.push({ fullName: fullName.trim(), phone, email: email.toLowerCase(), password });
  saveUsers(users);
  return { ok: true, message: "Account created successfully! Redirecting to sign in..." };
}

/**
 * Logs a user in.
 * @returns {{ok: boolean, message: string}}
 */
function loginUser({ email, password }) {
  if (!isValidEmail(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (!password) {
    return { ok: false, message: "Please enter your password." };
  }

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return { ok: false, message: "Incorrect email or password." };
  }

  setSession(user);
  return { ok: true, message: "Welcome back! Redirecting to your dashboard..." };
}

function logoutUser() {
  clearSession();
  window.location.href = "index.html";
}

/**
 * Guards a page that requires authentication. Call at the top of
 * dashboard.html's script. Redirects to the landing page if no
 * active session is found.
 */
function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  return session;
}

/**
 * Guards the auth pages (index/login/register) so an already-logged-in
 * user is sent straight to the dashboard instead of seeing auth forms again.
 */
function redirectIfLoggedIn() {
  const session = getSession();
  if (session) {
    window.location.href = "dashboard.html";
  }
}
