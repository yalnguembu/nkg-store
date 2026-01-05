"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';
import { client } from './api/client.gen';
import '@/lib/config';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      const user = JSON.parse(storedUser);
      setState({
        token: storedToken,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Configure API client with token
      client.setConfig({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    setState({
      token,
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    client.setConfig({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    client.setConfig({
      headers: {
        Authorization: undefined,
      },
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
