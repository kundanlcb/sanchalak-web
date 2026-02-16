/**
 * Mock Attendance Handlers
 * Handles attendance marking, retrieval, and summary generation
 */

import type {
  Attendance,
  MarkAttendanceRequest,
  MarkAttendanceResponse,
  BulkMarkAttendanceRequest,
  BulkMarkAttendanceResponse,
  AttendanceQuery,
  AttendanceQueryResponse,
  GetClassAttendanceSheetRequest,
  ClassAttendanceSheet,
  GetAttendanceSummaryRequest,
  AttendanceSummary,
  ModifyAttendanceRequest,
  ModifyAttendanceResponse,
  StudentAttendance,
  AttendanceStatus,
} from '../../features/attendance/types/attendance.types';

import { db, persistAttendance } from '../db';
import type { Student } from '../../features/students/types/student.types';

// ID generator
const generateAttendanceID = (): string => {
  const ids = db.attendance.map(a => parseInt(a.attendanceID.split('-')[2] || '0'));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return `ATT-2026-${String(maxId + 1).padStart(5, '0')}`;
};

// Simulate parent notification (Log only)
const simulateParentNotification = (student: Student, date: string, status: AttendanceStatus): string => {
  const notificationID = `NOT-${Date.now()}`;

  // Console log to simulate notification
  console.log(`
🔔 PARENT NOTIFICATION SENT (Mock Simulation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Notification ID: ${notificationID}
👨‍👩‍👧 Parent: ${student.primaryParent?.name || 'N/A'}
📱 Mobile: ${student.primaryParent?.mobileNumber || 'N/A'}
📧 Email: ${student.primaryParent?.email || 'N/A'}

👤 Student: ${student.name} (${student.studentID})
📅 Date: ${date}
⚠️  Status: ${status}
📚 Class: ${student.classID}

Message: Your child ${student.name} was marked ${status.toUpperCase()} on ${date}.
${status === 'Absent' ? 'Please contact the school if this is unexpected.' : ''}

✅ Sent via: SMS, Email, Push Notification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

  return notificationID;
};

// Mark individual attendance
export const handleMarkAttendance = async (request: MarkAttendanceRequest): Promise<MarkAttendanceResponse> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Validate student exists
  const student = db.students.find(s => s.studentID === request.studentID);
  if (!student) {
    throw new Error(`Student ${request.studentID} not found`);
  }

  // Check if attendance already exists for this date
  const existingIndex = db.attendance.findIndex(
    a => a.studentID === request.studentID && a.classID === request.classID && a.date === request.date
  );

  if (existingIndex !== -1) {
    throw new Error(`Attendance already marked for ${student.name} on ${request.date}`);
  }

  // Create attendance record
  const attendance: Attendance = {
    attendanceID: generateAttendanceID(),
    studentID: request.studentID,
    classID: request.classID,
    date: request.date,
    status: request.status,
    markedBy: 'user-002', // Current user (teacher)
    markedDate: new Date().toISOString(),
    remarks: request.remarks,
    isModified: false,
  };

  db.attendance.push(attendance);
  persistAttendance();

  // Send notification if absent or late
  const notifications: string[] = [];
  if (request.status === 'Absent' || request.status === 'Late') {
    const notificationID = simulateParentNotification(student, request.date, request.status);
    notifications.push(notificationID);
  }

  return {
    success: true,
    attendanceID: attendance.attendanceID,
    message: `Attendance marked for ${student.name}`,
    notifications: notifications.length > 0 ? notifications : undefined,
  };
};

// Bulk mark attendance for entire class
export const handleBulkMarkAttendance = async (request: BulkMarkAttendanceRequest): Promise<BulkMarkAttendanceResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  let marked = 0;
  const errors: Array<{ studentID: string; error: string }> = [];

  for (const item of request.attendances) {
    try {
      // Check if already exists
      const existing = db.attendance.find(
        a => a.studentID === item.studentID && a.classID === request.classID && a.date === request.date
      );

      if (existing) {
        // If it exists, update it instead of erroring in bulk mode?
        // Spec says "Mark All Present" often used as default. 
        // Logic: If already marked, skip or update. Let's skip to be safe as per previous logic.
        errors.push({ studentID: item.studentID, error: 'Already marked' });
        continue;
      }

      const student = db.students.find(s => s.studentID === item.studentID);
      if (!student) {
        errors.push({ studentID: item.studentID, error: 'Student not found' });
        continue;
      }

      // Create record
      const attendance: Attendance = {
        attendanceID: generateAttendanceID(),
        studentID: item.studentID,
        classID: request.classID,
        date: request.date,
        status: item.status,
        markedBy: request.markedBy,
        markedDate: new Date().toISOString(),
        remarks: item.remarks,
        isModified: false,
      };

      db.attendance.push(attendance);
      marked++;

      // Send notification if absent or late
      if (item.status === 'Absent' || item.status === 'Late') {
        simulateParentNotification(student, request.date, item.status);
      }
    } catch (err) {
      errors.push({ studentID: item.studentID, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }

  if (marked > 0) {
    persistAttendance();
  }

  return {
    success: errors.length === 0,
    marked,
    failed: errors.length,
    errors: errors.length > 0 ? errors : undefined,
    message: `Marked ${marked} students, ${errors.length} failed`,
  };
};

// Get attendance records
export const handleGetAttendance = async (query: AttendanceQuery): Promise<AttendanceQueryResponse> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  let filtered = [...db.attendance];

  // Apply filters
  if (query.studentID) {
    filtered = filtered.filter(a => a.studentID === query.studentID);
  }

  if (query.classID) {
    filtered = filtered.filter(a => a.classID === query.classID);
  }

  if (query.startDate) {
    filtered = filtered.filter(a => a.date >= query.startDate!);
  }

  if (query.endDate) {
    filtered = filtered.filter(a => a.date <= query.endDate!);
  }

  if (query.status) {
    filtered = filtered.filter(a => a.status === query.status);
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Pagination
  const page = query.page || 1;
  const limit = query.limit || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    attendances: filtered.slice(startIndex, endIndex),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
};

// Get class attendance sheet for specific date
export const handleGetClassAttendanceSheet = async (request: GetClassAttendanceSheetRequest): Promise<ClassAttendanceSheet> => {
  await new Promise(resolve => setTimeout(resolve, 250));

  // Get all students in class
  // Note: classID is strict match. Students have classID like "CL-...", request is strict.
  const classStudents = db.students.filter(s => s.classID === request.classID);

  if (classStudents.length === 0) {
    throw new Error(`No students found in class ${request.classID}`);
  }

  // Get attendance for this date
  const dateAttendances = db.attendance.filter(
    a => a.classID === request.classID && a.date === request.date
  );

  // Build student attendance list
  const studentAttendances: StudentAttendance[] = classStudents.map(student => {
    const attendance = dateAttendances.find(a => a.studentID === student.studentID);

    return {
      studentID: student.studentID,
      name: student.name,
      rollNumber: student.rollNumber,
      status: attendance?.status || 'Present', // Default to Present if not marked
      profilePhoto: student.profilePhoto,
      remarks: attendance?.remarks,
    };
  });

  // Calculate counts
  const presentCount = studentAttendances.filter(s => s.status === 'Present').length;
  const absentCount = studentAttendances.filter(s => s.status === 'Absent').length;
  const lateCount = studentAttendances.filter(s => s.status === 'Late').length;
  const excusedCount = studentAttendances.filter(s => s.status === 'Excused').length;

  const totalStudents = classStudents.length;
  const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const isMarked = dateAttendances.length > 0;
  const firstRecord = dateAttendances[0];

  // Find class detail
  const classObj = db.classes.find(c => c.classID === request.classID);
  const className = classObj
    ? (classObj.className || `Class ${classObj.grade}-${classObj.section}`)
    : request.classID;

  return {
    classID: request.classID,
    className,
    date: request.date,
    totalStudents,
    presentCount,
    absentCount,
    lateCount,
    excusedCount,
    attendancePercentage,
    students: studentAttendances.sort((a, b) => a.rollNumber - b.rollNumber),
    isMarked,
    markedBy: isMarked ? firstRecord?.markedBy : undefined,
    markedDate: isMarked ? firstRecord?.markedDate : undefined,
  };
};

// Get attendance summary for student
export const handleGetAttendanceSummary = async (request: GetAttendanceSummaryRequest): Promise<AttendanceSummary> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!request.studentID) {
    throw new Error('Student ID is required');
  }

  // Get attendance records for date range
  const records = db.attendance.filter(
    a =>
      a.studentID === request.studentID &&
      a.date >= request.startDate &&
      a.date <= request.endDate
  );

  // Calculate counts
  const presentDays = records.filter(r => r.status === 'Present').length;
  const absentDays = records.filter(r => r.status === 'Absent').length;
  const lateDays = records.filter(r => r.status === 'Late').length;
  const excusedDays = records.filter(r => r.status === 'Excused').length;
  const holidayDays = records.filter(r => r.status === 'Holiday').length;

  const totalDays = records.length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return {
    studentID: request.studentID,
    startDate: request.startDate,
    endDate: request.endDate,
    totalDays,
    presentDays,
    absentDays,
    lateDays,
    excusedDays,
    holidayDays,
    attendancePercentage,
    records: records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
};

// Modify attendance (with 24hr rule check)
export const handleModifyAttendance = async (request: ModifyAttendanceRequest): Promise<ModifyAttendanceResponse> => {
  await new Promise(resolve => setTimeout(resolve, 250));

  const attendance = db.attendance.find(a => a.attendanceID === request.attendanceID);

  if (!attendance) {
    throw new Error('Attendance record not found');
  }

  // Check if modification is within 24 hours
  const markedTime = new Date(attendance.markedDate).getTime();
  const now = Date.now();
  const hoursDiff = (now - markedTime) / (1000 * 60 * 60);

  const requiresApproval = hoursDiff > 24;

  if (!requiresApproval) {
    // Direct update allowed
    attendance.status = request.status;
    attendance.remarks = request.remarks;
    attendance.isModified = true;
    attendance.modifiedBy = request.modifiedBy;
    attendance.modifiedDate = new Date().toISOString();

    persistAttendance();

    return {
      success: true,
      requiresApproval: false,
      message: 'Attendance updated successfully',
    };
  } else {
    // Requires admin approval
    attendance.requiresApproval = true;
    persistAttendance();

    console.log(`
⚠️  ATTENDANCE CORRECTION REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Attendance ID: ${attendance.attendanceID}
📅 Original Date: ${attendance.date}
⏰ Marked: ${hoursDiff.toFixed(1)} hours ago
👤 Requested by: ${request.modifiedBy}
🔄 Change: ${attendance.status} → ${request.status}
💬 Remarks: ${request.remarks || 'None'}

✋ Requires Admin Approval (>24hrs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

    return {
      success: true,
      requiresApproval: true,
      message: 'Correction request submitted for admin approval',
    };
  }
};

export const attendanceHandlers = {
  handleMarkAttendance,
  handleBulkMarkAttendance,
  handleGetAttendance,
  handleGetClassAttendanceSheet,
  handleGetAttendanceSummary,
  handleModifyAttendance,
};
