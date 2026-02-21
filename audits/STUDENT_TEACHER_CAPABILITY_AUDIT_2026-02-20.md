# Student & Teacher Capability Audit

Date: 2026-02-20  
Scope: `gurukul` (student/parent app), `guru` (teacher app), `sanchalak_be` (backend), with contextual validation from `sanchalan` and `sanchalan-admin`.

## 1) Executive Summary

Current state is **partial readiness** for student and teacher mobile products.

- Backend (`sanchalak_be`) has broad API surface for attendance, homework, results, notices, timetable, transport, and profile.
- Student app (`gurukul`) and teacher app (`guru`) still rely heavily on mock/static data in core screens.
- Several backend aggregation, authorization, and role-gating paths are incomplete (`TODO` or permissive implementation).
- End-to-end product capability for both personas is therefore **not production-complete**.

Overall confidence by persona:

- Student: **~55% complete** (UI breadth good, real integrations uneven)
- Teacher: **~50% complete** (important APIs exist, app mostly mock-driven)

## 2) Audit Method

This audit reviewed:

- App navigation and screen implementations in `gurukul` and `guru`
- API hooks/services usage vs mock stores/static datasets
- Backend controller/service support and authorization behavior in `sanchalak_be`
- Existing web/admin apps to confirm capability existence outside mobile

Primary code evidence is listed in Section 8.

## 3) Capability Matrix: Student/Parent App (`gurukul`)

Legend: `Complete` = implemented with real data/API wiring and expected behavior; `Partial` = exists but mocked/incomplete; `Missing` = capability not implemented.

| Capability | Gurukul App | Backend Support | Overall | Notes |
|---|---|---|---|---|
| OTP login/session | Partial | Complete | Partial | App has API auth flow, but legacy mock auth context co-exists and creates ambiguity. |
| Multi-child/linked student context | Partial | Complete | Partial | Hooks and endpoints exist; not consistently surfaced in all feature screens. |
| Home dashboard (real aggregated data) | Partial | Partial | Partial | Home UI uses mock assignments/timetable; backend dashboard aggregation contains TODO/mock logic. |
| Attendance view/history | Partial | Complete | Partial | Screen currently hardcoded; backend has `/api/me/attendance*`. |
| Timetable | Partial | Complete | Partial | Screen and hooks exist; UI still mock-forward in main flows. |
| Homework list/details/submission | Partial | Complete | Partial | App list/detail screens use static data; backend supports list/detail and submission APIs. |
| Results/marks | Partial | Complete | Partial | Results screens use static term/subject data; backend endpoint exists. |
| Fees ledger/payments | Partial | Partial | Partial | UI mostly static; parent online payment journey not fully enabled at backend role/service level. |
| Notices and circulars | Partial | Complete | Partial | Notice screens are static; backend notice list/detail exists. |
| School calendar | Partial | Complete | Partial | Calendar UI static; backend calendar endpoint exists. |
| Notifications (in-app feed/read state) | Missing | Partial | Missing | App screen is mock data; backend has token register/unregister but not full feed/read APIs. |
| Transport tracking | Partial | Partial | Partial | App map is placeholder/mock; backend transport endpoints exist but depends on live telemetry readiness. |
| Profile/settings | Partial | Complete | Partial | Profile UI largely static/mock though backend `/api/me` exists. |

Student/Parent conclusion: feature coverage breadth is present, but many core surfaces are not wired to live data yet.

## 4) Capability Matrix: Teacher App (`guru`)

| Capability | Guru App | Backend Support | Overall | Notes |
|---|---|---|---|---|
| OTP login/session | Partial | Complete | Partial | Auth store exists; startup login check is not robustly wired in app bootstrap/navigation guard. |
| Teacher dashboard (today classes/tasks/summary) | Partial | Partial | Partial | App dashboard uses local mock store; backend teacher dashboard path in `/api/me/home` is TODO/empty. |
| Class attendance marking | Partial | Complete | Partial | Backend has attendance write APIs; app attendance flow currently store/mock-data centric. |
| Attendance stats/analytics | Partial | Complete | Partial | Hooks exist and backend stats endpoints exist; not consistently rendered from live data. |
| Homework create/manage | Partial | Complete | Partial | Backend CRUD available; app homework screen currently static placeholder. |
| Timetable/classes | Partial | Complete | Partial | Hooks exist; screen implementation is mostly static/mock. |
| Notices/announcements | Partial | Complete | Partial | Backend notices strong; app surfaces still mock-heavy. |
| Profile | Partial | Complete | Partial | Backend profile endpoints exist; app profile mostly static. |
| Notifications | Missing | Partial | Missing | App screen is static; backend lacks full notification inbox/read APIs. |
| Teacher-scoped authorization (only own classes/students) | N/A (app) | Partial | Partial | Backend service/controller scoping is inconsistent; risk of over-broad teacher access. |

Teacher conclusion: backend capability is better than mobile usage; app needs significant API wiring and auth/state hardening.

## 5) Backend Readiness (`sanchalak_be`) for Student/Teacher Personas

### Strengths

- OTP authentication lifecycle implemented.
- Strong set of self-service student/parent endpoints under `/api/me`.
- Attendance APIs include marking, sheet, and stats.
- Homework and notices APIs implemented.
- Calendar and transport endpoints available.

### Gaps/Risks

- `ProfileController` teacher dashboard response path is TODO/empty.
- Parent dashboard aggregation is TODO.
- `DashboardAggregationService` still uses placeholder/mock logic for key metrics.
- `DashboardController` role check uses `hasRole('ROLE_TEACHER')` pattern that is likely inconsistent with Spring role semantics used elsewhere.
- Notification subsystem lacks in-app feed/detail/read/unread APIs.
- Parent fee payment flow is incomplete for true self-service payment.
- Authorization scoping gaps in multiple domains (students/attendance/homework/documents/notices) can allow over-broad access.
- Some response mappers/services still contain hardcoded placeholder values.

## 6) What Is Complete vs Missing

### Complete (or near-complete foundations)

- Core backend domain APIs for attendance, homework, results, notices, profile, timetable retrieval, calendar, and transport route data.
- OTP authentication backend.
- Basic mobile navigation and screen architecture for both apps.

### Missing/Incomplete for Production Readiness

- Replacing mock/static datasets with API-backed state in major student and teacher screens.
- Teacher and parent dashboard aggregation completion on backend.
- Notification center end-to-end (backend inbox + app integration).
- Parent online fee payment end-to-end.
- Tight, consistent role/ownership authorization checks across services/controllers.
- Removal of legacy/mock auth patterns in apps.
- Integration tests validating persona-specific critical journeys.

## 7) Prioritized Remediation Plan

Priority is ordered by user impact + risk.

### P0 (Blockers for release)

1. Wire live API data for high-frequency screens:
   - `gurukul`: home, attendance, homework, results, fees, notices, transport.
   - `guru`: dashboard, attendance mark flow, homework, timetable, notices.
2. Complete backend dashboard aggregation (teacher + parent/student).
3. Implement authorization hardening for teacher/student/parent ownership scoping.
4. Define and implement notification inbox APIs + app consumption.

### P1 (High value)

1. Complete parent fee payment workflow and receipt visibility.
2. Remove or isolate mock/legacy auth context in `gurukul` and normalize auth state handling.
3. Fix role-expression inconsistencies and audit all `@PreAuthorize` usage.
4. Replace placeholder mapper values with real persisted fields.

### P2 (Quality)

1. Add contract tests for `/api/me/*` and teacher operational APIs.
2. Add mobile integration tests for top journeys:
   - Student attendance/homework/results/notices
   - Teacher attendance mark + homework create
3. Add observability for mobile-critical API failures and latency.

## 8) Key Evidence (Code References)

### Gurukul (Student/Parent App)

- Navigation and route model:
  - `gurukul/src/navigation/MainTabNavigator.tsx`
  - `gurukul/src/navigation/AppNavigator.tsx`
  - `gurukul/src/navigation/types.ts`
- Mock/static-driven screens:
  - `gurukul/src/features/dashboard/screens/HomeScreen.tsx`
  - `gurukul/src/features/academic/screens/AttendanceScreen.tsx`
  - `gurukul/src/features/academic/screens/HomeworkListScreen.tsx`
  - `gurukul/src/features/results/screens/ResultsScreen.tsx`
  - `gurukul/src/features/finance/screens/FeeScreen.tsx`
  - `gurukul/src/features/communication/screens/NoticesScreen.tsx`
  - `gurukul/src/features/transport/screens/BusTrackingScreen.tsx`
  - `gurukul/src/features/notifications/screens/NotificationScreen.tsx`
- API hooks present:
  - `gurukul/src/features/dashboard/hooks/useDashboard.ts`
  - `gurukul/src/features/academic/hooks/useAttendance.ts`
  - `gurukul/src/features/academic/hooks/useHomework.ts`
  - `gurukul/src/features/results/hooks/useResults.ts`
  - `gurukul/src/features/finance/hooks/useFees.ts`
  - `gurukul/src/features/communication/hooks/useNotices.ts`
  - `gurukul/src/features/transport/hooks/useBusTracking.ts`
- Notification/auth caveats:
  - `gurukul/src/services/notificationService.ts`
  - `gurukul/src/contexts/AuthContext.tsx`
  - `gurukul/src/store/authStore.ts`

### Guru (Teacher App)

- App navigation and auth gating:
  - `guru/src/navigation/AppNavigator.tsx`
  - `guru/src/store/authStore.ts`
- Mock/store-driven feature screens:
  - `guru/src/features/dashboard/store/index.ts`
  - `guru/src/features/dashboard/screens/HomeScreen.tsx`
  - `guru/src/features/academic/store/attendanceStore.ts`
  - `guru/src/features/academic/screens/AttendanceScreen.tsx`
  - `guru/src/features/academic/screens/HomeworkScreen.tsx`
  - `guru/src/features/notifications/screens/NotificationScreen.tsx`
- API hooks present:
  - `guru/src/features/academic/hooks/useAttendance.ts`
  - `guru/src/features/academic/hooks/useHomework.ts`
  - `guru/src/features/timetable/hooks/useTimetable.ts`
  - `guru/src/features/communication/hooks/useNotices.ts`
  - `guru/src/features/profile/hooks/useProfile.ts`

### Backend (`sanchalak_be`)

- Controllers:
  - `sanchalak_be/src/main/java/com/cm/sanchalak/controller/AuthController.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/controller/ProfileController.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/controller/DashboardController.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/controller/AttendanceController.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/controller/HomeworkController.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/controller/NoticeController.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/controller/TransportController.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/controller/CalendarController.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/controller/DocumentController.java`
- Services with notable TODO/placeholder/authorization concerns:
  - `sanchalak_be/src/main/java/com/cm/sanchalak/service/DashboardAggregationService.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/service/AttendanceService.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/service/HomeworkService.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/service/AcademicService.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/service/NoticeService.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/service/FinanceService.java`
  - `sanchalak_be/src/main/java/com/cm/sanchalak/service/StudentService.java`

## 9) Final Readiness Verdict

- Student app release readiness: **Not ready for full production** (core data flows still partially mocked).
- Teacher app release readiness: **Not ready for full production** (operational workflows not fully API-driven).
- Backend release readiness for these personas: **Functionally broad but operationally partial** due to dashboard TODOs, auth scoping gaps, and notification/payment incompleteness.

Recommended release gate: close all P0 items first, then re-audit using persona journey tests.
