/**
 * Authentication Mock Handlers
 * Simulates backend auth API with realistic delays and OTP validation
 */

import usersData from '../data/users.json';
import type {
  LoginOTPRequest,
  LoginOTPResponse,
  VerifyOTPRequest,
  LoginEmailRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  ThemePreference,
  UserRole,
} from '../../features/auth/types/auth.types';

// Mock OTP storage (in-memory for demo)
const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();
const MOCK_OTP = '123456'; // Fixed OTP for testing
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 3;
const RATE_LIMIT_MS = 30 * 60 * 1000; // 30 minutes block after max attempts

// Simulate realistic API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock handler: Send OTP to mobile number
 */
export async function handleLoginOTP(
  request: LoginOTPRequest
): Promise<LoginOTPResponse> {
  await delay(300); // Simulate network delay

  const { mobileNumber } = request;

  // Find user by mobile number
  const user = usersData.find((u) => u.mobileNumber === mobileNumber);

  if (!user) {
    throw new Error('User not found with this mobile number');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive. Please contact administrator.');
  }

  // Check if user is rate limited
  const existing = otpStore.get(mobileNumber);
  if (existing && existing.attempts >= MAX_OTP_ATTEMPTS) {
    const blockUntil = existing.expiresAt + RATE_LIMIT_MS;
    if (Date.now() < blockUntil) {
      const minutesLeft = Math.ceil((blockUntil - Date.now()) / 60000);
      throw new Error(
        `Too many failed attempts. Please try again after ${minutesLeft} minutes.`
      );
    }
  }

  // Generate OTP (always 123456 for mock)
  const otp = MOCK_OTP;
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  otpStore.set(mobileNumber, { otp, expiresAt, attempts: 0 });

  return {
    success: true,
    message: `OTP sent to ${mobileNumber}. Valid for 10 minutes. (Mock OTP: 123456)`,
    otpSentAt: new Date().toISOString(),
  };
}

/**
 * Mock handler: Verify OTP and return auth token
 */
export async function handleVerifyOTP(
  request: VerifyOTPRequest
): Promise<AuthResponse> {
  await delay(400); // Simulate network delay

  const { mobileNumber, otp } = request;

  // Find user
  const user = usersData.find((u) => u.mobileNumber === mobileNumber);

  if (!user) {
    throw new Error('User not found');
  }

  // Check OTP
  const stored = otpStore.get(mobileNumber);

  if (!stored) {
    throw new Error('No OTP found. Please request a new OTP.');
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(mobileNumber);
    throw new Error('OTP expired. Please request a new OTP.');
  }

  if (stored.otp !== otp) {
    stored.attempts += 1;
    otpStore.set(mobileNumber, stored);

    if (stored.attempts >= MAX_OTP_ATTEMPTS) {
      throw new Error(
        `Maximum OTP attempts exceeded. Account locked for 30 minutes.`
      );
    }

    throw new Error(`Invalid OTP. ${MAX_OTP_ATTEMPTS - stored.attempts} attempts remaining.`);
  }

  // OTP is valid - clear it and generate auth token
  otpStore.delete(mobileNumber);

  const token = `mock-jwt-${user.userID}-${Date.now()}`;
  const refreshToken = `mock-refresh-${user.userID}-${Date.now()}`;
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(); // 8 hours

  return {
    success: true,
    token,
    refreshToken,
    user: {
      userID: user.userID,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role as UserRole,
      profilePhoto: user.profilePhoto || undefined,
      themePreference: user.themePreference as ThemePreference,
      isActive: user.isActive,
      createdDate: user.createdDate,
      lastLoginDate: new Date().toISOString(),
    },
    expiresAt,
  };
}

/**
 * Mock handler: Login with email and password (Admin only)
 */
export async function handleLoginEmail(
  request: LoginEmailRequest
): Promise<AuthResponse> {
  await delay(400);

  const { email, password } = request;

  // Find admin user
  const user = usersData.find((u) => u.email === email && u.role === 'Admin');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  // Mock password validation (in real app, compare with bcrypt hash)
  // For mock: accept any password for demo, or hardcode "admin123"
  if (password !== 'admin123') {
    throw new Error('Invalid email or password');
  }

  const token = `mock-jwt-${user.userID}-${Date.now()}`;
  const refreshToken = `mock-refresh-${user.userID}-${Date.now()}`;
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

  return {
    success: true,
    token,
    refreshToken,
    user: {
      userID: user.userID,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role as UserRole,
      profilePhoto: user.profilePhoto || undefined,
      themePreference: user.themePreference as ThemePreference,
      isActive: user.isActive,
      createdDate: user.createdDate,
      lastLoginDate: new Date().toISOString(),
    },
    expiresAt,
  };
}

/**
 * Mock handler: Refresh JWT token
 */
export async function handleRefreshToken(
  request: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  await delay(200);

  const { refreshToken } = request;

  // Basic validation (in real app, verify refresh token signature)
  if (!refreshToken || !refreshToken.startsWith('mock-refresh-')) {
    throw new Error('Invalid refresh token');
  }

  // Extract userID from refresh token (mock logic)
  const parts = refreshToken.split('-');
  const userID = parts[2];

  const user = usersData.find((u) => u.userID === userID);

  if (!user) {
    throw new Error('User not found');
  }

  const newToken = `mock-jwt-${userID}-${Date.now()}`;
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

  return {
    success: true,
    token: newToken,
    expiresAt,
  };
}

/**
 * Mock handler: Logout (invalidate token)
 */
export async function handleLogout(_request: LogoutRequest): Promise<LogoutResponse> {
  await delay(200);

  // In real app, add token to blacklist in backend
  // For mock, just return success

  return {
    success: true,
    message: 'Logged out successfully',
  };
}
