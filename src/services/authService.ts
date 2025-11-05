import axios from 'axios';
import api from './api';
import { User } from '../models/User';

// Login endpoint: prefer env override, otherwise use relative path so CRA proxy or same-origin works
const LOGIN_URL = process.env.REACT_APP_API_LOGIN || 'http://localhost:5000/api/auth/login';

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
    try { api.defaults.headers.common['Authorization'] = `Bearer ${token}`; } catch {}
  } else {
    delete axios.defaults.headers.common['Authorization'];
    try { delete api.defaults.headers.common['Authorization']; } catch {}
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
  } catch {}
  setAuthHeader(token);

  // Attempt to decode user information from the JWT
  const payload = parseJwt(token);
  const user: User = {
    id: payload?.sub || payload?.id || '',
    name: payload?.name || payload?.full_name || '',
    email: payload?.email || email,
    role: (payload?.role as any) || 'user'
  };

  try { localStorage.setItem('user', JSON.stringify(user)); } catch {}
  return user;
}

export async function register(name: string, email: string, password: string): Promise<User> {
  // Call register endpoint. Some backends return a token (or { user, token }).
  const res = await axios.post<any>('/auth/register', { name, email, password }, {
    headers: { 'Content-Type': 'application/json' }
  });

  const data = res.data;

  // If backend returned a token (or { token, user }), treat user as logged in.
  const token = data?.token || data?.accessToken || null;
  const userFromBody = data?.user || data;

  if (token) {
    try { localStorage.setItem('token', token); } catch {}
    setAuthHeader(token);

    // Attempt to decode user from token
    const payload = parseJwt(token);
    const user: User = {
      id: payload?.sub || payload?.id || userFromBody?.id || userFromBody?._id || '',
      name: payload?.name || userFromBody?.name || '',
      email: payload?.email || email,
      role: (payload?.role as any) || (userFromBody?.role as any) || 'user'
    };

    try { localStorage.setItem('user', JSON.stringify(user)); } catch {}
    return user;
  }

  // If no token, but server returned a user object, return it (no auto-login)
  if (userFromBody && (userFromBody.id || userFromBody._id || userFromBody.name)) {
    const user: User = {
      id: userFromBody._id || userFromBody.id || '',
      name: userFromBody.name || '',
      email: userFromBody.email || email,
      role: (userFromBody.role as any) || 'user'
    };
    return user;
  }

  throw new Error('Registration failed');
}

export function logout() {
  try { localStorage.removeItem('token'); } catch {}
  try { localStorage.removeItem('user'); } catch {}
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
        try { localStorage.setItem('user', JSON.stringify(user)); } catch {}
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