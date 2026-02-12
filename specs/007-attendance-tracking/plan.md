# Implementation Plan - Spec 007: Attendance Tracking (Refactor)

## Technical Context

| Component | Status | Source/Target |
| :--- | :--- | :--- |
| **Mock Database** | Update | `src/mocks/db.ts`: Add `attendance` collection and `AttendanceRecord` type. |
| **Attendance Handlers** | Refactor | `src/mocks/handlers/attendanceHandlers.ts`: Use `db.attendance` instead of local mock data. |
| **Attendance Page** | Modify | `src/features/attendance/components/AttendancePage.tsx`: Replace `classesData` with `useAcademicStructure`. |
| **Data Types** | Verify | `src/features/attendance/types/attendance.types.ts`: Ensure `AttendanceRecord` aligns with schema. |
| **Persistence** | Implement | Add simple `localStorage` persistence layer to `db.ts` (optional enhancement for verification). |

## Constitution Check

| Principle | Check | Validation |
| :--- | :--- | :--- |
| **RBAC** | ✅ | `AttendancePage` already checks roles (Admin/Teacher/Staff). |
| **Type Safety** | ✅ | All new DB interactions must use strict TypeScript types from executing module. |
| **Backend Integration** | ✅ | Using centralized `mockDB` pattern ensures API contract consistency. |
| **Component Architecture** | ✅ | Reusing existing `AttendanceSheet` component without modification. |

## Phase 0: Research & Discovery

### Unknowns & Riskiest Assumptions
1.  **Mock Persistence**: `db.ts` currently resets on reload. Requirement "Data persists after refresh" implies we need a `save` mechanism.
    *   *Decision*: We will update `db.ts` to initialize from `localStorage` if available, or default to JSON.
2.  **Date Handling**: Attendance is date-specific. Need to ensure consistent ISO string format (`YYYY-MM-DD`) as keys.

### Research Tasks
- [ ] Determine best way to persist `db` updates (e.g., `window.localStorage.setItem('mock_db_attendance', ...)`) in `useEffect` or directly in handlers.

## Phase 1: Implementation Strategy

### Step 1: Mock Database Upgrade
1.  Define `AttendanceRecord` interface in `db.ts` contexts (or import).
2.  Add `attendance: AttendanceRecord[]` to `db` object.
3.  Implement `saveToStorage()` and `loadFromStorage()` logic in `db.ts` to persist `attendance` collection.

### Step 2: Handler Refactoring
1.  **`POST /attendance`**: Update to push to `db.attendance` and call `saveToStorage()`.
2.  **`GET /attendance/sheet`**: Query `db.attendance` for `classId` + `date`. Join with `db.students` to ensure all students are listed.
3.  **`GET /attendance/summary`**: Aggregate stats from `db.attendance`.

### Step 3: UI Integration
1.  Update `AttendancePage.tsx`:
    *   Remove `import classesData`.
    *   Add `const { classes } = useAcademicStructure();`.
    *   Use `classes` in the Class Selector dropdown.
2.  Verify `useStudentsByClass` is utilized indirectly via the handlers (the handler joins the data). Or does the UI fetch students separately?
    *   *Correction*: `AttendancePage` calls `attendanceService.getClassAttendanceSheet`. The handler constructs the sheet.
    *   *Logic*: Handler fetches students from `db.students` (filtered by class) and merges with `db.attendance` for that day.

## Phase 2: Verification

### User Scenarios
1.  **Teacher Flow**:
    *   Select "Class 5-A".
    *   Mark "Roll 1" Absent.
    *   Click Save.
    *   Reload Page -> "Roll 1" is still Absent.
2.  **Admin Flow**:
    *   Create New Student "John Doe".
    *   Go to Attendance -> Select Class.
    *   "John Doe" appears in list (default Present).

### Automated Tests (Manual Checklist)
- [ ] `npm run build` passes.
- [ ] No console errors on load.
- [ ] LocalStorage contains `mock_db_attendance`.
