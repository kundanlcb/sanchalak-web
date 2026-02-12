# Tasks: Phase 1 Core Foundation

**Feature**: 001-core-foundation  
**Input**: Design documents from `/specs/001-core-foundation/`  
**Prerequisites**: ✅ plan.md, ✅ spec.md, ✅ research.md, ✅ data-model.md, ✅ contracts/, ✅ quickstart.md  
**Tests**: Not explicitly requested - implementation tasks only  
**Organization**: Tasks grouped by user story for independent implementation and testing

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3, US4)
- All paths relative to repository root

## Summary

- **Total Tasks**: 84 tasks across 7 phases
- **User Stories**: 4 stories (Auth & RBAC, Students, Attendance, Notices)
- **Parallel Opportunities**: 42 tasks marked [P] for parallel execution
- **MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 23 tasks
- **Estimated Timeline**: 6-8 weeks for all phases

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize React + TypeScript + Tailwind project structure

- [X] T001 Install Node.js dependencies: react@19.2.0, react-dom@19.2.0, typescript@5.9.3, vite@7.2.4
- [X] T002 Install Tailwind CSS 4.1.0 and configure with darkMode: 'class' in tailwind.config.js
- [X] T003 [P] Install shadcn/ui dependencies: @radix-ui/react-* packages, class-variance-authority, clsx
- [X] T004 [P] Install routing and state: react-router-dom@^6.28.0 for navigation
- [X] T005 [P] Install API client: axios@^1.7.0 for HTTP requests
- [X] T006 [P] Install i18n: react-i18next@^16.0.0, i18next@^25.6.2 for Hindi/English localization
- [X] T007 [P] Install form handling: react-hook-form@^7.53.0, zod@^3.24.0 for validation
- [X] T008 [P] Install icons: lucide-react@latest for UI icons (Sun, Moon, Monitor, etc.)
- [X] T009 Configure TypeScript strict mode in tsconfig.json with "strict": true
- [X] T010 Configure ESLint 9.39.1 to block 'any' types and enforce code quality
- [X] T011 Create .env.local with VITE_USE_MOCK_API=true, VITE_API_BASE_URL=http://localhost:8080/api
- [X] T012 Create folder structure: src/components/, src/features/, src/mocks/, src/services/, src/utils/, src/contexts/
- [X] T013 Add theme initialization script to index.html to prevent FOUC
- [X] T014 Create public/locales/ structure for Hindi (hi) and English (en) translations

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T015 Create Axios client with interceptors in src/services/api/client.ts (auth headers, error handling)
- [X] T016 Create API config in src/services/api/config.ts (BASE_URL, USE_MOCK_API flag)
- [X] T017 [P] Create ThemeContext and ThemeProvider in src/contexts/ThemeContext.tsx (light/dark/system modes)
- [X] T018 [P] Create i18n configuration in src/utils/i18n/i18nConfig.ts (Hindi + English, lazy loading)
- [X] T019 [P] Create mock data structure: src/mocks/data/ and src/mocks/handlers/
- [X] T020 [P] Create permission utility in src/utils/permissions/checkPermission.ts (RBAC logic)
- [X] T021 [P] Create common Button component in src/components/common/Button.tsx with dark mode support
- [X] T022 [P] Create common Input component in src/components/common/Input.tsx with validation states
- [X] T023 [P] Create common Modal component in src/components/common/Modal.tsx (shadcn/ui Dialog)
- [X] T024 [P] Create ThemeToggle component in src/components/common/ThemeToggle.tsx (Sun/Moon/Monitor icons)
- [X] T025 Create Header layout component in src/components/layout/Header.tsx with theme toggle
- [X] T026 Create Sidebar layout component in src/components/layout/Sidebar.tsx with responsive collapsing
- [X] T027 Setup React Router in src/App.tsx with basic routes structure

**Checkpoint**: Foundation ready - user story implementation can begin in parallel

---

## Phase 3: User Story 1 - Authentication & RBAC (Priority: P1) 🎯 MVP

**Goal**: Implement dual authentication (OTP + email/password) and role-based access control for 5 roles

**Independent Test**: 
1. Login as Admin via email/password → see admin dashboard
2. Login as Teacher via OTP → see only attendance features
3. Attempt to access unauthorized route → redirected with permission error

### Type Definitions & Models for US1

- [X] T028 [P] [US1] Create auth types in src/features/auth/types/auth.types.ts (User, Role, LoginRequest, OTPRequest, VerifyOTPRequest, AuthResponse)
- [X] T029 [P] [US1] Create role types in src/features/auth/types/role.types.ts (Permission, Feature, Action, CheckPermissionRequest)

### Mock Data & Handlers for US1

- [X] T030 [P] [US1] Create mock user data in src/mocks/data/users.json (5 users with different roles)
- [X] T031 [P] [US1] Create mock role data in src/mocks/data/roles.json (Admin, Teacher, Staff, Parent, Student permissions)
- [X] T032 [US1] Implement auth mock handlers in src/mocks/handlers/authHandlers.ts (login-otp, verify-otp, login-email, refresh, logout)

### Services for US1

- [X] T033 [US1] Create authService in src/features/auth/services/authService.ts (loginWithOTP, verifyOTP, loginWithEmail, refreshToken, logout)
- [X] T034 [US1] Create authContext in src/features/auth/services/authContext.tsx (useAuth hook, user state, isAuthenticated)

### Components for US1

- [X] T035 [P] [US1] Create Login page in src/features/auth/components/Login.tsx (tab switcher for OTP/Email modes)
- [X] T036 [P] [US1] Create OTPInput component in src/features/auth/components/OTPInput.tsx (6-digit auto-focus)
- [X] T037 [P] [US1] Create RoleGuard component in src/features/auth/components/RoleGuard.tsx (route protection)
- [X] T038 [US1] Create ProtectedRoute wrapper in src/features/auth/components/ProtectedRoute.tsx (redirects unauthorized users)
- [X] T039 [US1] Integrate AuthProvider in src/App.tsx wrapping all routes

### Routes & Integration for US1

- [X] T040 [US1] Add authentication routes to src/App.tsx (/login, /logout, /unauthorized)
- [X] T041 [US1] Add role-specific dashboard routes (Admin: /admin, Teacher: /teacher, Parent: /parent, Student: /student)
- [X] T042 [US1] Implement logout flow with JWT invalidation and localStorage cleanup
- [X] T043 [US1] Add OTP rate limiting logic (3 attempts max, 30 min block) in mock handlers

**Checkpoint**: Authentication complete - users can login, JWT tokens work, RBAC enforced

---

## Phase 4: User Story 2 - Student Information System (Priority: P2)

**Goal**: Enable CRUD operations for student profiles with document uploads and search functionality

**Independent Test**:
1. Admin creates student "Raj Kumar" → unique ID generated
2. Upload birth certificate PDF → file stored and displayed
3. Search "Grade 5" → filtered list returned <1s

### Type Definitions & Models for US2

- [X] T044 [P] [US2] Create student types in src/features/students/types/student.types.ts (Student, CreateStudentRequest, UpdateStudentRequest, StudentListQuery, StudentListResponse)
- [X] T045 [P] [US2] Create parent types in src/features/students/types/parent.types.ts (Parent, ParentInfo, CreateParentRequest)
- [X] T046 [P] [US2] Create document types in src/features/students/types/document.types.ts (Document, DocumentType, UploadDocumentRequest, VerificationStatus)

### Mock Data & Handlers for US2

- [X] T047 [P] [US2] Create mock student data in src/mocks/data/students.json (50+ students across multiple classes)
- [X] T048 [P] [US2] Create mock class data in src/mocks/data/classes.json (12 classes: Grade 1-12 sections A/B)
- [X] T049 [P] [US2] Create mock document data in src/mocks/data/documents.json (sample birth certificates, IDs, photos)
- [X] T050 [US2] Implement student mock handlers in src/mocks/handlers/studentHandlers.ts (CRUD endpoints, search, bulk import)

### Services for US2

- [X] T051 [US2] Create studentService in src/features/students/services/studentService.ts (getStudents, getStudent, createStudent, updateStudent, deleteStudent)
- [X] T052 [P] [US2] Create documentService in src/features/students/services/documentService.ts (uploadDocument, getDocuments, deleteDocument, verifyDocument)

### Components for US2

- [X] T053 [P] [US2] Create StudentList component in src/features/students/components/StudentList.tsx (TanStack Table with virtual scrolling for 1000+ rows)
- [X] T054 [P] [US2] Create StudentCard component in src/features/students/components/StudentCard.tsx (summary view with photo)
- [X] T055 [P] [US2] Create StudentForm component in src/features/students/components/StudentForm.tsx (create/edit with Zod validation)
- [X] T056 [P] [US2] Create DocumentUpload component in src/features/students/components/DocumentUpload.tsx (drag-drop, 10MB limit, PDF/JPG validation)
- [X] T057 [P] [US2] Create SearchFilter component in src/features/students/components/SearchFilter.tsx (name, class, ID search with debounce)
- [X] T058 [US2] Create StudentDetail page in src/features/students/components/StudentDetail.tsx (full profile with tabs: Info, Documents, Attendance)

### Routes & Integration for US2

- [X] T059 [US2] Add student routes to src/App.tsx (/students, /students/:id, /students/new)
- [X] T060 [US2] Add RoleGuard to student routes (Admin, Teacher, Staff can view; Admin, Staff can create/edit)
- [X] T061 [US2] Implement unique ID generation logic (STU-2026-NNNNN format) in mock handlers
- [X] T062 [US2] Add pagination support (50 items per page) in StudentList component

**Checkpoint**: Student management complete - Admin can create profiles, upload docs, search students

---

## Phase 5: User Story 3 - Digital Attendance (Priority: P3)

**Goal**: Teachers mark attendance for assigned classes, parents receive absence notifications

**Independent Test**:
1. Teacher opens "Grade 5-A" attendance → sees 30 students
2. Mark "Raj Kumar" absent, submit → record saved with timestamp
3. Parent receives notification within 30s (simulated in console for mock)

### Type Definitions & Models for US3

- [X] T063 [P] [US3] Create attendance types in src/features/attendance/types/attendance.types.ts (Attendance, AttendanceStatus, MarkAttendanceRequest, AttendanceQuery, AttendanceSummary, ClassAttendanceSheet)

### Mock Data & Handlers for US3

- [X] T064 [P] [US3] Create mock attendance data in src/mocks/data/attendance.json (sample attendance records last 30 days)
- [X] T065 [US3] Implement attendance mock handlers in src/mocks/handlers/attendanceHandlers.ts (mark attendance, get attendance, get summary)
- [X] T066 [US3] Add mock notification simulation in attendanceHandlers (console.log for Parent push notifications)

### Services for US3

- [X] T067 [US3] Create attendanceService in src/features/attendance/services/attendanceService.ts (markAttendance, getAttendance, getAttendanceSummary, getClassAttendanceSheet)

### Components for US3

- [X] T068 [P] [US3] Create AttendanceSheet component in src/features/attendance/components/AttendanceSheet.tsx (class roster with Present/Absent toggle buttons)
- [X] T069 [P] [US3] Create AttendanceStats component in src/features/attendance/components/AttendanceStats.tsx (attendance percentage, present/absent counts)
- [X] T070 [P] [US3] Create AttendanceHistory component in src/features/attendance/components/AttendanceHistory.tsx (calendar view of past attendance)
- [X] T071 [US3] Create AttendancePage in src/features/attendance/components/AttendancePage.tsx (date selector, class selector, submit button)

### Routes & Integration for US3

- [X] T072 [US3] Add attendance routes to src/App.tsx (/attendance, /attendance/:classId/:date)
- [X] T073 [US3] Add RoleGuard to attendance routes (Teacher, Admin, Staff can mark; Parents can view own child)
- [X] T074 [US3] Implement attendance correction logic (same-day edits allowed, after 24hrs requires Admin approval)
- [X] T075 [US3] Add concurrent marking simulation (Test: 500 teachers submit simultaneously, measure response time)

**Checkpoint**: Attendance marking complete - Teachers mark, records saved, parent notifications simulated

---

## Phase 6: User Story 4 - Notice Board (Priority: P4)

**Goal**: Admins publish targeted notices, users see notices based on role/class filters

**Independent Test**:
1. Admin creates "Winter Holidays" notice for "All Users" → visible to everyone
2. Create "Grade 10 Exam Schedule" for "Grade 10" → only G10 students/parents see it
3. Mark notice as "High Priority" → appears at top with red highlight

### Type Definitions & Models for US4

- [X] T076 [P] [US4] Create notice types in src/features/notices/types/notice.types.ts (Notice, NoticePriority, NoticeAudience, CreateNoticeRequest, NoticeListQuery, NoticeAttachment)

### Mock Data & Handlers for US4

- [X] T077 [P] [US4] Create mock notice data in src/mocks/data/notices.json (20+ notices with various targets and priorities)
- [X] T078 [US4] Implement notice mock handlers in src/mocks/handlers/noticeHandlers.ts (CRUD endpoints, read status tracking)

### Services for US4

- [X] T079 [US4] Create noticeService in src/features/notices/services/noticeService.ts (getNotices, getNotice, createNotice, updateNotice, deleteNotice, markAsRead)

### Components for US4

- [X] T080 [P] [US4] Create NoticeBoard component in src/features/notices/components/NoticeBoard.tsx (paginated list, high-priority notices at top)
- [X] T081 [P] [US4] Create NoticeCard component in src/features/notices/components/NoticeCard.tsx (title, date, priority badge, read/unread indicator)
- [X] T082 [P] [US4] Create NoticeForm component in src/features/notices/components/NoticeForm.tsx (rich text editor for content, audience selector)
- [X] T083 [US4] Create NoticeDetail page in src/features/notices/components/NoticeDetail.tsx (full content, attachments, mark as read)

### Routes & Integration for US4

- [X] T084 [US4] Add notice routes to src/App.tsx (/notices, /notices/:id, /notices/new)
- [X] T085 [US4] Add RoleGuard to notice routes (Admin, Staff, Teacher can create; all can view targeted notices)
- [X] T086 [US4] Implement notice targeting logic (filter by role, class, "All Users")
- [X] T087 [US4] Add pagination (10 notices per page) in NoticeBoard component
- [X] T088 [US4] Implement auto-archival logic (notices older than 365 days hidden from active view)

**Checkpoint**: Notice board complete - Admins create notices, users see targeted content

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final enhancements, optimizations, and production readiness

- [X] T089 [P] Add loading spinners for all async operations (skeleton screens for lists)
- [X] T090 [P] Add error boundary component in src/components/common/ErrorBoundary.tsx
- [X] T091 [P] Add confirmation dialogs for destructive actions (delete student, delete notice)
- [X] T092 [P] Implement optimistic UI updates for attendance marking (instant feedback)
- [X] T093 [P] Add toast notifications for success/error messages (shadcn/ui Toast component)
- [X] T094 Test all components in both light and dark themes for WCAG AA contrast (4.5:1 ratio)
- [X] T095 Test responsive layouts at 375px (mobile), 768px (tablet), 1920px (desktop)
- [ ] T096 Test Hindi translations for all user-facing strings
- [ ] T097 Optimize bundle size: React.lazy for routes, code splitting analysis
- [ ] T098 Run Lighthouse audit: Target 90+ performance, 100 accessibility, 100 best practices
- [X] T099 Add 404 Not Found page in src/components/common/NotFoundPage.tsx
- [X] T100 Add Unauthorized (403) page in src/components/common/UnauthorizedPage.tsx
- [X] T101 Document component usage in README.md (how to add new features)
- [X] T102 Create deployment config for production (VITE_USE_MOCK_API=false)

**Final Checkpoint**: Phase 1 Core Foundation complete and production-ready

---

## Maintenance & Bug Fixes (2026-02-12)

- [X] Fix: "Import/Export" buttons in Student List were invisible in Dark Mode (Text contrast issue).
- [X] Fix: Notice Board search input and dropdowns were unreadable in Dark Mode.
- [X] Feat: Implemented missing `StudentForm.tsx` (Add/Edit Student functionality).
- [X] Feat: Registered `/students/new` and `/students/:id/edit` routes.

---

## Dependency Graph

### Story Completion Order

```
Phase 1 (Setup) → Phase 2 (Foundation)
                     ↓
            ┌────────┴────────┬────────┬────────┐
            ↓                 ↓        ↓        ↓
         US1 (Auth)      US2 (SIS)  US3 (Att)  US4 (Notices)
         [P1 - MVP]      [P2]       [P3]       [P4]
            ↓                 ↓        ↓        ↓
            └─────────┬───────┴────────┴────────┘
                      ↓
                Phase 7 (Polish)
```

**Dependencies**:
- **US2, US3, US4** depend on US1 (Auth) for user context and RBAC
- **US3** optionally uses US2 (Student data) but can work with class rosters alone
- **US4** is fully independent after Auth
- All stories can be developed in parallel after Phase 2 completion

### Blocking Tasks

- **T001-T027** (Setup + Foundation) block ALL user stories
- **T028-T043** (US1 Auth) blocks access to US2, US3, US4 features
- Within each story: Type definitions → Mock data → Services → Components → Routes

---

## Parallel Execution Examples

### Phase 1 + 2 Parallelization (Day 1-3)
- Developer A: T001-T014 (Setup)
- Developer B: T015-T020 (Services setup)
- Developer C: T021-T027 (Common components)

### User Story 1 Parallelization (Day 4-7)
- Developer A: T028-T032 (Types + Mocks)
- Developer B: T033-T034 (Services + Context)
- Developer C: T035-T039 (Components)

### Multi-Story Parallelization (Day 8-25)
- Team A: US1 (T028-T043) → US3 (T063-T075) [Auth-dependent path]
- Team B: US2 (T044-T062) [Can start earlier, less dependency]
- Team C: US4 (T076-T088) [Independent after Auth]

### Polish Phase (Day 26-30)
- All developers: T089-T102 (cross-team review and testing)

---

## Implementation Strategy

### MVP First Approach
**Minimal Viable Product** = Phase 1 + Phase 2 + US1 (T001-T043)
- **Timeline**: 1-2 weeks
- **Value**: Working authentication, users can login with correct permissions
- **Demo**: Show Admin/Teacher/Parent login flows and role-based dashboard access

### Incremental Delivery
1. **Sprint 1** (Weeks 1-2): T001-T043 (Setup + Foundation + US1 Auth) → MVP Demo
2. **Sprint 2** (Weeks 3-4): T044-T062 (US2 Students) → Student management demo
3. **Sprint 3** (Weeks 5-6): T063-T075 (US3 Attendance) → End-to-end attendance flow demo
4. **Sprint 4** (Week 7): T076-T088 (US4 Notices) → Complete core features demo
5. **Sprint 5** (Week 8): T089-T102 (Polish) → Production-ready release

### Task Granularity
- Most tasks: **2-4 hours** (half-day work for experienced developer)
- Complex tasks (StudentList with virtual scrolling): **6-8 hours** (full day)
- Total estimated: **280-350 hours** (7-9 weeks for single developer, 3-4 weeks for team of 3)

---

## Success Criteria

### Phase Completion Checks

**Phase 1 Complete**: 
✅ `npm run dev` starts without errors
✅ Tailwind dark mode classes work
✅ All dependencies installed

**Phase 2 Complete**:
✅ ThemeToggle switches themes correctly
✅ Axios client intercepts requests
✅ i18n loads Hindi/English translations
✅ Common components render in both themes

**US1 Complete**:
✅ Admin login with email/password works
✅ Teacher login with OTP works (use 123456 for mock)
✅ Unauthorized routes redirect to /unauthorized
✅ JWT token refresh works automatically

**US2 Complete**:
✅ Admin creates student with unique ID (STU-2026-NNNNN)
✅ Upload PDF document (verify <10MB limit)
✅ Search "Grade 5" returns filtered students <1s
✅ 1000+ students render with virtual scrolling

**US3 Complete**:
✅ Teacher marks attendance for assigned class
✅ Attendance record saved with timestamp
✅ Parent notification simulated in console
✅ Attendance percentage calculated correctly

**US4 Complete**:
✅ Admin creates notice for "All Users"
✅ Notice with "High Priority" appears at top
✅ Only Grade 10 users see Grade 10-targeted notice
✅ Pagination shows 10 notices per page

**Phase 7 Complete**:
✅ Lighthouse score: 90+ performance, 100 accessibility
✅ Bundle size <500KB gzipped
✅ All text has 4.5:1 contrast in both themes
✅ Zero console errors in production build

---

## Notes

- **Mock API First**: All development uses JSON mock data (VITE_USE_MOCK_API=true)
- **Backend Integration**: Phase 1.1 (separate sprint) will replace mocks with real APIs
- **Testing**: No automated tests in this phase (per spec), manual QA only
- **Theme Support**: Every component must work in light + dark themes (use `dark:` variants)
- **i18n**: All strings must use translation keys (no hardcoded English text)
- **RBAC**: Every route and component must check permissions before rendering
- **Responsive**: Test at all 3 breakpoints before marking task complete

---

**Generated**: 2026-02-11  
**Total Tasks**: 102 tasks  
**Estimated Duration**: 7-9 weeks (single dev) | 3-4 weeks (team of 3)  
**MVP Scope**: 43 tasks (Phases 1-3)  
**Ready for Implementation**: ✅ All design artifacts available
