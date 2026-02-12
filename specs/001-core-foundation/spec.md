# Feature Specification: Phase 1 Core Foundation

**Feature Branch**: `001-core-foundation`  
**Created**: 2026-02-10  
**Status**: Implemented (v1.0)
**Input**: User description: "Phase 1 Core Foundation: Implement User Authentication (Mobile OTP and Email/Password), Role-Based Access Control with dynamic permissions, Student Information System with profile management and document uploads, Digital Attendance with push notifications, and Notice Board with targeted communications. Foundation for Sanchalak School Management System."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication & RBAC (Priority: P1)

School administrators, teachers, staff, parents, and students need to securely access the Sanchalak system with appropriate permissions based on their role. Super Admins log in with email/password, while all other users log in using mobile number + OTP for accessibility. Once authenticated, users see only the features and data they're authorized to access.

**Why this priority**: Authentication and authorization are foundational - no other feature can function without secure user identity and permission management. This is the gateway to the entire system.

**Independent Test**: Can be fully tested by creating users with different roles, logging in via both authentication methods, and verifying that each role sees only their permitted views (e.g., teachers cannot access financial reports, parents cannot see other students' data).

**Acceptance Scenarios**:

1. **Given** a teacher with mobile number +91-9876543210, **When** they request OTP and enter the correct code, **Then** they are logged in and see the teacher dashboard with attendance and grade entry features
2. **Given** a Super Admin with email admin@school.com, **When** they log in with email/password, **Then** they access the admin dashboard with full system configuration options
3. **Given** a logged-in parent user, **When** they attempt to access staff payroll module, **Then** the system denies access and displays "Insufficient permissions"
4. **Given** an expired JWT token, **When** user makes an API request, **Then** system returns 401 Unauthorized and prompts for re-authentication
5. **Given** a user entering wrong OTP 3 times, **When** they attempt 4th time, **Then** system blocks OTP requests for 30 minutes

---

### User Story 2 - Student Information System (Priority: P2)

School administrators need to create and manage comprehensive student profiles including personal details, parent information, class assignments, and document uploads (birth certificate, ID proof, photos). Each student receives a unique ID for tracking throughout their academic journey.

**Why this priority**: Student records are the core data entity of the school management system. Without student data, attendance, exams, and fee management have nothing to operate on.

**Independent Test**: Can be fully tested by creating student profiles, uploading documents, assigning students to classes, searching/filtering students, and verifying unique ID generation without needing attendance or exam features.

**Acceptance Scenarios**:

1. **Given** an admin logged into the system, **When** they create a new student with name "Raj Kumar", DOB "2015-08-15", parent name "Suresh Kumar", mobile "+91-9988776655", and class "Grade 5-A", **Then** system generates unique student ID (e.g., "STU-2026-00001"), saves the profile, and displays success confirmation
2. **Given** a student profile for "Priya Sharma", **When** admin uploads a birth certificate PDF and student photo JPG, **Then** system securely stores files and displays document links in the student profile
3. **Given** 500 registered students, **When** teacher searches for students in "Grade 3", **Then** system returns filtered list of all Grade 3 students in under 1 second
4. **Given** a student profile with existing unique ID "STU-2026-00123", **When** admin attempts to create another student with duplicate ID, **Then** system rejects with error "Student ID already exists"
5. **Given** incomplete student data (missing parent mobile), **When** admin attempts to save, **Then** system shows validation error "Parent mobile number is required"

---

### User Story 3 - Digital Attendance (Priority: P3)

Teachers need to quickly mark attendance for their assigned classes via web interface, with students marked as Present or Absent. When a student is marked absent, their parent immediately receives a push notification on the mobile app, ensuring real-time awareness of child's attendance.

**Why this priority**: Attendance is a daily operational necessity with high user engagement (500+ classes during morning peak). Real-time parent notifications improve school-parent communication and child safety monitoring.

**Independent Test**: Can be fully tested by teachers marking attendance for a class, verifying attendance records are saved, and parents receiving push notifications - without requiring exam or fee features.

**Acceptance Scenarios**:

1. **Given** teacher "Mrs. Gupta" logged in and assigned to "Grade 5-A" with 30 students, **When** she opens attendance screen for today's date, **Then** system displays list of all 30 students with Present/Absent toggle buttons
2. **Given** attendance screen for "Grade 5-A", **When** teacher marks student "Raj Kumar" as Absent and clicks Submit, **Then** system saves attendance record with timestamp and teacher ID
3. **Given** student "Raj Kumar" marked absent at 9:15 AM, **When** attendance is submitted, **Then** parent "Suresh Kumar" receives push notification within 30 seconds: "Raj Kumar (Grade 5-A) was marked absent on 10-Feb-2026"
4. **Given** 500 teachers marking attendance simultaneously at 9:00 AM, **When** all submit attendance, **Then** system processes all submissions within 3 seconds without errors or delays
5. **Given** teacher attempting to mark attendance for "Grade 3-B" which they are not assigned to, **When** they access attendance screen, **Then** system denies access with message "You are not authorized to mark attendance for this class"
6. **Given** attendance already marked for "Grade 5-A" on "10-Feb-2026", **When** teacher opens attendance screen again, **Then** system shows existing attendance status allowing corrections

---

### User Story 4 - Notice Board & Targeted Communications (Priority: P4)

School administrators and authorized staff need to publish notices and circulars to specific audiences (whole school, specific classes, or staff roles). Users see relevant notices on their dashboard with date, title, and content, enabling paperless communication.

**Why this priority**: Digital notices reduce physical printing costs by 80% and ensure timely communication. While important, the system can function for initial launch without this feature as users can rely on external communication channels temporarily.

**Independent Test**: Can be fully tested by creating notices with different audience targets, verifying visibility rules, and confirming only intended users see specific notices - independent of other features.

**Acceptance Scenarios**:

1. **Given** admin logged into notice board module, **When** they create notice with title "Winter Holidays 2026", content "School closed Dec 25-31", target "All Users", and effective date "2026-12-01", **Then** system saves notice and displays on all user dashboards from Dec 1 onwards
2. **Given** admin creating notice "Grade 10 Board Exam Schedule", **When** they set target audience as "Grade 10 Students and Parents", **Then** only Grade 10 students and their parents see this notice on their dashboards
3. **Given** teacher "Mr. Singh" logged in, **When** they view notice board, **Then** system displays notices targeted to "All Staff" or "Teachers" role, sorted by date (newest first)
4. **Given** a notice created on "2026-02-10" with effective date "2026-02-15", **When** users check dashboard on Feb 12, **Then** notice is not yet visible
5. **Given** an urgent notice, **When** admin marks it as "High Priority", **Then** notice appears at top of notice board with red highlight indicator
6. **Given** 50 active notices, **When** user's dashboard loads, **Then** system shows pagination (10 notices per page) and loads within 2 seconds

---

### Edge Cases

- **What happens when mobile network is down during OTP delivery?** System should retry OTP sending up to 3 times with exponential backoff, and display message "Network issue - please retry in 1 minute"
- **What happens when uploading a 50MB student document?** System should reject files larger than 10MB with error "File too large - maximum 10MB allowed"
- **What happens when 1000 parents simultaneously try to view their child's attendance?** System should handle concurrent read requests without performance degradation (response time <2 seconds)
- **What happens when teacher marks attendance after school hours (e.g., 8 PM)?** System should allow submission (for flexibility) but flag as "Late Entry" with timestamp
- **What happens when a student is transferred to a different class mid-year?** System should maintain historical attendance and academic records while updating current class assignment
- **What happens when a parent has multiple children in the school?** System should allow parent to switch between child profiles and view attendance/data for each child separately
- **What happens when JWT token expires mid-session during attendance marking?** System should prompt for re-authentication and preserve unsaved attendance data in browser session storage
- **What happens when notice board has expired notices from previous year?** System should archive notices older than 365 days automatically, removing from active view

## Requirements *(mandatory)*

### Functional Requirements

**Authentication & Authorization:**
- **FR-001**: System MUST support mobile number + OTP authentication for Teachers, Staff, Parents, and Students
- **FR-002**: System MUST support email + password authentication for Super Admin users
- **FR-003**: System MUST generate 6-digit numeric OTP with 10-minute expiration time
- **FR-004**: System MUST implement JWT token-based session management with configurable expiration (default 8 hours)
- **FR-005**: System MUST enforce Role-Based Access Control (RBAC) with roles: Admin, Teacher, Staff, Student, Parent
- **FR-006**: System MUST validate user permissions before rendering UI components and processing API requests
- **FR-007**: System MUST block OTP requests for 30 minutes after 3 consecutive failed attempts
- **FR-008**: System MUST provide "Logout" functionality that invalidates JWT tokens
- **FR-009**: System MUST display user's name, role, and profile picture in application header

**Student Information System:**
- **FR-010**: System MUST capture student details: full name, date of birth, gender, blood group, address, parent names, parent mobile numbers (primary and secondary), emergency contact
- **FR-011**: System MUST generate unique auto-incrementing student ID with format "STU-YYYY-NNNNN" where YYYY is year and NNNNN is 5-digit sequence
- **FR-012**: System MUST allow document upload for: birth certificate, address proof, ID proof, student photo (accepted formats: JPG, PNG, PDF; max 10MB per file)
- **FR-013**: System MUST assign students to academic year, class, and division (e.g., "2025-26", "Grade 5", "Section A")
- **FR-014**: System MUST provide search and filter functionality by name, class, student ID, and parent mobile number
- **FR-015**: System MUST support bulk student import via CSV file with validation and error reporting
- **FR-016**: System MUST restrict student profile editing to Admin and authorized Staff roles
- **FR-017**: System MUST maintain complete audit log of all changes to student profiles (who changed what and when)

**Digital Attendance:**
- **FR-018**: System MUST display class roster with all enrolled students for attendance marking
- **FR-019**: System MUST allow teachers to mark students as Present or Absent for the current date
- **FR-020**: System MUST record attendance with timestamp, date, class, teacher ID, and student ID
- **FR-021**: System MUST restrict teachers to mark attendance only for classes assigned to them
- **FR-022**: System MUST allow attendance correction within the same day by authorized teachers
- **FR-023**: System MUST send push notification to parent's mobile app when student is marked absent (via Firebase Cloud Messaging)
- **FR-024**: System MUST display attendance history view showing date-wise attendance for a student
- **FR-025**: System MUST generate attendance summary reports showing attendance percentage by student and class
- **FR-026**: System MUST handle concurrent attendance marking by 500+ teachers during morning peak (9:00-9:30 AM)

**Notice Board:**
- **FR-027**: System MUST allow Admin and authorized Staff to create notices with title, content (rich text), effective date, and expiry date
- **FR-028**: System MUST support notice targeting: All Users, Specific Classes, Specific Roles (Teachers/Staff/Parents)
- **FR-029**: System MUST display notices on user dashboard based on targeting rules and current date within effective date range
- **FR-030**: System MUST support priority levels: Normal, High Priority (displayed at top)
- **FR-031**: System MUST support image attachments in notices (max 5MB per image)
- **FR-032**: System MUST implement pagination for notice board display (10 notices per page)
- **FR-033**: System MUST archive notices older than 365 days automatically
- **FR-034**: System MUST allow notice editing and deletion by creator or Admin

**UI/UX & Architecture:**
- **FR-035**: System MUST be fully responsive, adapting layouts for mobile devices (320px-767px), tablets (768px-1023px), and desktop (1024px+)
- **FR-036**: System MUST follow modular component architecture with reusable UI components organized by feature domain
- **FR-037**: System MUST use JSON mock data files for all API responses during development phase until backend is available
- **FR-038**: System MUST implement mobile-first design approach with touch-friendly controls (minimum 44px touch targets)
- **FR-039**: System MUST maintain consistent styling based on provided UI design samples (see src/assets/sample-ui-images/)
- **FR-040**: System MUST support both portrait and landscape orientations on mobile devices without breaking layout
- **FR-041**: System MUST support light and dark theme modes with a toggle switch accessible from the main navigation
- **FR-042**: System MUST persist user's theme preference in localStorage and apply it automatically on subsequent sessions
- **FR-043**: System MUST ensure all UI components, text, icons, and backgrounds are readable and accessible in both light and dark themes with WCAG AA contrast ratios

### Key Entities

- **User**: Represents any person accessing the system with attributes: userID, name, email, mobileNumber, role (Admin/Teacher/Staff/Parent/Student), passwordHash (for Admin), isActive, createdDate, lastLoginDate. Relationships: User (Parent) has many Students (children), User (Teacher/Staff) has assigned Classes
- **Role**: Defines access permissions with attributes: roleID, roleName, permissions (array of feature access rights). Roles: Admin (full access), Teacher (attendance, grades, homework), Staff (office operations), Parent (read-only child data), Student (view own data)
- **Student**: Core entity with attributes: studentID (unique), firstName, lastName, dateOfBirth, gender, bloodGroup, profilePhoto, address, classID, admissionDate, status (Active/Graduated/Transferred). Relationships: belongs to one Class, has two Parents (User), has many AttendanceRecords
- **Parent**: Links guardians to students with attributes: parentID, relationship (Father/Mother/Guardian), primaryContact (boolean), userID (links to User). Relationships: Parent has many Students
- **Document**: Stores uploaded files with attributes: documentID, studentID, documentType (BirthCertificate/AddressProof/IDProof/Photo), fileName, fileURL (S3 path), uploadDate, uploadedByUserID
- **Class**: Represents academic class/section with attributes: classID, academicYear (e.g., "2025-26"), grade (e.g., "Grade 5"), section (e.g., "A"), classTeacherID (User), capacity (max students). Relationships: Class has many Students, has one Teacher (class teacher)
- **Attendance**: Records daily attendance with attributes: attendanceID, date, classID, studentID, status (Present/Absent/Leave/Holiday), markedByUserID (teacher), markedAt (timestamp), remarks. Relationships: belongs to one Student, one Class, marked by one User (teacher)
- **Notice**: Communication entity with attributes: noticeID, title, content (rich text), effectiveDate, expiryDate, priority (Normal/High), targetAudience (All/Classes/Roles), createdByUserID, createdAt, updatedAt. Relationships: created by one User, may target multiple Classes or Roles

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete login process in under 30 seconds (including OTP delivery and entry)
- **SC-002**: System handles 500 concurrent teachers marking attendance during morning peak (9:00-9:30 AM) without response time exceeding 3 seconds
- **SC-003**: 95% of absence push notifications are delivered to parents within 30 seconds of attendance submission
- **SC-004**: Student profile creation (including document uploads) takes under 3 minutes for school admin
- **SC-005**: Student search/filter returns results in under 1 second for datasets up to 5,000 students
- **SC-006**: System maintains 99.5% uptime during school operational hours (8:00 AM - 5:00 PM)
- **SC-007**: All API responses for read operations complete within 500ms at 90th percentile
- **SC-008**: Zero unauthorized access incidents - all permission checks function correctly
- **SC-009**: 100% of uploaded documents are successfully stored and retrievable within 24 hours
- **SC-010**: Notice board reduces physical printing costs by at least 60% (baseline vs 3 months post-implementation)
- **SC-011**: Teachers report 40% reduction in time spent on attendance-related paperwork (measured via survey)
- **SC-012**: 90% of teachers successfully mark attendance on first attempt without errors
- **SC-013**: Parents report high satisfaction (4+ out of 5) with real-time attendance notifications (measured via survey)
- **SC-014**: Zero data breaches or unauthorized data access during Phase 1 operation
- **SC-015**: UI is fully functional and usable on mobile devices (375px width) without horizontal scrolling or layout breaks
- **SC-016**: All interactive elements are easily accessible on touch devices with minimum 44px touch target size
- **SC-017**: Application loads and renders initial view within 3 seconds on 3G mobile networks
- **SC-018**: Page layouts adapt seamlessly across 3 breakpoints (mobile, tablet, desktop) maintaining usability

## Assumptions

- Backend Spring Boot REST API endpoints will be developed in parallel; web app uses JSON mock data initially
- Mock data files will mirror planned API response structures for seamless backend integration later
- S3 bucket for document storage is provisioned and access credentials are configured
- Firebase Cloud Messaging (FCM) is set up for push notifications to mobile app
- PostgreSQL database schema will be designed collaboratively between backend and frontend teams
- OTP delivery service (SMS gateway) is integrated on backend with sufficient daily quota (10,000+ OTPs)
- Mobile app for parents will be developed in parallel and can receive push notifications
- School admin will provide initial user data (teachers, staff) for system setup
- Network connectivity is reliable during school hours for web app access
- Teachers have access to desktop computers (1920x1080+) or laptops with modern browsers (Chrome, Firefox, Safari)
- Admin users also access system via tablets (iPad, Android tablets) requiring responsive design
- Hindi localization strings will be provided by school or translation service within 2 weeks of specification approval
- UI design samples (src/assets/sample-ui-images/) represent approved styling, color scheme, and layout patterns

## Dependencies

- React web app development environment is set up per constitution (Vite, TypeScript, ESLint)
- Material UI or Tailwind CSS library is selected and installed (based on sample UI images styling)
- React Router for navigation is configured
- Axios or similar HTTP client is set up with auth interceptors for future backend integration
- JSON mock data files created in /src/mocks/ directory mirroring API response structures
- Mock service layer created to simulate API calls with realistic delays and error scenarios
- Responsive design testing tools/browser dev tools available for mobile/tablet/desktop viewport testing
- UI design samples reviewed and approved (src/assets/sample-ui-images/) for styling consistency
- Component library structure defined following modular architecture (common components, feature components)
- Spring Boot backend API will be integrated in future sprint (Phase 1.1 backend integration)
- JWT authentication middleware will be implemented on backend (future)
- Database schema and migrations will be ready when backend integrated (future)
- S3 bucket and upload API endpoints will be configured when backend integrated (future)
- FCM push notification service will be operational when mobile app launched (future)

## Out of Scope (for Phase 1)

- Exam and result management (Phase 2)
- Fee payment processing and receipts (Phase 3)
- Staff payroll calculation (Phase 3)
- Homework/digital diary (Phase 2)
- Advanced analytics dashboards (Phase 3)
- Timetable management
- Library management
- Transport management
- SMS notifications (only push notifications for now)
- Email notifications
- Multi-language support beyond Hindi and English
- Mobile app development (separate tracked effort)
- Offline mode for web app
- Report card generation (Phase 2)
