# Research & Findings: Spec 007 (Attendance Persistence)

**Date**: 2026-02-12
**Feature**: Attendance Tracking Refactor

## Key Questions

### Q1: How to persist mock data across page reloads?
**Context**: `src/mocks/db.ts` is in-memory. Reloading the page resets all changes.
**Findings**:
*   The project uses MSW. Handlers execute in the Service Worker context.
*   Service Workers generally do not have access to `localStorage` (synchronous API). They should use `IndexedDB`.
*   **Simple Alternative**: We can use `sessionStorage` mock or just browser storage if available.
*   **Best Practice**: Create a wrapper `StorageAdapter` in `db.ts`.
    *   Initialize: Check `localStorage.getItem('MOCK_DB_ATTENDANCE')`. If null, empty array.
    *   Save: `localStorage.setItem('MOCK_DB_ATTENDANCE', JSON.stringify(data))`.
    *   *Caveat*: If handlers run in SW, this might fail.
    *   *Fallback*: If `localStorage` undefined, use in-memory.

**Decision**: implement a `Persist` helper in `db.ts` that tries `localStorage`. If it fails (due to SW context), we accept in-memory limitations for now OR use `IndexedDB`. Given the scope (Mock DB), `localStorage` is acceptable if accessible, otherwise ephemeral is fine.

### Q2: Data Structure for Attendance
**Schema**:
```typescript
interface AttendanceRecord {
  id: string;        // unique ID
  date: string;      // YYYY-MM-DD
  classId: string;   // Link to Class
  studentId: string; // Link to Student
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day';
  remarks?: string;
}
```
**Storage**:
*   Array of objects.
*   Query by `classId` + `date`.

## Conclusion
We will implement basic persistence using `localStorage` in `db.ts`. If running in strict SW mode without access, we will degrade to in-memory only.
