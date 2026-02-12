// Attendance API Contracts (Mock)

/**
 * Common Type Definitions
 */
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half-Day';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  recordedBy?: string;
}

export interface AttendanceQuery {
  classId?: string;
  studentId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Endpoints
 */

// POST /attendance
export interface MarkAttendanceRequest {
  date: string;       // YYYY-MM-DD
  classId: string;    // Required to filter
  records: {
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
  }[];
}

export interface MarkAttendanceResponse {
  success: boolean;
  message: string;
  updatedCount: number;
}

// GET /attendance/summary
export interface GetAttendanceSummaryRequest {
  studentId: string;
  startDate?: string;
  endDate?: string;
}

export interface GetAttendanceSummaryResponse {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
}

// GET /attendance/sheet (Class View)
export interface GetClassAttendanceSheetRequest {
  classId: string;
  date: string;
}

export interface ClassAttendanceSheetResponse {
  classId: string;
  date: string;
  students: {
    studentId: string;
    name: string;
    rollNumber: string;
    status: AttendanceStatus; // Default 'Present' if not found
    remarks?: string;
  }[];
}
