/**
 * Attendance Type Definitions
 * Defines types for attendance tracking, marking, and reporting
 */

// ============================================================================
// Core Attendance Types
// ============================================================================

/**
 * Attendance status enum
 */
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused' | 'Holiday';

/**
 * Individual attendance record
 */
export interface Attendance {
  attendanceID: string;
  studentID: string;
  classID: string;
  date: string; // ISO date string (YYYY-MM-DD)
  status: AttendanceStatus;
  markedBy: string; // userID of teacher/admin who marked attendance
  markedDate: string; // ISO datetime when attendance was marked
  remarks?: string;
  isModified: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  requiresApproval?: boolean; // True if modified after 24hrs
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
// Request/Response Types
// ============================================================================

/**
 * Request to mark attendance for a student
 */
export interface MarkAttendanceRequest {
  studentID: string;
  classID: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

/**
 * Response after marking attendance
 */
export interface MarkAttendanceResponse {
  success: boolean;
  attendanceID: string;
  message: string;
  notifications?: string[]; // Parent notification IDs
}

/**
 * Bulk mark attendance for entire class
 */
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

/**
 * Response for bulk attendance marking
 */
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

/**
 * Query parameters for getting attendance records
 */
export interface AttendanceQuery {
  studentID?: string;
  classID?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
}

/**
 * Response for attendance query
 */
export interface AttendanceQueryResponse {
  attendances: Attendance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Request to get class attendance sheet
 */
export interface GetClassAttendanceSheetRequest {
  classID: string;
  date: string;
}

/**
 * Request to get attendance summary
 */
export interface GetAttendanceSummaryRequest {
  studentID?: string;
  classID?: string;
  startDate: string;
  endDate: string;
}

/**
 * Request to modify attendance (with approval workflow)
 */
export interface ModifyAttendanceRequest {
  attendanceID: string;
  status: AttendanceStatus;
  remarks?: string;
  modifiedBy: string;
}

/**
 * Response for modify attendance
 */
export interface ModifyAttendanceResponse {
  success: boolean;
  requiresApproval: boolean;
  message: string;
}

/**
 * Attendance correction request (after 24hrs)
 */
export interface AttendanceCorrectionRequest {
  attendanceID: string;
  newStatus: AttendanceStatus;
  reason: string;
  requestedBy: string;
}

/**
 * Attendance correction approval
 */
export interface AttendanceCorrectionApproval {
  correctionID: string;
  approved: boolean;
  approvedBy: string;
  approvalDate: string;
  remarks?: string;
}

// ============================================================================
// Notification Types
// ============================================================================

/**
 * Parent notification for absence
 */
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
// Calendar Types
// ============================================================================

/**
 * Calendar date with attendance info
 */
export interface AttendanceCalendarDay {
  date: string;
  status?: AttendanceStatus;
  isHoliday: boolean;
  isWeekend: boolean;
  remarks?: string;
}

/**
 * Monthly attendance calendar
 */
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
// Constants
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

export const LOW_ATTENDANCE_THRESHOLD = 75; // Below 75% is considered low
export const SAME_DAY_CORRECTION_HOURS = 24; // Can correct within 24 hours
