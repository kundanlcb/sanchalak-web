# Tasks: Spec 007 - Attendance Tracking (Refactor)

## Phase 1: Mock Database & Persistence
- [x] **T001**: Update `src/mocks/db.ts` to include `AttendanceRecord` and `attendance` collection schema.
- [x] **T002**: Implement `persistAttendance` and `rehydrateAttendance` helper functions in `db.ts` (using `localStorage` with `MOCK_DB_ATTENDANCE` key).
- [x] **T003**: Initialize `db.attendance` from storage on app load to ensure data persistence across reloads.

## Phase 2: Handler Refactoring
- [x] **T004**: Refactor `src/mocks/handlers/attendanceHandlers.ts` to use `db.attendance` instead of in-memory arrays.
- [x] **T005**: Update `POST /attendance` handler to save records to `db.attendance` and trigger `persistAttendance`.
- [x] **T006**: Update `GET /attendance/sheet` handler to dynamically join `db.students` (filtered by class) with `db.attendance` records for the requested date.
- [x] **T007**: Update `GET /attendance/summary` handler to calculate statistics from `db.attendance`.

## Phase 3: UI Integration
- [x] **T008**: Update `src/features/attendance/components/AttendancePage.tsx`:
    - Remove `classesData` import.
    - Use `useAcademicStructure` hook for dynamic class list.
    - Wire `selectedClass` state to the fetched class list.
- [x] **T009**: Verify `AttendanceSheet.tsx` props alignment (ensure dynamic data flows correctly).

## Phase 4: Verification & Polish
- [x] **T010**: Verify: Create a new student in "Student Directory", then go to Attendance -> Select Class -> Verify student appears.
- [x] **T011**: Verify: Mark attendance for a class, reload page, and confirm marks persist.
- [x] **T012**: Verify: Mark attendance for a student, then check "My Attendance" (if applicable/accessible) or re-fetch summary to see updated stats.
- [x] **T013**: Run `npm run build` to ensure no type errors were introduced.
