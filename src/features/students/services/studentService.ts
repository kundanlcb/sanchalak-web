/**
 * Student Service
 * API client functions for student CRUD operations
 */

import { studentApi } from '../../../api/instances';
import type {
  StudentListQuery,
  StudentListResponse,
  GetStudentResponse,
  CreateStudentRequest,
  CreateStudentResponse,
  UpdateStudentRequest,
  UpdateStudentResponse,
  DeleteStudentResponse,
  BulkImportStudentRequest,
  BulkImportStudentResponse,
} from '../types/student.types';

// Helper to handle casting since generated client might not match Page<T> perfectly
// or to keep existing service logic intact
import type { AxiosResponse } from 'axios';

/**
 * Get list of students with filters and pagination
 */
export async function getStudents(query: StudentListQuery): Promise<StudentListResponse> {
  // Pass query params via options.params
  // Casting to 'any' because the generated client expects Array<StudentResponse> but backend returns Page<StudentResponse>
  const response = await studentApi.getAllStudents({ params: query }) as AxiosResponse<any>;

  // Handle Spring Page response
  if (response.data.content && Array.isArray(response.data.content)) {
    return {
      success: true,
      students: response.data.content,
      total: response.data.totalElements,
      page: response.data.number + 1, // Convert 0-based backend page to 1-based frontend
      limit: response.data.size,
      totalPages: response.data.totalPages,
    };
  }

  // Fallback for legacy raw list (just in case)
  if (Array.isArray(response.data)) {
    const students = response.data;
    const limit = query.limit || 50;
    const total = students.length;
    return {
      success: true,
      students: students,
      total: total,
      page: query.page || 1,
      limit: limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  return response.data;
}

/**
 * Get single student by ID
 */
export async function getStudent(studentID: string): Promise<GetStudentResponse> {
  // Casting to any because we need to handle wrapped response if present
  // Fix: Wrap id in object
  const response = await studentApi.getStudentById({ id: Number(studentID) }) as AxiosResponse<any>;
  // Handle direct StudentResponse or wrapped GetStudentResponse
  const student = response.data.student || response.data;
  return {
    success: true,
    student: student,
  };
}

/**
 * Create new student
 */
export async function createStudent(
  request: CreateStudentRequest
): Promise<CreateStudentResponse> {
  // Cast request to any to avoid strict type mismatch if generated types differ slightly
  // Fix: Wrap studentRequest in object
  const response = await studentApi.createStudent({ studentRequest: request as any }) as AxiosResponse<any>;
  const student = response.data;
  return {
    success: true,
    studentID: student.studentID || String(student.id),
    admissionNumber: student.admissionNumber || '',
    message: 'Student created successfully',
  };
}

/**
 * Update existing student
 */
export async function updateStudent(
  request: UpdateStudentRequest
): Promise<UpdateStudentResponse> {
  const id = Number(request.studentID || (request as any).id);
  // Fix: Wrap id and studentRequest in object
  const response = await studentApi.updateStudent({ id: id, studentRequest: request as any }) as AxiosResponse<any>;
  return {
    success: true,
    student: response.data,
    message: 'Student updated successfully',
  };
}

/**
 * Delete student (soft delete)
 */
export async function deleteStudent(studentID: string): Promise<DeleteStudentResponse> {
  // Fix: Wrap id in object
  await studentApi.deleteStudent({ id: Number(studentID) });
  return {
    success: true,
    message: 'Student deleted successfully'
  };
}

/**
 * Bulk import students from CSV/Excel
 */
export async function bulkImportStudents(
  request: BulkImportStudentRequest
): Promise<BulkImportStudentResponse> {
  if (!request.file) {
    throw new Error('No file provided');
  }

  // Fix: Wrap file in object
  const response = await studentApi.bulkImportStudents({ file: request.file });

  return {
    success: true,
    message: response.data
  };
}

/**
 * Search students by name (with debounce in component)
 */
export async function searchStudents(
  searchTerm: string,
  limit = 10
): Promise<StudentListResponse> {
  return getStudents({
    search: searchTerm,
    limit,
    page: 1,
  });
}
