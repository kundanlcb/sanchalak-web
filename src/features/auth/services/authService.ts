/**
 * Authentication Service
 * API client functions for auth operations
 */

import apiClient from '../../../services/api/client';
import API_CONFIG from '../../../services/api/config';
import {
  handleLoginOTP,
  handleVerifyOTP,
  handleLoginEmail,
  handleRefreshToken,
  handleLogout,
} from '../../../mocks/handlers/authHandlers';
import type {
  LoginOTPResponse,
  AuthResponse,
  RefreshTokenResponse,
  LogoutResponse,
} from '../types/auth.types';

/**
 * Request OTP for mobile number
 */
export async function loginWithOTP(mobileNumber: string): Promise<LoginOTPResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleLoginOTP({ mobileNumber });
  }

  const response = await apiClient.post<LoginOTPResponse>('/auth/login-otp', {
    mobileNumber,
  });
  return response.data;
}

/**
 * Verify OTP and get auth token
 */
export async function verifyOTP(
  mobileNumber: string,
  otp: string
): Promise<AuthResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleVerifyOTP({ mobileNumber, otp });
  }

  const response = await apiClient.post<AuthResponse>('/auth/verify-otp', {
    mobileNumber,
    otp,
  });
  return response.data;
}

/**
 * Login with email and password (Admin only)
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleLoginEmail({ email, password });
  }

  const response = await apiClient.post<AuthResponse>('/auth/login-email', {
    email,
    password,
  });
  return response.data;
}

/**
 * Refresh JWT token using refresh token
 */
export async function refreshToken(refreshTokenValue: string): Promise<RefreshTokenResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleRefreshToken({ refreshToken: refreshTokenValue });
  }

  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
    refreshToken: refreshTokenValue,
  });
  return response.data;
}

/**
 * Logout current user
 */
export async function logout(token: string): Promise<LogoutResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleLogout({ token });
  }

  const response = await apiClient.post<LogoutResponse>('/auth/logout', {
    token,
  });
  return response.data;
}
