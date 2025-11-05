import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { authService, login as loginApi, logout as logoutApi, register as registerApi, getCurrentUser } from '../services/authService';
import { User } from '../models/User';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    // optional: hydrate user from storage if your backend provides it
    setUser(getCurrentUser());
  }, []);

  const login = async (email: string, password: string) => {
    const u = await loginApi(email, password);
    setUser(u);
    try { localStorage.setItem('user', JSON.stringify(u)); } catch {}
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (name: string, email: string, password: string) => {
    const u = await registerApi(name, email, password);
    setUser(u);
    try { localStorage.setItem('user', JSON.stringify(u)); } catch {}
  };

  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>;
};