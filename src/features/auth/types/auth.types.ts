/**
 * Authentication Types
 * Type definitions for login, OTP, JWT tokens, and auth responses
 */

import { type UserRole } from '../../../utils/permissions/checkPermission';

// Re-export UserRole for convenience
export type { UserRole };

export interface User {
  userID: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  profilePhoto?: string;
  themePreference: ThemePreference;
  isActive: boolean;
  createdDate: string;
  lastLoginDate?: string;
}

export type ThemePreference = 'light' | 'dark' | 'system';

// Login with OTP flow
export interface LoginOTPRequest {
  mobileNumber: string;
}

export interface LoginOTPResponse {
  success: boolean;
  message: string;
  otpSentAt: string; // Timestamp when OTP was sent
}

export interface VerifyOTPRequest {
  mobileNumber: string;
  otp: string;
}

// Login with Email/Password (Admin only)
export interface LoginEmailRequest {
  email: string;
  password: string;
}

// Unified auth response for both login methods
export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: string; // ISO 8601 timestamp
}

// Token refresh
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  expiresAt: string;
}

// Logout
export interface LogoutRequest {
  token: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// Auth context state
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithOTP: (mobileNumber: string) => Promise<LoginOTPResponse>;
  verifyOTP: (mobileNumber: string, otp: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
