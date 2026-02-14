/**
 * Attendance Type Definitions
 * Domain types that derive from generated API models where shapes overlap.
 * Components should ALWAYS import from here — never from src/api/ directly.
 */

// ============================================================================
// Re-exported API Types (for service layer use)
// ============================================================================

/** Generated DTOs — use these in services that call the API directly */
export type { AttendanceRecordDto } from '../../../api/models/attendance-record-dto';
export { AttendanceRecordDtoStatusEnum } from '../../../api/models/attendance-record-dto';
export type { AttendanceSummaryDto } from '../../../api/models/attendance-summary-dto';
export type { ClassAttendanceSheetDto } from '../../../api/models/class-attendance-sheet-dto';
export type { MarkAttendanceRequest as ApiMarkAttendanceRequest } from '../../../api/models/mark-attendance-request';
export type { BulkMarkAttendanceRequest as ApiBulkMarkAttendanceRequest } from '../../../api/models/bulk-mark-attendance-request';
export type { UpdateAttendanceRequest as ApiUpdateAttendanceRequest } from '../../../api/models/update-attendance-request';

// ============================================================================
// Core Attendance Types (domain layer)
// ============================================================================

/**
 * Attendance status — title-case string union for UI display.
 * Service layer maps to/from AttendanceRecordDtoStatusEnum.
 */
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused' | 'Holiday';

/**
 * Individual attendance record
 */
export interface Attendance {
  attendanceID: string;
  studentID: string;
  classID: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  markedDate: string;
  remarks?: string;
  isModified: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  requiresApproval?: boolean;
}

/**
 * Class attendance sheet for a specific date
 */
export interface ClassAttendanceSheet {
  classID: string;
  className: string;
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendancePercentage: number;
  students: StudentAttendance[];
  isMarked: boolean;
  markedBy?: string;
  markedDate?: string;
}

/**
 * Student attendance info for sheet display
 */
export interface StudentAttendance {
  studentID: string;
  name: string;
  rollNumber: number;
  status: AttendanceStatus;
  profilePhoto?: string;
  remarks?: string;
}

/**
 * Attendance summary for a student over a period
 */
export interface AttendanceSummary {
  studentID: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  holidayDays: number;
  attendancePercentage: number;
  records: Attendance[];
}

/**
 * Class-wise attendance summary
 */
export interface ClassAttendanceSummary {
  classID: string;
  className: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  averageAttendance: number;
  studentsWithLowAttendance: Array<{
    studentID: string;
    name: string;
    attendancePercentage: number;
  }>;
  dailySummary: Array<{
    date: string;
    presentCount: number;
    absentCount: number;
    percentage: number;
  }>;
}

// ============================================================================
// Request/Response Types (domain layer)
// ============================================================================

export interface MarkAttendanceRequest {
  studentID: string;
  classID: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface MarkAttendanceResponse {
  success: boolean;
  attendanceID: string;
  message: string;
  notifications?: string[];
}

export interface BulkMarkAttendanceRequest {
  classID: string;
  date: string;
  attendances: Array<{
    studentID: string;
    status: AttendanceStatus;
    remarks?: string;
  }>;
  markedBy: string;
}

export interface BulkMarkAttendanceResponse {
  success: boolean;
  marked: number;
  failed: number;
  errors?: Array<{
    studentID: string;
    error: string;
  }>;
  message: string;
}

export interface AttendanceQuery {
  studentID?: string;
  classID?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
}

export interface AttendanceQueryResponse {
  attendances: Attendance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetClassAttendanceSheetRequest {
  classID: string;
  date: string;
}

export interface GetAttendanceSummaryRequest {
  studentID?: string;
  classID?: string;
  startDate: string;
  endDate: string;
}

export interface ModifyAttendanceRequest {
  attendanceID: string;
  status: AttendanceStatus;
  remarks?: string;
  modifiedBy: string;
}

export interface ModifyAttendanceResponse {
  success: boolean;
  requiresApproval: boolean;
  message: string;
}

export interface AttendanceCorrectionRequest {
  attendanceID: string;
  newStatus: AttendanceStatus;
  reason: string;
  requestedBy: string;
}

export interface AttendanceCorrectionApproval {
  correctionID: string;
  approved: boolean;
  approvedBy: string;
  approvalDate: string;
  remarks?: string;
}

// ============================================================================
// Notification Types (frontend-only)
// ============================================================================

export interface AbsenceNotification {
  notificationID: string;
  parentID: string;
  studentID: string;
  studentName: string;
  date: string;
  status: AttendanceStatus;
  sentDate: string;
  channel: 'SMS' | 'Email' | 'Push';
  isDelivered: boolean;
}

// ============================================================================
// Calendar Types (frontend-only)
// ============================================================================

export interface AttendanceCalendarDay {
  date: string;
  status?: AttendanceStatus;
  isHoliday: boolean;
  isWeekend: boolean;
  remarks?: string;
}

export interface AttendanceCalendar {
  studentID: string;
  month: number;
  year: number;
  days: AttendanceCalendarDay[];
  summary: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    holidays: number;
  };
}

// ============================================================================
// Constants (frontend-only)
// ============================================================================

export const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  Present: 'green',
  Absent: 'red',
  Late: 'yellow',
  Excused: 'blue',
  Holiday: 'gray',
};

export const ATTENDANCE_STATUS_ICONS: Record<AttendanceStatus, string> = {
  Present: '✓',
  Absent: '✗',
  Late: '⏰',
  Excused: '📝',
  Holiday: '🏖',
};

export const LOW_ATTENDANCE_THRESHOLD = 75;
export const SAME_DAY_CORRECTION_HOURS = 24;
