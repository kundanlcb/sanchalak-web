/**
 * Student Service
 * API client functions for student CRUD operations
 */

import apiClient from '../../../services/api/client';
import API_CONFIG from '../../../services/api/config';
import {
  handleGetStudents,
  handleGetStudent,
  handleCreateStudent,
  handleUpdateStudent,
  handleDeleteStudent,
  handleBulkImportStudents,
} from '../../../mocks/handlers/studentHandlers';
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
  if (API_CONFIG.USE_MOCK_API) {
    return handleGetStudents(query);
  }
  
  const response = await apiClient.get<StudentListResponse>('/students', {
    params: query,
  });
  return response.data;
}

/**
 * Get single student by ID
 */
export async function getStudent(studentID: string): Promise<GetStudentResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleGetStudent({ studentID });
  }
  
  const response = await apiClient.get<GetStudentResponse>(`/students/${studentID}`);
  return response.data;
}

/**
 * Create new student
 */
export async function createStudent(
  request: CreateStudentRequest
): Promise<CreateStudentResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleCreateStudent(request);
  }
  
  const response = await apiClient.post<CreateStudentResponse>('/students', request);
  return response.data;
}

/**
 * Update existing student
 */
export async function updateStudent(
  request: UpdateStudentRequest
): Promise<UpdateStudentResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleUpdateStudent(request);
  }
  
  const response = await apiClient.put<UpdateStudentResponse>(
    `/students/${request.studentID}`,
    request
  );
  return response.data;
}

/**
 * Delete student (soft delete)
 */
export async function deleteStudent(studentID: string): Promise<DeleteStudentResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleDeleteStudent({ studentID });
  }
  
  const response = await apiClient.delete<DeleteStudentResponse>(`/students/${studentID}`);
  return response.data;
}

/**
 * Bulk import students from CSV/Excel
 */
export async function bulkImportStudents(
  request: BulkImportStudentRequest
): Promise<BulkImportStudentResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleBulkImportStudents(request);
  }
  
  const response = await apiClient.post<BulkImportStudentResponse>(
    '/students/bulk-import',
    request
  );
  return response.data;
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
