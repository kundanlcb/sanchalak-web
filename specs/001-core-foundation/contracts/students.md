# Students API Contract

**Base Path**: `/api/students`  
**Version**: 1.0.0  
**Updated**: 2026-02-11  
**Auth Required**: Yes (JWT Bearer Token)  

---

## Permissions Matrix

| Role | List | View | Create | Update | Delete |
|------|------|------|--------|--------|--------|
| Admin | ✅ All | ✅ All | ✅ | ✅ | ✅ |
| Teacher | ✅ Assigned classes | ✅ Assigned classes | ❌ | ⚠️ Limited | ❌ |
| Staff | ✅ All | ✅ All | ✅ | ✅ | ❌ |
| Parent | ❌ | ✅ Own children only | ❌ | ❌ | ❌ |
| Student | ❌ | ✅ Self only | ❌ | ❌ | ❌ |

⚠️ **Teacher Limited Update**: Can update attendance-related fields only (address, contact, remarks), cannot modify admission/class/status.

---

## Endpoints

### 1. List Students (Paginated)

**GET** `/api/students`

Retrieves paginated list of students with filtering, sorting, and search capabilities.

#### Query Parameters

```typescript
interface StudentListQuery {
  // Filtering
  classID?: string;                    // Filter by class
  status?: StudentStatus;              // Active | Graduated | Transferred | Discontinued
  search?: string;                     // Search by name, admission number
  gender?: Gender;                     // Male | Female | Other
  
  // Pagination
  page?: number;                       // Page number (1-based, default: 1)
  limit?: number;                      // Results per page (default: 50, max: 200)
  
  // Sorting
  sortBy?: 'name' | 'admissionNumber' | 'admissionDate';  // Default: name
  sortOrder?: 'asc' | 'desc';          // Default: asc
}
```

**Example Request**:
```http
GET /api/students?classID=class-001&status=Active&page=1&limit=50&sortBy=name&sortOrder=asc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (Success - 200 OK)

```typescript
interface StudentListResponse {
  students: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: {
    classID?: string;
    status?: StudentStatus;
    search?: string;
  };
}

interface Student {
  studentID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;                 // ISO 8601 date
  gender: Gender;
  bloodGroup?: BloodGroup;
  profilePhoto?: string;
  classID: string;
  className: string;                   // Denormalized: e.g., "Grade 5 - A"
  admissionDate: string;               // ISO 8601 date
  admissionNumber: string;
  status: StudentStatus;
  parents: ParentInfo[];
}
```

**Example Response**:
```json
{
  "students": [
    {
      "studentID": "student-001",
      "firstName": "Aarav",
      "lastName": "Patel",
      "dateOfBirth": "2014-05-12",
      "gender": "Male",
      "bloodGroup": "O+",
      "profilePhoto": "/assets/profiles/student1.jpg",
      "classID": "class-001",
      "className": "Grade 5 - A",
      "admissionDate": "2024-04-01",
      "admissionNumber": "ADM2024001",
      "status": "Active",
      "parents": [
        {
          "parentID": "parent-001",
          "name": "Vikram Patel",
          "relationship": "Father",
          "isPrimaryContact": true,
          "mobileNumber": "+919876543220"
        }
      ]
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 50,
    "totalPages": 25
  },
  "filters": {
    "classID": "class-001",
    "status": "Active"
  }
}
```

#### Response (Error - 403 Forbidden)

```json
{
  "success": false,
  "error": "PERMISSION_DENIED",
  "message": "You do not have permission to list students"
}
```

---

### 2. Get Student Details

**GET** `/api/students/:id`

Retrieves comprehensive details for a specific student including address, parents, documents.

#### Path Parameters
- `id` (string): Student UUID

**Example Request**:
```http
GET /api/students/student-001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (Success - 200 OK)

```typescript
interface StudentDetailResponse {
  studentID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  profilePhoto?: string;
  address: Address;
  classID: string;
  className: string;
  classTeacher: string;                // Teacher name
  admissionDate: string;
  admissionNumber: string;
  status: StudentStatus;
  parents: ParentDetail[];
  documents: DocumentSummary[];
  attendanceSummary: {
    totalDays: number;
    presentDays: number;
    attendancePercentage: number;
  };
  createdDate: string;
  updatedDate?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface ParentDetail {
  parentID: string;
  name: string;
  email: string;
  mobileNumber: string;
  relationship: ParentRelationship;
  isPrimaryContact: boolean;
}

interface DocumentSummary {
  documentID: string;
  documentType: DocumentType;
  fileName: string;
  uploadDate: string;
  verificationStatus: VerificationStatus;
}
```

**Example Response**:
```json
{
  "studentID": "student-001",
  "firstName": "Aarav",
  "lastName": "Patel",
  "dateOfBirth": "2014-05-12",
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
  "className": "Grade 5 - A",
  "classTeacher": "Priya Sharma",
  "admissionDate": "2024-04-01",
  "admissionNumber": "ADM2024001",
  "status": "Active",
  "parents": [
    {
      "parentID": "parent-001",
      "name": "Vikram Patel",
      "email": "vikram.patel@example.com",
      "mobileNumber": "+919876543220",
      "relationship": "Father",
      "isPrimaryContact": true
    },
    {
      "parentID": "parent-002",
      "name": "Neha Patel",
      "email": "neha.patel@example.com",
      "mobileNumber": "+919876543221",
      "relationship": "Mother",
      "isPrimaryContact": false
    }
  ],
  "documents": [
    {
      "documentID": "doc-001",
      "documentType": "BirthCertificate",
      "fileName": "aarav_birth_cert.pdf",
      "uploadDate": "2024-04-01T10:30:00Z",
      "verificationStatus": "Verified"
    }
  ],
  "attendanceSummary": {
    "totalDays": 180,
    "presentDays": 162,
    "attendancePercentage": 90.0
  },
  "createdDate": "2024-04-01T09:00:00Z",
  "updatedDate": "2026-02-10T14:22:00Z"
}
```

#### Response (Error - 404 Not Found)

```json
{
  "success": false,
  "error": "STUDENT_NOT_FOUND",
  "message": "No student found with ID: student-999"
}
```

#### Response (Error - 403 Forbidden)

```json
{
  "success": false,
  "error": "PERMISSION_DENIED",
  "message": "You can only view your own child's details"
}
```

---

### 3. Create New Student

**POST** `/api/students`

Creates a new student record with parent associations. Automatically creates User accounts for parents if they don't exist.

**Permissions**: Admin, Staff only

#### Request

```typescript
interface CreateStudentRequest {
  firstName: string;                   // 2-50 chars
  lastName: string;                    // 2-50 chars
  dateOfBirth: string;                 // ISO 8601 date (YYYY-MM-DD)
  gender: Gender;                      // Male | Female | Other
  bloodGroup?: BloodGroup;             // Optional
  profilePhoto?: string;               // Base64 encoded or URL
  address: Address;
  classID: string;                     // Must be valid class UUID
  admissionDate: string;               // ISO 8601 date
  admissionNumber: string;             // Unique, 8-15 alphanumeric
  parents: CreateParentRequest[];      // 1-2 parents
}

interface CreateParentRequest {
  name: string;
  email: string;                       // Unique if new parent
  mobileNumber: string;                // Unique if new parent
  relationship: ParentRelationship;
  isPrimaryContact: boolean;
}
```

**Example Request**:
```json
{
  "firstName": "Ananya",
  "lastName": "Kumar",
  "dateOfBirth": "2015-08-20",
  "gender": "Female",
  "bloodGroup": "B+",
  "address": {
    "street": "456 Park Avenue",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "country": "India"
  },
  "classID": "class-002",
  "admissionDate": "2026-04-01",
  "admissionNumber": "ADM2026045",
  "parents": [
    {
      "name": "Rajesh Kumar",
      "email": "rajesh.kumar@example.com",
      "mobileNumber": "+919876543230",
      "relationship": "Father",
      "isPrimaryContact": true
    },
    {
      "name": "Sonia Kumar",
      "email": "sonia.kumar@example.com",
      "mobileNumber": "+919876543231",
      "relationship": "Mother",
      "isPrimaryContact": false
    }
  ]
}
```

#### Response (Success - 201 Created)

```typescript
interface CreateStudentResponse {
  success: boolean;
  student: StudentDetailResponse;      // Same as GET /students/:id response
  parentsCreated: string[];            // Array of newly created parent userIDs
  message: string;
}
```

**Example Response**:
```json
{
  "success": true,
  "student": {
    "studentID": "student-045",
    "firstName": "Ananya",
    "lastName": "Kumar",
    "..." 
  },
  "parentsCreated": ["user-120", "user-121"],
  "message": "Student created successfully. OTP sent to parent mobile numbers for account activation."
}
```

#### Response (Error - 409 Conflict)

```json
{
  "success": false,
  "error": "ADMISSION_NUMBER_EXISTS",
  "message": "Admission number ADM2026045 is already in use",
  "existingStudentID": "student-023"
}
```

#### Response (Error - 422 Unprocessable Entity)

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "firstName",
      "message": "First name must be between 2 and 50 characters"
    },
    {
      "field": "parents",
      "message": "At least one parent must be marked as primary contact"
    }
  ]
}
```

---

### 4. Update Student

**PUT** `/api/students/:id`

Updates an existing student record. Partial updates supported (only send fields to change).

**Permissions**: 
- Admin, Staff: Can update all fields
- Teacher: Can update address, remarks only (limited scope)

#### Path Parameters
- `id` (string): Student UUID

#### Request

```typescript
interface UpdateStudentRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  profilePhoto?: string;
  address?: Address;
  classID?: string;
  status?: StudentStatus;
  remarks?: string;                    // Optional notes field
}
```

**Example Request**:
```json
{
  "address": {
    "street": "789 New Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400002",
    "country": "India"
  },
  "classID": "class-003",
  "remarks": "Promoted to Grade 6"
}
```

#### Response (Success - 200 OK)

```typescript
interface UpdateStudentResponse {
  success: boolean;
  student: StudentDetailResponse;
  changedFields: string[];             // Array of field names that were updated
  message: string;
}
```

**Example Response**:
```json
{
  "success": true,
  "student": {
    "studentID": "student-001",
    "firstName": "Aarav",
    "..."
  },
  "changedFields": ["address", "classID", "remarks"],
  "message": "Student updated successfully"
}
```

#### Response (Error - 403 Forbidden - Teacher Scope Limit)

```json
{
  "success": false,
  "error": "PERMISSION_DENIED",
  "message": "Teachers can only update address and remarks fields",
  "deniedFields": ["classID", "status"]
}
```

#### Response (Error - 404 Not Found)

```json
{
  "success": false,
  "error": "STUDENT_NOT_FOUND",
  "message": "No student found with ID: student-999"
}
```

---

### 5. Delete Student (Soft Delete)

**DELETE** `/api/students/:id`

Soft deletes a student by setting `status` to `Discontinued`. Does not physically remove record from database.

**Permissions**: Admin only

#### Path Parameters
- `id` (string): Student UUID

#### Query Parameters
```typescript
interface DeleteStudentQuery {
  reason?: string;                     // Optional deletion reason
}
```

**Example Request**:
```http
DELETE /api/students/student-001?reason=Family%20relocated
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Student marked as Discontinued",
  "studentID": "student-001",
  "timestamp": "2026-02-11T15:30:00Z"
}
```

#### Response (Error - 403 Forbidden)

```json
{
  "success": false,
  "error": "PERMISSION_DENIED",
  "message": "Only Admin users can delete students"
}
```

---

### 6. Bulk Import Students

**POST** `/api/students/bulk-import`

Imports multiple students from CSV or Excel file. Validates all records before importing.

**Permissions**: Admin, Staff only

#### Request

**Content-Type**: `multipart/form-data`

**Form Fields**:
- `file` (File): CSV or XLSX file
- `classID` (string): Default class for all students (optional if file has class column)
- `dryRun` (boolean): If true, validates without importing (default: false)

**CSV Format**:
```csv
firstName,lastName,dateOfBirth,gender,admissionNumber,classID,fatherName,fatherMobile,fatherEmail,motherName,motherMobile,motherEmail
Aarav,Patel,2014-05-12,Male,ADM2024001,class-001,Vikram Patel,+919876543220,vikram@example.com,Neha Patel,+919876543221,neha@example.com
```

#### Response (Success - 200 OK - Dry Run)

```json
{
  "success": true,
  "dryRun": true,
  "validation": {
    "totalRecords": 50,
    "validRecords": 48,
    "invalidRecords": 2,
    "errors": [
      {
        "row": 15,
        "field": "admissionNumber",
        "error": "Admission number already exists"
      },
      {
        "row": 32,
        "field": "dateOfBirth",
        "error": "Invalid date format"
      }
    ]
  },
  "message": "Validation complete. Fix errors and re-upload to import."
}
```

#### Response (Success - 201 Created - Actual Import)

```json
{
  "success": true,
  "dryRun": false,
  "imported": {
    "totalRecords": 48,
    "studentsCreated": 48,
    "parentsCreated": 96,
    "skipped": 2
  },
  "message": "48 students imported successfully. 96 parent accounts created."
}
```

---

## Data Validation Rules

### Student Fields

| Field | Validation |
|-------|------------|
| `firstName` | 2-50 chars, letters/spaces/hyphens/apostrophes only |
| `lastName` | 2-50 chars, letters/spaces/hyphens/apostrophes only |
| `dateOfBirth` | Past date, age between 3-25 years |
| `gender` | Male \| Female \| Other |
| `bloodGroup` | A+ \| A- \| B+ \| B- \| AB+ \| AB- \| O+ \| O- |
| `admissionNumber` | Unique, 8-15 alphanumeric chars |
| `classID` | Must exist in database |
| `address.pincode` | 6 digits for India |
| `parents` | Minimum 1, maximum 2 |
| `parents[].isPrimaryContact` | At least one parent must be true |

### Parent Fields

| Field | Validation |
|-------|------------|
| `name` | 2-100 chars |
| `email` | Valid email format, unique across users |
| `mobileNumber` | +91 followed by 10 digits |
| `relationship` | Father \| Mother \| Guardian |
| `isPrimaryContact` | Boolean |

---

## Search Behavior

The `search` query parameter searches across:
- First name (case-insensitive, partial match)
- Last name (case-insensitive, partial match)
- Admission number (exact match)
- Parent mobile number (exact match, if user has permission)

**Example**: `search=aarav` matches:
- Aarav Patel
- Aarav Kumar
- Aaraavi Sharma

---

## Performance Considerations

### Pagination
- Default page size: 50 students
- Maximum page size: 200 students
- Use `page` and `limit` parameters for large datasets

### Caching
- Student list responses cached for 5 minutes
- Individual student details cached for 15 minutes
- Cache invalidated on any update/create/delete operation

### Indexes
Backend should have indexes on:
- `admissionNumber` (unique)
- `classID` (non-unique, frequently filtered)
- `status` (non-unique, frequently filtered)
- Composite index on `(firstName, lastName)` for name search

---

## Mock API Behavior

When `VITE_USE_MOCK_API=true`:

### Delays
- GET /students: 400ms
- GET /students/:id: 250ms
- POST /students: 800ms (simulates user creation)
- PUT /students/:id: 500ms
- DELETE /students/:id: 300ms

### Error Simulation
- 5% random server errors (500)
- 2% validation errors (422) on create/update
- 1% conflict errors (409) on create

### Mock Data
- 1250 students total
- 50 students per class
- 25 classes (Grade 1-12, sections A & B)
- 2 parents per student

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| GET /students | 100 requests | 1 minute per user |
| GET /students/:id | 200 requests | 1 minute per user |
| POST /students | 20 requests | 1 hour per user |
| PUT /students/:id | 50 requests | 1 hour per user |
| DELETE /students/:id | 10 requests | 1 hour per user |
| POST /students/bulk-import | 5 requests | 1 hour per user |

Exceeding limits returns `HTTP 429 Too Many Requests`.
