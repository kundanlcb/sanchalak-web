/**
 * Authentication Mock Handlers
 * Simulates backend auth API with realistic delays and OTP validation
 */

import usersData from '../data/users.json';
import type {
  LoginEmailRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  ThemePreference,
  UserRole,
} from '../../features/auth/types/auth.types';

// Simulate realistic API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));



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
