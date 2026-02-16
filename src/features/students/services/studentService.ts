/**
 * Student Service
 * API client functions for student CRUD operations
 */

import apiClient from '../../../services/api/client';
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

/**
 * Get list of students with filters and pagination
 */
export async function getStudents(query: StudentListQuery): Promise<StudentListResponse> {
  // Use 'any' generic because backend returns Page<StudentResponse> structure
  const response = await apiClient.get<any>('/academics/students', {
    params: query,
  });

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
  const response = await apiClient.get<GetStudentResponse>(`/academics/students/${studentID}`);
  return response.data;
}

/**
 * Create new student
 */
export async function createStudent(
  request: CreateStudentRequest
): Promise<CreateStudentResponse> {
  const response = await apiClient.post<CreateStudentResponse>('/academics/students', request);
  return response.data;
}

/**
 * Update existing student
 */
export async function updateStudent(
  request: UpdateStudentRequest
): Promise<UpdateStudentResponse> {
  const response = await apiClient.put<UpdateStudentResponse>(
    `/academics/students/${request.studentID}`,
    request
  );
  return response.data;
}

/**
 * Delete student (soft delete)
 */
export async function deleteStudent(studentID: string): Promise<DeleteStudentResponse> {
  const response = await apiClient.delete<DeleteStudentResponse>(`/academics/students/${studentID}`);
  return response.data;
}

/**
 * Bulk import students from CSV/Excel
 */
export async function bulkImportStudents(
  request: BulkImportStudentRequest
): Promise<BulkImportStudentResponse> {
  const formData = new FormData();
  formData.append('file', request.file);

  const response = await apiClient.post<string>(
    '/academics/students/bulk-import',
    formData
  );

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
