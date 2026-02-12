# Contracts Directory

**Feature**: Phase 1 Core Foundation (001)  
**Version**: 1.0.0  
**Updated**: 2026-02-11  

This directory contains API contract specifications for all Phase 1 endpoints. Each contract defines request/response formats, validation rules, error codes, and mock behavior.

---

## Available Contracts

### 1. [Authentication API](auth.md)
**Base Path**: `/api/auth`

Endpoints for user authentication using OTP or email/password, JWT token management, and session handling.

- `POST /login-otp` - Request OTP for mobile login
- `POST /verify-otp` - Verify OTP and get JWT
- `POST /login-email` - Admin email/password login
- `POST /refresh` - Refresh access token
- `POST /logout` - End user session

**Key Features**:
- Dual authentication: Mobile OTP (all roles) + Email/Password (Admin only)
- JWT-based stateless authentication
- Token refresh mechanism (1 hour access, 7 day refresh)
- Rate limiting on all endpoints

---

### 2. [Students API](students.md)
**Base Path**: `/api/students`

Endpoints for managing student records, profiles, and parent associations.

- `GET /students` - List students (paginated, filtered, searchable)
- `GET /students/:id` - Get student details
- `POST /students` - Create new student with parents
- `PUT /students/:id` - Update student information
- `DELETE /students/:id` - Soft delete (mark as Discontinued)
- `POST /students/bulk-import` - CSV/Excel bulk import

**Key Features**:
- Role-based access (Parent sees only own children, Teacher sees assigned classes)
- Parent account auto-creation on student creation
- Comprehensive validation (admission number uniqueness, age constraints)
- Full-text search across name/admission number

---

### 3. [Attendance API](attendance.md)
**Base Path**: `/api/attendance`

Endpoints for marking daily attendance, viewing attendance records, and generating summaries.

- `GET /attendance` - Query attendance records (by class, student, date range)
- `GET /attendance/:classID/:date` - Get class attendance sheet for specific date
- `POST /attendance` - Mark attendance (bulk for entire class)
- `PUT /attendance/:id` - Update individual attendance record
- `GET /attendance/summary/:studentID` - Student attendance summary with percentage

**Key Features**:
- Bulk marking for entire class (40+ students in single API call)
- Real-time attendance status (Present, Absent, Leave, Holiday, Late)
- 24-hour edit window (requires Admin approval after)
- Attendance percentage calculations

---

### 4. [Notices API](notices.md)
**Base Path**: `/api/notices`

Endpoints for creating, publishing, and managing school-wide announcements and targeted notices.

- `GET /notices` - List notices (filtered by user role/class, paginated)
- `GET /notices/:id` - Get notice details with attachments
- `POST /notices` - Create new notice
- `PUT /notices/:id` - Update existing notice
- `DELETE /notices/:id` - Delete notice
- `POST /notices/:id/read` - Mark notice as read by user

**Key Features**:
- Targeted delivery (All, specific Classes, specific Roles, Custom)
- Rich text content support (HTML/Markdown)
- Priority levels (Normal, High, Urgent)
- Automatic expiry based on expiry date
- Read status tracking per user

---

## General API Conventions

### Authentication
All endpoints (except `/auth/*`) require JWT Bearer token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Request/Response Format
- **Content-Type**: `application/json` (except file uploads: `multipart/form-data`)
- **Accept**: `application/json`
- **Character Encoding**: UTF-8

### Date/Time Format
All dates use **ISO 8601** format:
- Date only: `2026-02-11`
- Date with time: `2026-02-11T14:30:00Z` (UTC timezone)
- Always UTC on backend, converted to local timezone on frontend

### Pagination
Standard pagination format for list endpoints:

**Request**:
```
?page=1&limit=50
```

**Response**:
```json
{
  "data": [...],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 50,
    "totalPages": 25
  }
}
```

### Error Response Format
Consistent error structure across all endpoints:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "Specific field that caused error",
    "value": "Invalid value"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE (no response body) |
| 400 | Bad Request | Invalid request format/syntax |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but lacks permission |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Unique constraint violation |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Temporary outage/maintenance |

---

## Mock API Configuration

When `VITE_USE_MOCK_API=true` in `.env.local`:

### Mock Data Location
```
src/mocks/
├── data/
│   ├── users.json
│   ├── students.json
│   ├── attendance.json
│   ├── notices.json
│   └── classes.json
└── handlers/
    ├── authHandlers.ts
    ├── studentHandlers.ts
    ├── attendanceHandlers.ts
    └── noticeHandlers.ts
```

### Mock Behavior
- **Realistic delays**: 200-800ms based on operation complexity
- **Error simulation**: 5% random server errors, 2% validation errors
- **Stateful**: Changes persist in memory during session (reset on page reload)
- **OTP**: Fixed code `123456` always works

### Switching to Real API
Update `.env.local`:
```bash
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.sanchalak.school/api
```

---

## RBAC Permission Matrix

Summary of role-based access across all features:

| Feature | Admin | Teacher | Staff | Parent | Student |
|---------|-------|---------|-------|--------|---------|
| **Auth** | ✅ Email + OTP | ✅ OTP only | ✅ OTP only | ✅ OTP only | ✅ OTP only |
| **Students - List** | ✅ All | ✅ Assigned classes | ✅ All | ❌ | ❌ |
| **Students - View** | ✅ All | ✅ Assigned classes | ✅ All | ✅ Own children | ✅ Self |
| **Students - Create** | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Students - Update** | ✅ Full | ⚠️ Limited | ✅ Full | ❌ | ❌ |
| **Students - Delete** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Attendance - Mark** | ✅ | ✅ Assigned classes | ✅ | ❌ | ❌ |
| **Attendance - Update** | ✅ Anytime | ✅ 24hr window | ⚠️ Limited | ❌ | ❌ |
| **Attendance - View** | ✅ All | ✅ Assigned classes | ✅ All | ✅ Own children | ✅ Self |
| **Notices - Create** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Notices - Update** | ✅ All | ✅ Own notices | ✅ Own notices | ❌ | ❌ |
| **Notices - Delete** | ✅ All | ✅ Own notices | ✅ Own notices | ❌ | ❌ |
| **Notices - View** | ✅ All | ✅ Targeted | ✅ Targeted | ✅ Targeted | ✅ Targeted |

Legend:
- ✅ Full access
- ⚠️ Limited/Conditional access
- ❌ No access

---

## Rate Limiting

Global rate limits to prevent abuse:

| Endpoint Type | Limit | Window | Scope |
|---------------|-------|--------|-------|
| Auth (login/OTP) | 10 requests | 15 min | Per IP |
| Read operations (GET) | 100 requests | 1 min | Per user |
| Write operations (POST/PUT) | 50 requests | 1 hour | Per user |
| Delete operations | 20 requests | 1 hour | Per user |
| Bulk operations | 5 requests | 1 hour | Per user |

Exceeding limits returns:
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 300
Content-Type: application/json

{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again after 5 minutes.",
  "retryAfter": 300
}
```

---

## Versioning Strategy

**Current Version**: v1.0.0

### API Versioning
APIs are versioned via URL path:
- Current: `/api/v1/students`
- Future: `/api/v2/students`

**No version in path = v1** (default): `/api/students` → `/api/v1/students`

### Breaking Changes
Require new major version (v2, v3). Examples:
- Removing a field from response
- Changing field type (string → number)
- Renaming endpoints
- Changing authentication method

### Non-Breaking Changes
Can be added to existing version. Examples:
- Adding new optional fields
- Adding new endpoints
- Adding new query parameters (with defaults)

---

## Testing Endpoints

### Using cURL

**Login with OTP**:
```bash
# Request OTP
curl -X POST http://localhost:8080/api/auth/login-otp \
  -H "Content-Type: application/json" \
  -d '{"mobileNumber": "+919876543210"}'

# Verify OTP (use sessionToken from above response)
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"sessionToken": "temp_abc123xyz", "otp": "123456"}'
```

**List Students** (use accessToken from login response):
```bash
curl -X GET "http://localhost:8080/api/students?page=1&limit=50" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Using Postman/Insomnia
1. Import collection (TBD: export from `/specs/001-core-foundation/contracts/postman-collection.json`)
2. Set environment variables: `{{baseUrl}}`, `{{accessToken}}`
3. Run entire collection to verify all endpoints

---

## Future Enhancements (Phase 1.1+)

Not included in Phase 1 contracts but planned:

- **WebSocket** for real-time notifications (attendance submitted, notice published)
- **GraphQL** alternative to REST for complex queries
- **Batch operations** for attendance history queries
- **Export APIs** (PDF report cards, CSV student lists)
- **File upload** direct to S3 with presigned URLs
- **Audit logs** endpoint for tracking changes to sensitive data

---

## Additional Resources

- **Constitution**: `/.specify/memory/constitution.md` - API design principles
- **Data Model**: `/specs/001-core-foundation/data-model.md` - Entity schemas
- **Feature Spec**: `/specs/001-core-foundation/spec.md` - Business requirements
- **Quickstart**: `/specs/001-core-foundation/quickstart.md` - Developer setup

For questions or clarifications, contact the backend team or refer to [Sanchalak API Documentation](TBD).
