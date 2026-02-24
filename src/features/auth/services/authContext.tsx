/**
 * Authentication Context
 * Global auth state management with useAuth hook
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as authService from './authService';
import { queryClient } from '../../../lib/queryClient';
import type { User, AuthContextType } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('authToken');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
      }
    }

    setIsLoading(false);
  }, []);



  /**
   * Login with email and password (Admin only)
   */
  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.loginWithEmail(email, password);

      // Store auth data
      sessionStorage.setItem('authToken', response.token);
      sessionStorage.setItem('refreshToken', response.refreshToken);
      sessionStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout current user
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 1. Clear session storage completely
      sessionStorage.clear();

      // 2. Comprehensive localStorage cleanup (preserve theme)
      const themePref = localStorage.getItem('theme');
      localStorage.clear();
      if (themePref) {
        localStorage.setItem('theme', themePref);
      }

      // 3. Clear query cache
      queryClient.clear();

      // 4. Reset local state
      setUser(null);
      setIsLoading(false);

      // 5. Force redirect to login to ensure fresh start
      window.location.href = '/login';
    }
  };

  /**
   * Refresh JWT token
   */
  const refreshTokenFunc = async (): Promise<void> => {
    const refreshTokenValue = sessionStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      throw new Error('No refresh token found');
    }

    try {
      const response = await authService.refreshToken(refreshTokenValue);
      sessionStorage.setItem('authToken', response.token);
    } catch (error) {
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginWithEmail,
    logout,
    refreshToken: refreshTokenFunc,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
