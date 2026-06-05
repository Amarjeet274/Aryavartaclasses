const BASE_URL = 'http://localhost:3001/api';
const TOKEN_KEY = 'aryavarta_token';
const USER_KEY = 'aryavarta_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function setUser(user: { id: string; email: string }) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function applyAuthSession(token: string, user: { id: string; email: string }) {
  setToken(token);
  setUser(user);
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function signIn(email: string, password: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { data: null, error: { message: json.error || 'Login failed' } };
    }

    if (json.data?.requiresVerification) {
      return { data: json.data, error: null };
    }

    applyAuthSession(json.data.token, json.data.user);
    return { data: { session: { access_token: json.data.token }, user: json.data.user }, error: null };
  } catch {
    return { data: null, error: { message: 'Connection error. Is the server running?' } };
  }
}

export async function verifyEmailCode(challengeId: string, code: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId, code }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { data: null, error: { message: json.error || 'Verification failed' } };
    }

    applyAuthSession(json.data.token, json.data.user);
    return { data: { session: { access_token: json.data.token }, user: json.data.user }, error: null };
  } catch {
    return { data: null, error: { message: 'Connection error. Is the server running?' } };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { data: null, error: { message: json.error || 'Password reset request failed' } };
    }
    return { data: json.data, error: null };
  } catch {
    return { data: null, error: { message: 'Connection error. Is the server running?' } };
  }
}

export async function resetPassword(resetId: string, code: string, password: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetId, code, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { data: null, error: { message: json.error || 'Password reset failed' } };
    }
    return { data: json.data, error: null };
  } catch {
    return { data: null, error: { message: 'Connection error. Is the server running?' } };
  }
}

export async function signOut() {
  clearAuth();
  return { error: null };
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return { user: null, error: null };
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) {
      clearAuth();
      return { user: null, error: { message: json.error } };
    }
    return { user: json.data.user, error: null };
  } catch {
    return { user: null, error: { message: 'Connection error' } };
  }
}

export async function getSession() {
  const token = getToken();
  if (!token) return { session: null, error: null };
  return { session: { access_token: token }, error: null };
}
