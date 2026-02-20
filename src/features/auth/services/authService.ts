/**
 * Authentication Service
 * API client functions for auth operations
 */

import { authApi } from '../../../api/instances';
// Import types from generated client and local types
import type {
  LoginOTPResponse,
  AuthResponse,
  RefreshTokenResponse,
  LogoutResponse
} from '../types/auth.types';

/**
 * Request OTP for mobile number
 */
export async function loginWithOTP(mobileNumber: string): Promise<LoginOTPResponse> {
  try {
    const response = await authApi.requestOtp({ otpRequestDto: { mobileNumber } });
    // Map backend response to frontend expected format
    return {
      success: response.data.success ?? false,
      message: response.data.data ?? response.data.error?.message ?? 'OTP sent',
      otpSentAt: new Date().toISOString()
    };
  } catch (error: any) {
    if (error.response?.data) {
      const errData = error.response.data;
      throw new Error(errData.error?.message || errData.message || 'Failed to send OTP');
    }
    throw error;
  }
}

/**
 * Verify OTP and get auth token
 */
const mapBackendRoleToFrontend = (backendRole: string): 'Admin' | 'Teacher' | 'Staff' | 'Parent' | 'Student' => {
  switch (backendRole) {
    case 'ROLE_ADMIN':
      return 'Admin';
    case 'ROLE_TEACHER':
      return 'Teacher';
    case 'ROLE_STUDENT':
      return 'Student';
    case 'ROLE_PARENT':
      return 'Parent';
    case 'ROLE_USER':
    default:
      return 'Staff'; // Default fallback
  }
};

export async function verifyOTP(
  mobileNumber: string,
  otp: string
): Promise<AuthResponse> {
  try {
    const response = await authApi.verifyOtp({ otpVerifyDto: { mobileNumber, otp } });
    const data = response.data.data;

    if (!response.data.success || !data) {
      throw new Error(response.data.error?.message || 'Verification failed');
    }

    return {
      success: true,
      token: data.accessToken || '',
      refreshToken: data.refreshToken || '',
      user: {
        userID: data.user?.userId || '',
        name: `${data.user?.firstName || ''} ${data.user?.lastName || ''}`.trim(),
        email: data.user?.email || '',
        mobileNumber: data.user?.mobileNumber || '',
        role: mapBackendRoleToFrontend(data.user?.role as string),
        permissions: data.user?.permissions || [],
        themePreference: 'system',
        isActive: true, // Backend doesn't return this yet
        createdDate: new Date().toISOString()
      },
      expiresAt: new Date(Date.now() + (data.expiresIn || 3600) * 1000).toISOString()
    };
  } catch (error: any) {
    console.error('OTP Verification Error:', error);
    throw error;
  }
}

/**
 * Login with email and password (Admin only)
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await authApi.authenticateUser({ loginRequest: { email, password } });

    // Warning: The generated client might return 'object' because spec says 'object'.
    // We cast to any to access fields we expect.
    const result = response.data as any; // ApiResultAuthTokenResponseDto like structure?

    if (result.success !== undefined && !result.success) {
      throw new Error(result.error?.message || 'Login failed');
    }

    // If mapping is needed:
    const data = result.data || result; // Fallback

    return {
      success: true,
      token: data.accessToken,
      refreshToken: data.refreshToken,
      user: {
        userID: data.user?.userId || '',
        name: `${data.user?.firstName || ''} ${data.user?.lastName || ''}`.trim(),
        email: data.user?.email,
        mobileNumber: data.user?.mobileNumber,
        role: mapBackendRoleToFrontend(data.user?.role as string),
        permissions: data.user?.permissions || [],
        themePreference: 'system',
        isActive: true,
        createdDate: new Date().toISOString()
      },
      expiresAt: new Date(Date.now() + (data.expiresIn || 3600) * 1000).toISOString()
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Refresh JWT token using refresh token
 */
export async function refreshToken(refreshTokenValue: string): Promise<RefreshTokenResponse> {
  try {
    const response = await authApi.refreshToken({ refreshTokenRequestDto: { refreshToken: refreshTokenValue } });
    const data = response.data.data;

    if (!data) throw new Error('No data received');

    return {
      success: response.data.success || true,
      token: data.accessToken || '',
      expiresAt: new Date(Date.now() + (data.expiresIn || 3600) * 1000).toISOString()
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Logout current user
 */
export async function logout(token: string): Promise<LogoutResponse> {
  try {
    const response = await authApi.logout({ refreshTokenRequestDto: { refreshToken: token } });

    return {
      success: response.data.success || true,
      message: response.data.data || 'Logged out'
    };
  } catch (error) {
    // Ignore logout errors
    return { success: true, message: 'Logged out' };
  }
}
