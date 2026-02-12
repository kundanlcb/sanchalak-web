# QuickStart: Spec 007 (Attendance)

## 1. Prerequisites
- [ ] Dependencies: `db.ts` upgrade
- [ ] Handlers: `attendanceHandlers.ts` refactoring (needs valid mock logic)

## 2. Setup
1.  Run `npm install` (no new deps)
2.  Review `db` changes in `src/mocks/db.ts` (ensure data is present)
3.  Check Mock Service Worker is active (`mockServiceWorker.js` in `public/`)

## 3. Development Flow
1.  Open `src/features/attendance/components/AttendancePage.tsx`.
2.  Verify Class Selector works with `useAcademicStructure`.
3.  Verify Student List loads from Mock DB (`useStudents(classId)`).
4.  Mark attendance -> Check `localStorage` key `MOCK_DB_ATTENDANCE` (if using persistence).
5.  Reload page -> Check persistence.

## 4. Verification Steps
- [ ] Select a valid Class & Section.
- [ ] Ensure date picker is working.
- [ ] Click "Save Attendance".
- [ ] Confirm success toast.
- [ ] Reload and verify data remains.
