/**
 * Attendance Service
 * API wrapper for attendance operations
 */

import apiClient from '../../../services/api/client';
import type {
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
} from '../types/attendance.types';

/**
 * Mark attendance for a single student
 */
export const markAttendance = async (request: MarkAttendanceRequest): Promise<MarkAttendanceResponse> => {
  const response = await apiClient.post<MarkAttendanceResponse>('/api/attendance', request);
  return response.data;
};

/**
 * Mark attendance for entire class (bulk operation)
 */
export const bulkMarkAttendance = async (request: BulkMarkAttendanceRequest): Promise<BulkMarkAttendanceResponse> => {
  const response = await apiClient.post<BulkMarkAttendanceResponse>('/api/attendance/bulk', request);
  return response.data;
};

/**
 * Get attendance records with filters
 */
export const getAttendance = async (query: AttendanceQuery): Promise<AttendanceQueryResponse> => {
  const response = await apiClient.get<any>('/api/attendance', { params: query });
  const data = response.data;

  // Map direct list from backend to AttendanceQueryResponse
  if (Array.isArray(data)) {
    return {
      attendances: data,
      total: data.length,
      page: 1,
      limit: data.length,
      totalPages: 1,
    };
  }

  return data;
};

/**
 * Get class attendance sheet for a specific date
 */
export const getClassAttendanceSheet = async (request: GetClassAttendanceSheetRequest): Promise<ClassAttendanceSheet> => {
  const response = await apiClient.get<ClassAttendanceSheet>(
    `/api/attendance/sheet/${request.classId}`,
    { params: { date: request.date } }
  );
  return response.data;
};

/**
 * Get attendance summary for a student or class
 */
export const getAttendanceSummary = async (request: GetAttendanceSummaryRequest): Promise<AttendanceSummary> => {
  const response = await apiClient.get<AttendanceSummary>('/api/attendance/summary', { params: request });
  return response.data;
};

/**
 * Modify existing attendance record
 */
export const modifyAttendance = async (request: ModifyAttendanceRequest): Promise<ModifyAttendanceResponse> => {
  const response = await apiClient.put<ModifyAttendanceResponse>(
    `/api/attendance/${request.id}`,
    request
  );
  return response.data;
};

/**
 * Get today's attendance sheet (convenience function)
 */
export const getTodayAttendanceSheet = async (classId: number | string): Promise<ClassAttendanceSheet> => {
  const today = new Date().toISOString().split('T')[0];
  return getClassAttendanceSheet({ classId, date: today });
};

/**
 * Get student attendance for current month (convenience function)
 */
export const getCurrentMonthAttendance = async (studentId: number): Promise<AttendanceSummary> => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endDate = now.toISOString().split('T')[0];

  return getAttendanceSummary({ studentId, startDate, endDate });
};
