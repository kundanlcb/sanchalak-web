/**
 * Authentication Types
 * Domain types that derive from generated API models where shapes overlap.
 * Components should ALWAYS import from here — never from src/api/ directly.
 */

import type { UserRole } from '../../../utils/permissions/checkPermission';

// ============================================================================
// Re-exported API Types (for service layer use)
// ============================================================================

/** Generated request/response DTOs — use these in services that call the API directly */
export type { OtpRequestDto } from '../../../api/models/otp-request-dto';
export type { OtpVerifyDto } from '../../../api/models/otp-verify-dto';
export type { RefreshTokenRequestDto } from '../../../api/models/refresh-token-request-dto';
export type { LoginRequest } from '../../../api/models/login-request';
export type { AuthTokenResponseDto } from '../../../api/models/auth-token-response-dto';
export type { UserProfileDto } from '../../../api/models/user-profile-dto';

// Re-export UserRole for convenience
export type { UserRole };

// ============================================================================
// Domain Types (used by components and stores)
// ============================================================================

export interface User {
  userID: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  profilePhoto?: string;
  themePreference: ThemePreference;
  isActive: boolean;
  permissions?: string[];
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
  otpSentAt: string;
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
  expiresAt: string;
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
