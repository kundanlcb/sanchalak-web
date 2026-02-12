# Data Model: Spec 007 (Attendance)

## 1. Core Entities

### AttendanceRecord
Represents a single student's attendance status for a specific date.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **id** | string | Yes | Unique identifier (UUID or similar). |
| **studentId** | string | Yes | FK to Student entity. |
| **classId** | string | Yes | FK to Class entity (derived from Student or selected). |
| **date** | string | Yes | ISO Date string (YYYY-MM-DD). |
| **status** | enum | Yes | 'Present', 'Absent', 'Late', 'Half-Day'. |
| **remarks** | string | No | Optional notes for non-standard attendance. |
| **recordedBy** | string | No | User ID of the staff/teacher. |
| **timestamp** | string | No | Date/Time of recording. |

### Aggregate Summary (Virtual)
Used for dashboard display.

| Field | Type | Description |
| :--- | :--- | :--- |
| **totalDays** | number | Total working days in range. |
| **presentDays** | number | Days marked as Present. |
| **absentDays** | number | Days marked as Absent. |
| **percentage** | number | (presentDays / totalDays) * 100. |

## 2. Relationships
*   **Student** (1) -> **AttendanceRecord** (many)
*   **Class** (1) -> **AttendanceRecord** (many, via student)

## 3. Schema Definitions (Mock DB)
```typescript
interface MockAttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;       // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day';
  remarks?: string;
}

// In db.ts
export const db = {
  // ...
  attendance: MockAttendanceRecord[];
}
```
