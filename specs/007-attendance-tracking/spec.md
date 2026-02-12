# Specification: Connect Attendance to Mock DB (Refactor)

## 1. Context
*   **Goal**: Upgrade the existing **Attendance Page** to use the central dynamic database (`src/mocks/db.ts`) instead of static JSON files.
*   **Current State**:
    *   `AttendancePage.tsx` uses `classes.json` for the dropdown.
    *   `attendanceHandlers.ts` uses in-memory arrays and `students.json`.
    *   Data is not persistent and doesn't sync with the Student Management module.
*   **Target State**:
    *   Classes are fetched via `useAcademicStructure`.
    *   Student lists are fetched via `useStudentsByClass`.
    *   Attendance records are saved to `db.attendance`.

## 2. Requirements

### Refactoring Scope
1.  **Migrate Data Source**:
    *   Redirect `attendanceHandlers` to read/write from `db.attendance`.
    *   Ensure `MockDB` has an `attendance` collection schema.

2.  **Update UI Logic**:
    *   **Class Selector**: Replace `classesData` import with `useAcademicStructure()`.
    *   **Student List**: When a class is selected, fetch students from the DB (via `getStudents` or existing service) instead of `students.json`.

3.  **Persist Changes**:
    *   Marking attendance should save to `localStorage` (via `db.save()`).
    *   Refreshing the page should show the saved marks.

4.  **Integration**:
    *   Ensure the "Student View" (My Attendance) calculates summary from the same DB source.

## 3. Technical Changes
*   **`src/mocks/db.ts`**: Add `attendance` collection.
*   **`src/mocks/handlers/attendanceHandlers.ts`**: Rewrite to use `db.attendance`.
*   **`src/features/attendance/components/AttendancePage.tsx`**:
    *   Remove `import classesData`.
    *   Add `useAcademicStructure` hook.
    *   Pass dynamic class list to dropdown.

## 4. Success Criteria
1.  **Dynamic Classes**: The "Class" dropdown shows the classes created/edited in previous specs.
2.  **Persistence**: Mark student A as "Absent" -> Reload Page -> Student A is still "Absent".
3.  **Consistency**: If I add a new student in "Student Directory", they appear in the Attendance Register for their class.

## 5. Exclusions
*   No major UI Redesign (keep existing `AttendanceSheet`).
*   No SMS/Email notification integration (Mock only).
