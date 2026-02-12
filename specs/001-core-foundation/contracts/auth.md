# Authentication API Contract

**Base Path**: `/api/auth`  
**Version**: 1.0.0  
**Updated**: 2026-02-11  

---

## Endpoints

### 1. Request OTP for Mobile Login

**POST** `/api/auth/login-otp`

Initiates OTP-based authentication flow by sending a one-time password to the user's registered mobile number.

#### Request

```typescript
interface LoginOTPRequest {
  mobileNumber: string;    // Format: +91XXXXXXXXXX (10-15 digits)
  role?: UserRole;         // Optional: Pre-select role (Admin, Teacher, Staff, Parent, Student)
}
```

**Example**:
```json
{
  "mobileNumber": "+919876543210",
  "role": "Teacher"
}
```

#### Response (Success - 200 OK)

```typescript
interface LoginOTPResponse {
  success: boolean;
  message: string;
  otpSentTo: string;       // Masked mobile: +91XXXXXX3210
  expiresIn: number;       // OTP validity in seconds (300 = 5 minutes)
  sessionToken: string;    // Temporary token for OTP verification step
}
```

**Example**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otpSentTo": "+91XXXXXX3210",
  "expiresIn": 300,
  "sessionToken": "temp_abc123xyz"
}
```

#### Response (Error - 404 Not Found)

```json
{
  "success": false,
  "error": "USER_NOT_FOUND",
  "message": "No user found with this mobile number"
}
```

#### Response (Error - 429 Too Many Requests)

```json
{
  "success": false,
  "error": "TOO_MANY_ATTEMPTS",
  "message": "Maximum OTP requests reached. Please try again after 10 minutes.",
  "retryAfter": 600
}
```

---

### 2. Verify OTP

**POST** `/api/auth/verify-otp`

Validates the OTP entered by user and issues JWT tokens upon successful verification.

#### Request

```typescript
interface VerifyOTPRequest {
  sessionToken: string;    // Temporary token from login-otp response
  otp: string;             // 6-digit OTP code
}
```

**Example**:
```json
{
  "sessionToken": "temp_abc123xyz",
  "otp": "123456"
}
```

#### Response (Success - 200 OK)

```typescript
interface VerifyOTPResponse {
  success: boolean;
  user: {
    userID: string;
    name: string;
    email: string;
    mobileNumber: string;
    role: UserRole;
    profilePhoto?: string;
  };
  tokens: {
    accessToken: string;   // JWT valid for 1 hour
    refreshToken: string;  // JWT valid for 7 days
    expiresIn: number;     // Access token TTL in seconds (3600)
  };
}
```

**Example**:
```json
{
  "success": true,
  "user": {
    "userID": "user-002",
    "name": "Priya Sharma",
    "email": "priya.teacher@sanchalak.school",
    "mobileNumber": "+919876543211",
    "role": "Teacher",
    "profilePhoto": "/assets/profiles/teacher1.jpg"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8...",
    "expiresIn": 3600
  }
}
```

#### Response (Error - 401 Unauthorized)

```json
{
  "success": false,
  "error": "INVALID_OTP",
  "message": "The OTP entered is incorrect",
  "attemptsRemaining": 2
}
```

#### Response (Error - 410 Gone)

```json
{
  "success": false,
  "error": "OTP_EXPIRED",
  "message": "OTP has expired. Please request a new one."
}
```

---

### 3. Email/Password Login (Admin Only)

**POST** `/api/auth/login-email`

Traditional email/password authentication for Admin users only.

#### Request

```typescript
interface LoginEmailRequest {
  email: string;           // Valid email format
  password: string;        // Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special
}
```

**Example**:
```json
{
  "email": "admin@sanchalak.school",
  "password": "SecurePass123!"
}
```

#### Response (Success - 200 OK)

Same structure as `VerifyOTPResponse` above.

#### Response (Error - 403 Forbidden)

```json
{
  "success": false,
  "error": "METHOD_NOT_ALLOWED",
  "message": "Email login is only available for Admin users"
}
```

#### Response (Error - 401 Unauthorized)

```json
{
  "success": false,
  "error": "INVALID_CREDENTIALS",
  "message": "Email or password is incorrect",
  "accountLocked": false
}
```

**Account Lockout**: After 5 failed attempts, account is locked for 30 minutes:
```json
{
  "success": false,
  "error": "ACCOUNT_LOCKED",
  "message": "Too many failed login attempts. Account locked for 30 minutes.",
  "lockedUntil": "2026-02-11T10:30:00Z"
}
```

---

### 4. Refresh Access Token

**POST** `/api/auth/refresh`

Obtains a new access token using a valid refresh token. Call this when access token expires (HTTP 401 with `TOKEN_EXPIRED` error).

#### Request

**Headers**:
```
Authorization: Bearer <refresh_token>
```

No request body required.

#### Response (Success - 200 OK)

```typescript
interface RefreshTokenResponse {
  success: boolean;
  tokens: {
    accessToken: string;   // New access token (1 hour validity)
    refreshToken: string;  // New refresh token (7 days validity)
    expiresIn: number;
  };
}
```

**Example**:
```json
{
  "success": true,
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8...",
    "expiresIn": 3600
  }
}
```

#### Response (Error - 401 Unauthorized)

```json
{
  "success": false,
  "error": "INVALID_REFRESH_TOKEN",
  "message": "Refresh token is invalid or expired. Please login again."
}
```

---

### 5. Logout

**POST** `/api/auth/logout`

Invalidates current user session and refresh token.

#### Request

**Headers**:
```
Authorization: Bearer <access_token>
```

No request body required.

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Response (Error - 401 Unauthorized)

```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

---

## Authentication Flow Diagrams

### OTP Login Flow

```
Client                          Backend
  |                               |
  |--POST /auth/login-otp-------->|
  |  {mobileNumber}               | [Lookup user by mobile]
  |                               | [Generate OTP, store in cache]
  |                               | [Send SMS via gateway]
  |<--{sessionToken, otpSentTo}---|
  |                               |
  | [User enters OTP]             |
  |                               |
  |--POST /auth/verify-otp------->|
  |  {sessionToken, otp}          | [Validate OTP]
  |                               | [Generate JWT tokens]
  |<--{user, accessToken, --------|
  |     refreshToken}             |
  |                               |
  | [Store tokens in storage]     |
```

### Token Refresh Flow

```
Client                          Backend
  |                               |
  |--GET /api/students----------->| [Try to validate access token]
  |  Authorization: Bearer <AT>   | [Access token expired]
  |<--401 TOKEN_EXPIRED-----------|
  |                               |
  |--POST /auth/refresh---------->|
  |  Authorization: Bearer <RT>   | [Validate refresh token]
  |                               | [Issue new access token]
  |<--{new accessToken, ---------|
  |     new refreshToken}         |
  |                               |
  |--GET /api/students----------->| [Retry with new token]
  |  Authorization: Bearer <new>  |
  |<--200 {students}--------------|
```

---

## Security Considerations

### OTP Generation
- 6-digit numeric code
- Valid for 5 minutes
- Maximum 3 verification attempts per OTP
- Rate limit: 5 OTP requests per mobile number per hour

### Password Requirements (Admin Only)
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character (@$!%*?&#)
- No common passwords (check against dictionary)

### JWT Token Details

**Access Token**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-002",
    "name": "Priya Sharma",
    "role": "Teacher",
    "email": "priya.teacher@sanchalak.school",
    "iat": 1707646800,
    "exp": 1707650400
  }
}
```

**Refresh Token**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-002",
    "type": "refresh",
    "iat": 1707646800,
    "exp": 1708251600
  }
}
```

### Storage Recommendations

**Client-Side Storage**:
- `accessToken`: Store in `sessionStorage` (cleared on tab close)
- `refreshToken`: Store in `localStorage` (persists across sessions)
- Never store tokens in cookies if app is public-facing (CSRF risk)

**Backend Storage**:
- Refresh tokens stored in database with user association
- On logout, delete refresh token from database
- Implement token rotation: issue new refresh token on each refresh

---

## Error Codes Reference

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `USER_NOT_FOUND` | 404 | Mobile number not registered |
| `TOO_MANY_ATTEMPTS` | 429 | Rate limit exceeded |
| `INVALID_OTP` | 401 | Incorrect OTP entered |
| `OTP_EXPIRED` | 410 | OTP validity period elapsed |
| `METHOD_NOT_ALLOWED` | 403 | Email login attempted by non-Admin |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `ACCOUNT_LOCKED` | 403 | Too many failed login attempts |
| `INVALID_REFRESH_TOKEN` | 401 | Refresh token invalid/expired |
| `TOKEN_EXPIRED` | 401 | Access token expired (trigger refresh) |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |

---

## Testing with Mock API

### Mock OTP Values
For development/testing with `VITE_USE_MOCK_API=true`:

- **Any mobile number**: Accepts any valid format
- **Valid OTP**: `123456` (always works)
- **Invalid OTP**: Any other code (triggers error)
- **Session token**: Auto-generated, no validation

### Mock Users
```json
{
  "mobileNumber": "+919876543210",
  "role": "Admin",
  "otp": "123456"
}
{
  "mobileNumber": "+919876543211",
  "role": "Teacher",
  "otp": "123456"
}
```

### Mock Delays
- `POST /login-otp`: 500ms delay
- `POST /verify-otp`: 300ms delay
- `POST /refresh`: 200ms delay
- 5% random error rate on all endpoints

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /login-otp` | 5 requests | 60 minutes per mobile |
| `POST /verify-otp` | 3 attempts | Per OTP (resets on new OTP) |
| `POST /login-email` | 10 requests | 15 minutes per IP |
| `POST /refresh` | 20 requests | 15 minutes per user |
| `POST /logout` | 10 requests | 1 minute per user |

Exceeding limits returns `HTTP 429 Too Many Requests` with `Retry-After` header.
