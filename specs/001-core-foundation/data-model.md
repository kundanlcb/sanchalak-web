# Phase 1 Data Model

**Feature**: Core Foundation (001)  
**Version**: 1.0.0  
**Last Updated**: 2026-02-11  

---

## Entity Relationships

```
User (1) ←→ (many) AttendanceRecords [markedBy]
User (1) ←→ (many) Students [via Parent relationship]
User (1) ←→ (many) Classes [classTeacher]
User (1) ←→ (many) Notices [createdBy]
User (1) ←→ (1) Role

Role (1) ←→ (many) Users

Student (1) ←→ (1) Class
Student (1) ←→ (2) Parents
Student (1) ←→ (many) Documents
Student (1) ←→ (many) AttendanceRecords

Class (1) ←→ (many) Students
Class (1) ←→ (1) User [classTeacher]
Class (1) ←→ (many) AttendanceRecords

Attendance (1) ←→ (1) Student
Attendance (1) ←→ (1) Class
Attendance (1) ←→ (1) User [markedBy]

Notice (1) ←→ (1) User [createdBy]
Notice (many) ←→ (many) Classes [targeting]
Notice (many) ←→ (many) Roles [targeting]

Document (1) ←→ (1) Student
Document (1) ←→ (1) User [uploadedBy]
```

---

## TypeScript Entity Interfaces

### 1. User Entity

```typescript
/**
 * Represents any person accessing the Sanchalak system
 * Unified entity for all user types (Admin, Teacher, Staff, Parent, Student)
 */
export interface User {
  userID: string;                    // UUID primary key
  name: string;                      // Full name (max 100 chars)
  email: string;                     // Email address (unique, validated)
  mobileNumber: string;              // Phone with country code (+91XXXXXXXXXX)
  role: UserRole;                    // Admin | Teacher | Staff | Parent | Student
  passwordHash?: string;             // Only for Admin users (bcrypt hash)
  profilePhoto?: string;             // URL to profile image (S3 or local)
  themePreference: ThemePreference;  // light | dark | system (default: system)
  isActive: boolean;                 // Account status
  createdDate: Date;                 // ISO 8601 timestamp
  lastLoginDate?: Date;              // ISO 8601 timestamp (null if never logged in)
  metadata?: Record<string, any>;    // Extensibility for future attributes
}

export type UserRole = 'Admin' | 'Teacher' | 'Staff' | 'Parent' | 'Student';
export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * User creation request (excludes system-generated fields)
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  password?: string;                 // Only for Admin role
  profilePhoto?: string;
}

/**
 * User update request (partial updates allowed)
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  mobileNumber?: string;
  profilePhoto?: string;
  themePreference?: ThemePreference;  // User can update theme preference
  isActive?: boolean;
}
```

### 2. Role Entity

```typescript
/**
 * Defines role-based access control permissions
 * Maps roles to specific feature access rights
 */
export interface Role {
  roleID: string;                    // UUID primary key
  roleName: UserRole;                // Admin | Teacher | Staff | Parent | Student
  description: string;               // Human-readable role description
  permissions: Permission[];         // Array of feature permissions
  createdDate: Date;
  updatedDate?: Date;
}

/**
 * Individual permission for a feature/action
 */
export interface Permission {
  feature: Feature;                  // Students | Attendance | Notices | Reports
  actions: Action[];                 // Create | Read | Update | Delete | Execute
}

export type Feature = 
  | 'Auth' 
  | 'Students' 
  | 'Attendance' 
  | 'Notices' 
  | 'Reports'
  | 'Documents'
  | 'Classes'
  | 'Users';

export type Action = 'Create' | 'Read' | 'Update' | 'Delete' | 'Execute';

/**
 * Permission check request
 */
export interface CheckPermissionRequest {
  userID: string;
  feature: Feature;
  action: Action;
}

/**
 * Permission check response
 */
export interface CheckPermissionResponse {
  allowed: boolean;
  reason?: string;                   // Explanation if denied
}
```

### 3. Student Entity

```typescript
/**
 * Core entity representing a student enrolled in the school
 * Primary entity for academic operations
 */
export interface Student {
  studentID: string;                 // UUID primary key
  firstName: string;                 // Max 50 chars
  lastName: string;                  // Max 50 chars
  dateOfBirth: Date;                 // ISO 8601 date
  gender: Gender;                    // Male | Female | Other
  bloodGroup?: BloodGroup;           // A+ | A- | B+ | B- | AB+ | AB- | O+ | O-
  profilePhoto?: string;             // URL to profile image
  address: Address;                  // Nested address object
  classID: string;                   // Foreign key to Class
  admissionDate: Date;               // ISO 8601 date
  admissionNumber: string;           // Unique admission number (e.g., "ADM2026001")
  status: StudentStatus;             // Active | Graduated | Transferred | Discontinued
  parents: ParentInfo[];             // Array of parent relationships (1-2 parents)
  createdDate: Date;
  updatedDate?: Date;
}

export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type StudentStatus = 'Active' | 'Graduated' | 'Transferred' | 'Discontinued';

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ParentInfo {
  parentID: string;                  // Foreign key to User
  relationship: ParentRelationship;
  isPrimaryContact: boolean;
}

export type ParentRelationship = 'Father' | 'Mother' | 'Guardian';

/**
 * Student creation request
 */
export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;               // ISO 8601 date string
  gender: Gender;
  bloodGroup?: BloodGroup;
  address: Address;
  classID: string;
  admissionDate: string;             // ISO 8601 date string
  admissionNumber: string;
  parents: CreateParentRequest[];
}

export interface CreateParentRequest {
  name: string;
  email: string;
  mobileNumber: string;
  relationship: ParentRelationship;
  isPrimaryContact: boolean;
}

/**
 * Student list query parameters
 */
export interface StudentListQuery {
  classID?: string;                  // Filter by class
  status?: StudentStatus;            // Filter by status
  search?: string;                   // Search name/admission number
  page?: number;                     // Pagination (1-based)
  limit?: number;                    // Results per page (default 50)
  sortBy?: 'name' | 'admissionNumber' | 'admissionDate';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated student list response
 */
export interface StudentListResponse {
  students: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### 4. Parent Entity

```typescript
/**
 * Links guardian users to students
 * Separate from User entity to support multiple parent-child relationships
 */
export interface Parent {
  parentID: string;                  // UUID primary key
  userID: string;                    // Foreign key to User
  relationship: ParentRelationship;
  isPrimaryContact: boolean;         // True for main contact parent
  students: string[];                // Array of studentIDs (children)
  createdDate: Date;
}
```

### 5. Document Entity

```typescript
/**
 * Stores metadata for uploaded student documents
 * Actual files stored in S3/cloud storage
 */
export interface Document {
  documentID: string;                // UUID primary key
  studentID: string;                 // Foreign key to Student
  documentType: DocumentType;
  fileName: string;                  // Original filename
  fileURL: string;                   // S3 URL or local path
  fileSize: number;                  // Size in bytes
  mimeType: string;                  // e.g., "application/pdf", "image/jpeg"
  uploadDate: Date;
  uploadedByUserID: string;          // Foreign key to User (Admin/Staff)
  verificationStatus: VerificationStatus;
  remarks?: string;
}

export type DocumentType = 
  | 'BirthCertificate' 
  | 'AddressProof' 
  | 'IDProof' 
  | 'Photo'
  | 'TransferCertificate'
  | 'MedicalCertificate'
  | 'Other';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

/**
 * Document upload request (multipart form data)
 */
export interface UploadDocumentRequest {
  studentID: string;
  documentType: DocumentType;
  file: File;                        // Browser File object
  remarks?: string;
}

/**
 * Document verification request
 */
export interface VerifyDocumentRequest {
  documentID: string;
  verificationStatus: VerificationStatus;
  remarks?: string;
}
```

### 6. Class Entity

```typescript
/**
 * Represents an academic class/section
 * Container for students and attendance records
 */
export interface Class {
  classID: string;                   // UUID primary key
  academicYear: string;              // e.g., "2025-26"
  grade: string;                     // e.g., "Grade 5", "Class 10"
  section: string;                   // e.g., "A", "B", "C"
  classTeacherID: string;            // Foreign key to User (Teacher)
  capacity: number;                  // Maximum students (e.g., 40)
  currentStrength: number;           // Current enrolled students
  subjects?: string[];               // Optional subject list
  classroomNumber?: string;          // Physical room number
  schedule?: ClassSchedule;          // Optional timetable reference
  isActive: boolean;
  createdDate: Date;
  updatedDate?: Date;
}

export interface ClassSchedule {
  startTime: string;                 // HH:mm format (e.g., "09:00")
  endTime: string;                   // HH:mm format (e.g., "15:30")
  daysOfWeek: DayOfWeek[];
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

/**
 * Class list query parameters
 */
export interface ClassListQuery {
  academicYear?: string;
  grade?: string;
  isActive?: boolean;
  classTeacherID?: string;
}
```

### 7. Attendance Entity

```typescript
/**
 * Records daily attendance for students
 * Primary entity for attendance tracking feature
 */
export interface Attendance {
  attendanceID: string;              // UUID primary key
  date: Date;                        // ISO 8601 date (no time component)
  classID: string;                   // Foreign key to Class
  studentID: string;                 // Foreign key to Student
  status: AttendanceStatus;
  markedByUserID: string;            // Foreign key to User (Teacher)
  markedAt: Date;                    // Timestamp when marked (ISO 8601)
  remarks?: string;                  // Optional notes (e.g., reason for absence)
  modifiedAt?: Date;                 // Timestamp if attendance was updated
  modifiedByUserID?: string;         // User who made modification
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Holiday' | 'Late';

/**
 * Bulk attendance marking request (entire class)
 */
export interface MarkAttendanceRequest {
  classID: string;
  date: string;                      // ISO 8601 date string (YYYY-MM-DD)
  records: AttendanceRecord[];
}

export interface AttendanceRecord {
  studentID: string;
  status: AttendanceStatus;
  remarks?: string;
}

/**
 * Attendance query parameters
 */
export interface AttendanceQuery {
  classID?: string;
  studentID?: string;
  startDate: string;                 // ISO 8601 date string
  endDate: string;                   // ISO 8601 date string
  status?: AttendanceStatus;
}

/**
 * Attendance summary response
 */
export interface AttendanceSummary {
  studentID: string;
  studentName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  lateDays: number;
  attendancePercentage: number;      // Calculated: (presentDays / totalDays) * 100
}

/**
 * Class attendance sheet (for a specific date)
 */
export interface ClassAttendanceSheet {
  classID: string;
  className: string;
  date: string;                      // ISO 8601 date
  students: StudentAttendance[];
  statistics: {
    totalStudents: number;
    present: number;
    absent: number;
    leave: number;
    late: number;
  };
}

export interface StudentAttendance {
  studentID: string;
  studentName: string;
  admissionNumber: string;
  status: AttendanceStatus;
  remarks?: string;
}
```

### 8. Notice Entity

```typescript
/**
 * Communication entity for announcements and notices
 * Supports targeted delivery to specific classes/roles
 */
export interface Notice {
  noticeID: string;                  // UUID primary key
  title: string;                     // Max 200 chars
  content: string;                   // Rich text content (HTML or Markdown)
  effectiveDate: Date;               // When notice becomes active
  expiryDate?: Date;                 // Optional expiry date
  priority: NoticePriority;
  targetAudience: NoticeAudience;
  targetClasses?: string[];          // ClassIDs if audience is Classes
  targetRoles?: UserRole[];          // Roles if audience is Roles
  attachments?: NoticeAttachment[];
  createdByUserID: string;           // Foreign key to User
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  readBy?: string[];                 // Array of userIDs who have read this notice
}

export type NoticePriority = 'Normal' | 'High' | 'Urgent';
export type NoticeAudience = 'All' | 'Classes' | 'Roles' | 'Custom';

export interface NoticeAttachment {
  attachmentID: string;
  fileName: string;
  fileURL: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Notice creation request
 */
export interface CreateNoticeRequest {
  title: string;
  content: string;
  effectiveDate: string;             // ISO 8601 date string
  expiryDate?: string;               // ISO 8601 date string
  priority: NoticePriority;
  targetAudience: NoticeAudience;
  targetClasses?: string[];
  targetRoles?: UserRole[];
  attachments?: File[];              // Browser File objects
}

/**
 * Notice list query parameters
 */
export interface NoticeListQuery {
  userID?: string;                   // Filter by target user (respects role/class)
  priority?: NoticePriority;
  startDate?: string;                // Filter by effective date range
  endDate?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Notice read status update
 */
export interface MarkNoticeReadRequest {
  noticeID: string;
  userID: string;
}
```

---

## Mock Data Schemas

### Mock Users (src/mocks/data/users.json)

```json
{
  "users": [
    {
      "userID": "user-001",
      "name": "Rajesh Kumar",
      "email": "admin@sanchalak.school",
      "mobileNumber": "+919876543210",
      "role": "Admin",
      "passwordHash": "$2a$10$hashedpassword",
      "profilePhoto": "/assets/profiles/admin.jpg",
      "themePreference": "system",
      "isActive": true,
      "createdDate": "2025-01-15T00:00:00Z",
      "lastLoginDate": "2026-02-11T09:00:00Z"
    },
    {
      "userID": "user-002",
      "name": "Priya Sharma",
      "email": "priya.teacher@sanchalak.school",
      "mobileNumber": "+919876543211",
      "role": "Teacher",
      "profilePhoto": "/assets/profiles/teacher1.jpg",
      "themePreference": "light",
      "isActive": true,
      "createdDate": "2025-02-01T00:00:00Z",
      "lastLoginDate": "2026-02-11T08:30:00Z"
    }
  ]
}
```

### Mock Students (src/mocks/data/students.json)

```json
{
  "students": [
    {
      "studentID": "student-001",
      "firstName": "Aarav",
      "lastName": "Patel",
      "dateOfBirth": "2014-05-12T00:00:00Z",
      "gender": "Male",
      "bloodGroup": "O+",
      "profilePhoto": "/assets/profiles/student1.jpg",
      "address": {
        "street": "123 MG Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India"
      },
      "classID": "class-001",
      "admissionDate": "2024-04-01T00:00:00Z",
      "admissionNumber": "ADM2024001",
      "status": "Active",
      "parents": [
        {
          "parentID": "parent-001",
          "relationship": "Father",
          "isPrimaryContact": true
        },
        {
          "parentID": "parent-002",
          "relationship": "Mother",
          "isPrimaryContact": false
        }
      ],
      "createdDate": "2024-04-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 50,
    "totalPages": 25
  }
}
```

### Mock Attendance (src/mocks/data/attendance.json)

```json
{
  "attendance": [
    {
      "attendanceID": "att-001",
      "date": "2026-02-11T00:00:00Z",
      "classID": "class-001",
      "studentID": "student-001",
      "status": "Present",
      "markedByUserID": "user-002",
      "markedAt": "2026-02-11T09:15:00Z"
    }
  ],
  "summary": {
    "studentID": "student-001",
    "studentName": "Aarav Patel",
    "totalDays": 20,
    "presentDays": 18,
    "absentDays": 2,
    "leaveDays": 0,
    "lateDays": 0,
    "attendancePercentage": 90.0
  }
}
```

### Mock Notices (src/mocks/data/notices.json)

```json
{
  "notices": [
    {
      "noticeID": "notice-001",
      "title": "Annual Sports Day - March 15, 2026",
      "content": "<p>Dear Parents and Students,</p><p>We are pleased to announce our Annual Sports Day on <strong>March 15, 2026</strong>. All students are required to attend.</p>",
      "effectiveDate": "2026-02-10T00:00:00Z",
      "expiryDate": "2026-03-15T00:00:00Z",
      "priority": "High",
      "targetAudience": "All",
      "createdByUserID": "user-001",
      "createdAt": "2026-02-10T14:00:00Z",
      "isActive": true,
      "readBy": ["user-002", "user-003"]
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

## Validation Rules

### User
- `email`: Valid email format, unique
- `mobileNumber`: 10-15 digits with country code
- `name`: 2-100 characters, no special characters except space, hyphen, apostrophe
- `password` (Admin): Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char

### Student
- `firstName`, `lastName`: 2-50 characters
- `dateOfBirth`: Past date, student age between 3-25 years
- `admissionNumber`: Unique, alphanumeric, 8-15 characters
- `parents`: Minimum 1 parent, maximum 2 parents
- At least 1 parent must have `isPrimaryContact: true`

### Attendance
- `date`: Cannot be future date
- `status`: Holiday status only valid for entire class (all students)
- Cannot mark attendance for students not in the specified class

### Notice
- `title`: 10-200 characters
- `content`: Max 5000 characters
- `effectiveDate`: Cannot be more than 90 days in past
- `expiryDate`: Must be after effectiveDate
- `targetClasses`: Must exist in database if specified
- `targetRoles`: Must be valid UserRole values

### Document
- `file`: Max size 5MB
- `mimeType`: Allowed: PDF, JPG, JPEG, PNG
- `documentType`: BirthCertificate and Photo are required for admission

---

## API Endpoint Summary

### Authentication
- `POST /api/auth/login-otp` - Request OTP for mobile login
- `POST /api/auth/verify-otp` - Verify OTP and get JWT
- `POST /api/auth/login-email` - Login with email/password (Admin only)
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Invalidate current session

### Students
- `GET /api/students` - List students (paginated, filtered)
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Soft delete student

### Attendance
- `GET /api/attendance` - Query attendance records
- `GET /api/attendance/:classID/:date` - Get class attendance sheet for date
- `POST /api/attendance` - Mark attendance (bulk for class)
- `PUT /api/attendance/:id` - Update individual attendance record
- `GET /api/attendance/summary/:studentID` - Get attendance summary for student

### Notices
- `GET /api/notices` - List notices (filtered by user role/class)
- `GET /api/notices/:id` - Get notice details
- `POST /api/notices` - Create new notice
- `PUT /api/notices/:id` - Update notice
- `DELETE /api/notices/:id` - Delete notice
- `POST /api/notices/:id/read` - Mark notice as read

### Documents
- `GET /api/documents/:studentID` - List student documents
- `POST /api/documents/upload` - Upload document (multipart)
- `DELETE /api/documents/:id` - Delete document
- `PUT /api/documents/:id/verify` - Verify/reject document

### Classes
- `GET /api/classes` - List classes
- `GET /api/classes/:id` - Get class details
- `GET /api/classes/:id/students` - List students in class

---

## State Transitions

### Student Status
```
[Created] → Active
Active → Graduated (if graduation date reached)
Active → Transferred (if student changes school)
Active → Discontinued (if student drops out)
* No transitions FROM terminal states (Graduated, Transferred, Discontinued)
```

### Attendance Status
```
[Unmarked] → Present | Absent | Leave | Holiday | Late
Any status → (different status) [if modified within same day by authorized user]
* No modifications allowed after 24 hours without Admin approval
```

### Document Verification Status
```
[Uploaded] → Pending
Pending → Verified (if document approved)
Pending → Rejected (if document has issues)
Rejected → Pending (if re-uploaded)
```

### Notice Active Status
```
[Created] → isActive: true (if effectiveDate <= today)
isActive: true → isActive: false (if expiryDate < today OR manually deactivated)
```

---

## Performance Considerations

1. **Indexes** (for future backend implementation):
   - `Student`: Index on `admissionNumber`, `classID`, `status`
   - `Attendance`: Composite index on `(classID, date)`, index on `studentID`
   - `User`: Index on `email`, `mobileNumber`, `role`
   - `Notice`: Index on `effectiveDate`, `targetAudience`

2. **Pagination**: All list endpoints default to 50 items, max 200

3. **Caching Strategy**:
   - Classes: Cache for 1 hour (rarely changes)
   - Notices: Cache for 5 minutes (moderate change frequency)
   - Attendance: No caching (real-time data)
   - Student profiles: Cache for 15 minutes

4. **Batch Operations**:
   - Attendance marking: Process entire class in single API call
   - Notice publishing: Send to multiple users in background job
   - Document uploads: Support multiple files in single request

---

## Security Notes

1. **PII Protection**: 
   - `passwordHash` never returned in API responses
   - `mobileNumber` masked for non-admin users (show last 4 digits)
   - `address` only visible to Admin, Staff, and student's own parents

2. **File Upload Security**:
   - Virus scanning required before storing
   - File type validation on both client and server
   - Unique filenames generated (no user-supplied names in URLs)

3. **RBAC Enforcement**:
   - Every API endpoint validates user permissions
   - Parents can only access their own children's data
   - Teachers can only modify data for their assigned classes
   - Students have read-only access to their own data
