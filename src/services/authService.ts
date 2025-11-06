import axios from 'axios';
import api from './api';
import { User } from '../models/User';

// Login endpoint: prefer env override, otherwise use relative path so CRA proxy or same-origin works
const LOGIN_URL = process.env.REACT_APP_API_LOGIN || 'http://localhost:5000/api/auth/login';
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper: safe JWT parse (returns payload or null)
function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

// Ensure axios has Authorization header when token present
function setAuthHeader(token?: string | null) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // also keep our api client in sync
    try { api.defaults.headers.common['Authorization'] = `Bearer ${token}`; } catch { }
  } else {
    delete axios.defaults.headers.common['Authorization'];
    try { delete api.defaults.headers.common['Authorization']; } catch { }
  }
}

export async function login(email: string, password: string): Promise<User> {
  const res = await axios.post<{ token: string }>(LOGIN_URL, { email, password }, {
    headers: { 'Content-Type': 'application/json' }
  });

  const token = res.data?.token;
  if (!token) throw new Error('Login did not return a token');

  // store token and set default header
  try {
    localStorage.setItem('token', token);
  } catch { }
  setAuthHeader(token);

  // Attempt to decode user information from the JWT
  const payload = parseJwt(token);
  const user: User = {
    id: payload?.sub || payload?.id || '',
    name: payload?.name || payload?.full_name || '',
    email: payload?.email || email,
    role: (payload?.role as any) || 'user'
  };

  try { localStorage.setItem('user', JSON.stringify(user)); } catch { }
  return user;
}

export async function register(name: string, email: string, password: string): Promise<User | null> {
  // Call register endpoint. Backends vary: some return { token }, { user }, or { user, token }.
  const res = await axios.post<any>(BASE_URL + '/auth/register', { name, email, password }, {
    headers: { 'Content-Type': 'application/json' }
  });

  const data = res.data || {};

  // Prefer any token fields commonly used
  const token: string | null = data?.token || data?.accessToken || data?.access_token || null;

  // If token provided, persist and set header
  if (token) {
    try { localStorage.setItem('token', token); } catch { }
    setAuthHeader(token);
  }

  // If backend returned a user object, normalize and persist. If no token was returned
  // try to automatically login using provided credentials to obtain a token (some APIs require this).
  if (data?.user) {
    // If server didn't return a token but did create the user, try to log them in to obtain a token.
    if (!token) {
      try {
        const loggedIn = await login(email, password);
        return loggedIn;
      } catch (err) {
        // ignore login failure — fall back to returning the user object returned by register
      }
    }

    const u: User = {
      id: data.user.id || data.user._id || data.user.sub || '',
      name: data.user.name || data.user.full_name || data.user.fullName || '',
      email: data.user.email || email,
      role: data.user.role || 'user'
    };
    try { localStorage.setItem('user', JSON.stringify(u)); } catch { }
    return u;
  }

  // If no user returned but we have a token, decode it to build a User
  if (token) {
    const payload = parseJwt(token);
    const u: User = {
      id: payload?.sub || payload?.id || '',
      name: payload?.name || payload?.full_name || '',
      email: payload?.email || email,
      role: (payload?.role as any) || 'user'
    };
    try { localStorage.setItem('user', JSON.stringify(u)); } catch { }
    return u;
  }

  // No token or user returned
  return null;
}

export function logout() {
  try { localStorage.removeItem('token'); } catch { }
  try { localStorage.removeItem('user'); } catch { }
  setAuthHeader(null);
}

export function getCurrentUser(): User | null {
  // Prefer stored user
  try {
    const raw = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (token) setAuthHeader(token);
    if (raw) return JSON.parse(raw) as User;

    // If no stored user but we have a token, decode it
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        const user: User = {
          id: payload?.sub || payload?.id || '',
          name: payload?.name || payload?.full_name || '',
          email: payload?.email || '',
          role: (payload?.role as any) || 'user'
        };
        try { localStorage.setItem('user', JSON.stringify(user)); } catch { }
        return user;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// compatibility object used across the app
export const authService = { login, register, logout, getCurrentUser };

export default authService;