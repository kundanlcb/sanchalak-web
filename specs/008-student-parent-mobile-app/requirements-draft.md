# Student/Parent Mobile App Requirements (Draft v0.5)

## 1. Objective
Build a React Native mobile app for `Student` and `Parent` users on top of the existing Sanchalan web product and `sanchalak_be` backend, with end-to-end clarity on scope, API readiness, and rollout phases.

## 2. Scope
- Target implementation repo: `gurukul` (React Native CLI project).
- In scope: Student and Parent app (Android + iOS), authentication, home dashboard, attendance, homework, timetable, results, fees, notices, notifications, profile/settings.
- Day-one quality baseline in scope: multilingual support and dark/light theme support across all MVP screens.
- Out of scope (initial): Teacher/Admin workflows, payroll, advanced analytics admin dashboards, full CMS-like content editing in mobile.

## 3. Personas
- `Student`: daily use for attendance, homework, timetable, exam results, fee visibility, notices.
- `Parent`: track one or multiple children, monitor attendance/performance, receive notices, pay fees, download receipts.

## 4. UX Direction (from provided sample UI)
- Visual style: card-first layout, high information density, simple iconography, timeline-style results/activities.
- Home: greeting header, quick status cards, assignment status block, shortcut modules.
- Academics: subject cards and progress.
- Results: term-wise result timeline (pass/fail/promoted states).
- Timetable/day view: session cards with subject, time, and type.
- Bottom navigation (recommended): `Home`, `Timetable`, `Academics`, `Results`, `Profile`.

### 4.1 UI Fidelity Requirement (Mandatory)
- Mobile UI must be strongly aligned to the provided reference image in:
  - card shapes, spacing rhythm, and section hierarchy
  - dashboard content order (greeting -> highlight card -> learning/activity blocks -> assignment status)
  - result timeline style and status chips (`Pass`, `Failed`, `Promoted`)
  - subject/academic tile visuals and compact list density
  - bottom navigation visual weight and icon-first layout
- Product/design acceptance for MVP includes a dedicated visual parity review against the reference image before release sign-off.

## 5. Feature Requirements

### 5.1 Authentication and Account
- OTP-first login for Student/Parent mobile numbers.
- Persistent session with secure token storage.
- Parent account supports multi-child linking and student switcher.
- Logout from all devices (phase-2 if backend supports token invalidation list).

### 5.2 Home Dashboard
- Personalized greeting + profile avatar.
- Today summary:
  - Attendance status
  - Pending homework count
  - Upcoming exam/task
  - Pending fee amount (for parent and optionally student)
- Quick actions:
  - View homework
  - View timetable
  - View results
  - Pay fees
  - Notices

### 5.3 Attendance
- Student/Parent read-only attendance:
  - Monthly percentage
  - Present/Absent/Late counts
  - Date-wise history
- Filters: date range/month.
- Optional phase-2: leave request and approval tracking.

### 5.4 Homework / Digital Diary
- List homework by class/subject/date.
- Detail view with description, due date, and attachments.
- Status labels: upcoming, due today, overdue, completed.
- Parent and student read access; student submission/completion workflow is included in MVP.

### 5.5 Timetable
- Class timetable day/week view.
- Slot details: time, subject, teacher.
- Highlight current or next period.

### 5.6 Results / Report Card
- Term list + result summary cards.
- Subject-wise marks, percentage, grade.
- Download/share report card PDF where available.
- Progress snapshot (current term vs previous term) in phase-2.

### 5.7 Fees and Payments
- Student ledger: total dues, paid, pending, due items.
- Payment flow for student and parent:
  - UPI/Card/other enabled methods
  - success/failure states
  - transaction history
- Receipt download (PDF).
- Optional phase-2: split/partial payments from mobile UI.

### 5.8 Notices and Communication
- Notice feed with priority and targeting.
- Notice details + attachments.
- Read/unread marker.
- Push notifications for critical notices.

### 5.9 Profile and Settings
- Profile (student/parent basic details).
- App settings:
  - language (English/Hindi)
  - notification toggles
  - theme mode (light/dark/system)
- Parent child-switcher in profile header or top app bar.

### 5.10 Calendar (MVP)
- Unified calendar for:
  - exams
  - school holidays
  - key notice dates/events
- Day and month view, with tap-to-detail behavior.

### 5.11 Bus Tracking (MVP)
- Live bus location on map for assigned route(s).
- ETA for next stop and school/home stop.
- Route and stop list with scheduled vs current status.
- Pickup/drop event alerts:
  - bus approaching stop
  - student boarded (if attendance device/event exists)
  - student dropped
- Parent can track linked child bus route; student can view own route.
- Fallback behavior: if live GPS unavailable, show last updated timestamp and static route details.

### 5.12 Internationalization and Theming (Day One)
- Internationalization is mandatory from the first development sprint.
- Minimum languages for MVP: English and Hindi.
- Theme support is mandatory from day one:
  - light mode
  - dark mode
  - system mode preference support
- All screen components must be theme-token driven; no hardcoded color literals in feature screens.
- String and layout handling must support variable text length for localization.

## 6. Role Matrix (Mobile)

| Feature | Student | Parent |
|---|---|---|
| Login (OTP) | Yes | Yes |
| Home dashboard | Yes | Yes |
| Attendance view | Own only | Linked children |
| Homework view | Own class | Linked children |
| Timetable | Own class | Linked children |
| Results | Own only | Linked children |
| Fees ledger | View + pay | View + pay |
| Receipts | View/download | View/download |
| Notices | Read | Read |
| Calendar | Read | Read |
| Bus tracking | Own route | Linked children |
| Profile/settings | Yes | Yes |

## 7. Backend Readiness Check (Current State)

### 7.1 Available or Partially Available
- Attendance APIs exist (`/api/attendance`, `/api/attendance/summary`, class/date endpoints).
- Homework APIs exist (`/api/homework` create + list).
- Routine API exists (`/api/academics/routine?classId=`).
- Academic terms/subjects/report data endpoints exist.
- Finance ledger/transaction/receipt endpoints exist under `/api/finance`.

### 7.2 Critical Gaps to Close Before Mobile Build
- Auth contract mismatch:
  - Web frontend expects OTP endpoints (`/auth/login-otp`, `/auth/verify-otp`).
  - Backend currently has email/password signin (`/api/auth/signin`) only.
- Role mismatch:
  - Frontend uses roles: `Admin`, `Teacher`, `Staff`, `Parent`, `Student`.
  - Backend enum currently has only `ROLE_USER`, `ROLE_ADMIN`, `ROLE_TEACHER`, `ROLE_STUDENT`.
  - Some controllers reference roles not in enum (`PARENT`, `PRINCIPAL`, `OFFICE_STAFF`), causing authorization inconsistency.
- Parent model missing:
  - No dedicated parent entity and no robust parent-student mapping for multi-child accounts.
- Student-user linkage missing:
  - `Student` has no direct `user_id` relation, making "my data" resolution difficult for student login.
- Endpoint naming mismatch between web frontend and backend:
  - Example: student APIs use `/students` in frontend service but backend uses `/api/academics/students`.
  - Finance paths differ as well.
- Parent access restrictions:
  - Homework and finance operation APIs do not consistently include parent role.
- Bus tracking backend not available yet:
  - No transport route/stop/vehicle/GPS ingestion and tracking APIs currently exposed.

## 8. Mandatory Phase-0 (Backend/API Alignment)
- Finalize canonical auth flow for mobile (OTP + refresh token contract).
- Standardize role dictionary and PreAuthorize usage.
- Add parent domain and child linking model.
- Add current user context endpoints:
  - `GET /api/mobile/v1/me`
  - `GET /api/mobile/v1/me/students`
  - `GET /api/mobile/v1/me/home`
- Unify endpoint naming and response shapes for mobile consumption.
- Add notification token registration endpoint for FCM/APNs.
- Add transport and tracking APIs:
  - route/stop assignment APIs
  - live location ingestion endpoint from GPS device/provider
  - mobile-facing tracking endpoint with ETA payloads
  - pickup/drop alert event APIs

## 9. Mobile App Technical Requirements
- Stack: React Native CLI (no Expo) + TypeScript.
- Navigation: React Navigation (native-stack + bottom-tabs).
- Data + networking: Axios service layer + TanStack React Query.
- Persistence:
  - AsyncStorage for non-sensitive data and query persistence.
  - Encrypted storage for sensitive token/session values.
- Push/notifications:
  - Firebase Messaging + native notification manager (Notifee-style integration).
- Payments:
  - Native gateway SDK integration (Razorpay-style strategy approach).
- State:
  - Server state via React Query.
  - Local app state via Context providers (Auth, Theme, Badge/Notification counters).
- Offline:
  - Cache last 7 days attendance/homework/notices.
  - Graceful empty/offline states.
- Notifications:
  - Push for absence, fee reminder, new notice, exam publish.
  - Push for bus arrival/boarding/drop events.
- Performance:
  - Home screen TTI < 2.5s on average mid-range Android.
  - API retry/backoff + pagination for large lists.
- Maps:
  - Integrate production map SDK/provider for live bus tracking and route rendering.

### 9.1 Coding Style Baseline (Aligned to `shubh-milan-fe`)
- Architecture: Feature-first modular structure.
  - `src/features/<feature>/screens`
  - `src/features/<feature>/components`
  - `src/features/<feature>/hooks`
  - `src/features/<feature>/index.ts` (public exports)
- Shared layers:
  - `src/navigation` for app navigators and route types
  - `src/services` for API and external integrations
  - `src/context` for global providers
  - `src/config` for API/query/env config
  - `src/constants` for colors/spacing/typography/style tokens
- UI implementation:
  - Use `StyleSheet.create` with centralized design tokens (no Tailwind/utility CSS approach).
  - Keep screen components lean; move business logic to hooks.
- API contract handling:
  - Central `api.client` with interceptors, token refresh queue, and unified error mapping.
  - Centralized endpoint constants (`API_ENDPOINTS`) to avoid hardcoded route strings in screens.
- Data-fetching conventions:
  - React Query default options + persisted cache.
  - Feature hooks expose stable `{ data, isLoading, error, refetch }`-style APIs.
- Internationalization:
  - i18next bootstrap at app entry with at least English/Hindi locales.
- Theming:
  - centralized theme context with tokenized light/dark palettes
  - user preference persisted and reapplied at app startup
- App bootstrap/provider order:
  - Query persistence provider -> Theme provider -> Auth provider -> app navigation container

### 9.2 Mock-First Plug-and-Play Architecture (Mandatory)
- Development starts with mock data providers in `gurukul`; backend integration is a later switch with no screen-level rewrites.
- Data access abstraction is mandatory:
  - Define feature-level repository interfaces (e.g., `AttendanceRepository`, `FeesRepository`, `TransportRepository`).
  - Provide two implementations per repository:
    - `mock` implementation (local static/in-memory data, simulated latency/errors)
    - `api` implementation (real backend HTTP integration)
- Source selection must be centralized:
  - runtime/env configuration controls data source (`mock` vs `api`)
  - UI/screens/hooks must not branch on source type.
- Contract parity requirement:
  - mock responses must match the same TypeScript DTO contracts used by real APIs.
  - no separate UI model forks for mock vs real.
- Plug-and-play switch requirement:
  - moving from mock to real API should require config change + minimal adapter wiring only.
  - no business logic changes in screens/components for the switch.
- Service boundaries:
  - no direct `axios/fetch` calls inside screens or presentational components.
  - all network logic must live under `src/services` and repository implementations.
- Error behavior parity:
  - mock layer should simulate common error paths (401/403/500/timeout/offline) to harden UI flows before backend go-live.

## 10. API Contract Governance
- All mobile-consumed APIs must be formalized in OpenAPI before implementation.
- Canonical versioned namespace: `/api/mobile/v1/...`.
- No screen should consume non-versioned ad-hoc APIs.
- Standard response envelope:
  - `success: boolean`
  - `data: object | array | null`
  - `error: { code, message, details? } | null`
  - `meta: { requestId, timestamp, pagination? }`
- Breaking changes:
  - not allowed inside `v1` without migration plan
  - must be introduced in `v2` with deprecation notice
- Contract-first flow is mandatory: OpenAPI update -> backend implementation -> frontend integration.

## 11. Identity and Access Model
- Required domain model:
  - `User` (auth principal)
  - `StudentProfile` (student domain entity)
  - `ParentProfile` (parent domain entity)
  - `ParentStudentLink` (one parent to many students; one student to many guardians if needed)
- Mandatory claim resolution:
  - student login resolves only one `studentId`
  - parent login resolves `studentIds[]` for linked children
- Authorization rules:
  - student can read only self records
  - parent can read only linked child records
  - payment actions must validate ownership/linkage server-side
  - bus tracking can only be viewed for linked routes/children
- Data access must never trust client-submitted `studentId` without server-side linkage validation.

## 12. Bus Tracking Contract
- Core transport entities:
  - `Vehicle`, `Route`, `Stop`, `Trip`, `StudentTransportAssignment`, `LocationPing`, `TransportEvent`
- Mobile-facing APIs (v1):
  - `GET /api/mobile/v1/me/transport` -> assigned route/vehicle summary
  - `GET /api/mobile/v1/transport/live` -> current bus location + speed + heading + lastUpdatedAt
  - `GET /api/mobile/v1/transport/stops` -> ordered stop list + ETA per stop
  - `GET /api/mobile/v1/transport/events` -> pickup/drop/arrival history for current day
- Ingestion APIs (provider/device side):
  - `POST /api/mobile/v1/transport/location-pings`
  - `POST /api/mobile/v1/transport/events`
- Required live payload fields:
  - `vehicleId`, `routeId`, `lat`, `lng`, `capturedAt`, `serverReceivedAt`, `accuracyMeters`
- Stale-data rule:
  - if no ping for configurable threshold, UI must show stale state with explicit timestamp.

## 13. MVP Acceptance Criteria by Module
- Auth:
  - OTP login success in <= 10 seconds p95.
  - Invalid OTP shows actionable error and retry.
- Home:
  - Dashboard loads all widgets in <= 2.5 seconds (median on target device class).
- Attendance:
  - Summary and history match backend totals for selected period.
- Homework:
  - Student can view and mark/submit homework status; parent can view child status.
- Timetable:
  - Day/week timetable renders correctly for selected child.
- Results:
  - Term and subject marks match backend report payload.
- Fees:
  - Ledger totals (due/paid/pending) are consistent after payment success.
  - Receipt download opens valid PDF.
- Notices:
  - Targeted notices visible by role/child context and mark-as-read persists.
- Calendar:
  - Exam/holiday/events appear on correct dates across month/day views.
- Bus tracking:
  - Live location, ETA, and pickup/drop events update correctly under normal feed latency.
- Localization:
  - All MVP screens support English and Hindi strings without truncation breakage.
- Theme:
  - All MVP screens render correctly in both light and dark modes.
  - Contrast for text and critical status indicators remains readable in both modes.

## 14. Design System and UI Parity Spec
- Centralized token system is mandatory:
  - color palette
  - typography scale
  - spacing scale
  - border radius scale
  - elevation/shadow scale
- Component baseline set:
  - cards
  - chips/status pills
  - section headers
  - timeline cells
  - bottom nav
  - list rows
  - empty/error states
- UI parity checkpoints against provided reference image:
  - layout hierarchy
  - card density
  - timeline treatment
  - dashboard rhythm and visual weight
- Each MVP screen requires a visual sign-off screenshot set in both light and dark themes.

## 15. Offline and Sync Rules
- Cache policy:
  - attendance/homework/notices/calendar/bus events: last 7 days minimum
  - profile/settings: persistent until explicit refresh
- Query persistence:
  - React Query cache persisted to AsyncStorage with controlled max-age.
- Mutations in poor network:
  - queued retry for non-payment idempotent actions
  - payment operations must never auto-repeat without explicit idempotency key validation
- Conflict handling:
  - server is source of truth
  - client shows "updated on server" state and refreshes local cache after reconciliation.

## 16. Security and Privacy Baseline
- Token/session:
  - short-lived access token + refresh token rotation policy
  - secure storage for sensitive credentials/tokens
- Data protection:
  - no sensitive PII in logs
  - encrypt sensitive local storage where applicable
- Access controls:
  - strict server-side authorization for every child-scoped endpoint
  - audit logging for sensitive operations (payments, profile edits, transport assignment changes)
- Bus-location privacy:
  - location visibility restricted to authorized linked users
  - route history retention window must be configurable and policy-driven.

## 17. Testing and QA Strategy
- Unit testing:
  - services, hooks, and utility/domain logic (including fee calculations and ETA formatting).
- Integration testing:
  - API client interceptors, auth refresh flow, role-scoped data access.
- UI testing:
  - screen smoke tests for all MVP modules
  - visual regression snapshots for high-priority screens (home, results, bus tracking, fees).
- Theme + localization QA:
  - smoke pass in English/Hindi and light/dark modes for all MVP screens.
  - verify no clipped/overlapping text in Hindi translations.
- Contract testing:
  - OpenAPI schema validation for all `/api/mobile/v1` endpoints.
- Data-source parity testing:
  - repository contract tests must pass for both `mock` and `api` implementations.
  - source switch tests verify that feature hooks/screens behave identically for `mock` and `api` modes.
- Manual QA checklist:
  - role switch (student vs parent)
  - multi-child parent flow
  - offline/online transitions
  - notification deep links and state restoration

## 18. MVP Recommendation (Release 1)
- Auth (OTP), profile bootstrap, child switcher.
- Home dashboard.
- Attendance (summary + history).
- Homework list/detail + completion/submission workflow.
- Timetable.
- Results list/detail (without deep analytics).
- Fees ledger + payment + receipt download for Student and Parent.
- Notices feed/detail.
- Calendar module.
- Bus tracking (live location + ETA + alerts).
- Bilingual UI (English + Hindi) enabled by default.

## 19. Phase-2 (Release 2)
- Leave request workflow.
- Advanced result analytics and trend charts.
- In-app chat/messaging with school (if needed).
- Deeper offline mode and background sync.

## 20. Locked MVP Decisions
1. Student and Parent both can pay fees in MVP.
2. Homework completion/submission is included in MVP.
3. Calendar module is included in MVP.
4. Parent child-switcher will be in top app header.
5. Bilingual support (Hindi/English) is mandatory in MVP.
6. Mobile implementation will follow `shubh-milan-fe` coding style and architecture patterns.
7. App will be built with React Native CLI (no Expo).
8. Implementation will use `gurukul` repository.
9. Development starts with mocks, then switches to real APIs via plug-and-play data-source configuration.

## 21. Open Product Decisions (Need Finalization)
1. Should report cards be server-generated PDF only, or also app-rendered snapshot?
2. Which payment gateway should be used first for production?
3. What is the minimum device/OS support target?
4. Are there school-specific theming/custom branding requirements now?
5. Should notice acknowledgements (read receipt by parent) be mandatory?
6. Bus tracking provider decision: own GPS hardware feed vs third-party aggregator?
7. Bus tracking privacy policy: who can view route history and for how long?
8. Required bus alert SLA: near real-time (<10s) or standard real-time (<30s)?

## 22. Immediate Next Step
Freeze API contract for mobile first, then start React Native app skeleton and implement MVP modules in this order:
1. Auth + session
2. Home + child context
3. Attendance + homework + timetable
4. Results + notices + calendar
5. Fees + payment + receipts
6. Bus tracking + transport alerts
7. Refactor passes to maintain `shubh-milan-fe`-style architecture and folder contracts from day 1 (avoid late structural rewrites)
