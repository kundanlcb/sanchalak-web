/**
 * Authentication Context
 * Global auth state management with useAuth hook
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as authService from './authService';
import type { User, AuthContextType, LoginOTPResponse } from '../types/auth.types';

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
   * Step 1: Request OTP for mobile number
   */
  const loginWithOTP = async (mobileNumber: string): Promise<LoginOTPResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.loginWithOTP(mobileNumber);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 2: Verify OTP and complete login
   */
  const verifyOTP = async (mobileNumber: string, otp: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(mobileNumber, otp);

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
      // Clear local state regardless of API success
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
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
    loginWithOTP,
    verifyOTP,
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
