import type { Teacher, Class, Routine } from '../types';
// Assuming a base client is configured, but if not we use axios directly or importing from src/services/api/client
// Checking previous turn, src/services/api/client.ts exists. I should try to use it.
import client from '../../../services/api/client';

// Base URL removed as paths vary across controllers
// const BASE_URL = '/api/school-ops';

export const schoolOpsApi = {
  // Teachers
  getTeachers: async (): Promise<Teacher[]> => {
    const response = await client.get<Teacher[]>('/api/academics/teachers');
    return response.data;
  },

  getTeacherById: async (id: number): Promise<Teacher> => {
    const response = await client.get<Teacher>(`/api/academics/teachers/${id}`);
    return response.data;
  },

  createTeacher: async (data: any): Promise<Teacher> => {
    // Map specializedSubjects to specializationIds for backend compatibility
    const { specializedSubjects, ...rest } = data;
    const payload = {
      ...rest,
      phone: data.phone || '', // Ensure phone is always present (required by backend)
      specializationIds: specializedSubjects?.map((id: string) => parseInt(id, 10)).filter((id: number) => !isNaN(id)) || []
    };
    const response = await client.post<Teacher>('/api/academics/teachers', payload);
    return response.data;
  },

  updateTeacher: async (id: number, data: any): Promise<Teacher> => {
    // Map specializedSubjects to specializationIds for backend compatibility
    const { specializedSubjects, ...rest } = data;
    const payload = {
      ...rest,
      phone: data.phone || '', // Ensure phone is always present (required by backend)
      specializationIds: specializedSubjects?.map((id: string) => parseInt(id, 10)).filter((id: number) => !isNaN(id)) || []
    };
    const response = await client.put<Teacher>(`/api/academics/teachers/${id}`, payload);
    return response.data;
  },

  deleteTeacher: async (id: number): Promise<void> => {
    await client.delete(`/api/academics/teachers/${id}`);
  },

  // Classes
  getClasses: async (): Promise<Class[]> => {
    const response = await client.get<Class[]>('/api/academic/classes');
    return response.data;
  },

  createClass: async (data: Partial<Class>): Promise<Class> => {
    // Note: Backend might not support POST /api/academic/classes directly.
    const response = await client.post<Class>('/api/academic/classes', data);
    return response.data;
  },

  updateClass: async (id: number, data: Partial<Class>): Promise<Class> => {
    const response = await client.put<Class>(`/api/academic/classes/${id}`, data);
    return response.data;
  },

  deleteClass: async (id: number): Promise<void> => {
    // Assuming backend supports delete
    await client.delete(`/api/academic/classes/${id}`);
  },

  // Subjects (from Academics module)
  getSubjects: async (): Promise<any[]> => {
    // Reusing the academics endpoint
    const response = await client.get('/api/academic/subjects');
    return response.data;
  },

  createSubject: async (data: any): Promise<any> => {
    const response = await client.post('/api/academic/subjects', data);
    return response.data;
  },

  updateSubject: async (id: number, data: any): Promise<any> => {
    const response = await client.put(`/api/academic/subjects/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id: number): Promise<void> => {
    await client.delete(`/api/academic/subjects/${id}`);
  },

  // Routines
  getRoutines: async (filters?: { classId?: number; teacherId?: number }): Promise<Routine[]> => {
    const params = new URLSearchParams();
    if (filters?.classId) params.append('classId', String(filters.classId));
    if (filters?.teacherId) params.append('teacherId', String(filters.teacherId));

    const response = await client.get<Routine[]>(`/api/academic/routine?${params.toString()}`);
    return response.data;
  },

  createRoutine: async (data: Routine): Promise<Routine> => {
    const response = await client.post<Routine>('/api/academics/routine', data);
    return response.data;
  },

  deleteRoutine: async (id: number): Promise<void> => {
    await client.delete(`/api/academics/routine/${id}`);
  },

  // Permissions
  getSchoolPermissions: async (): Promise<any[]> => {
    const response = await client.get('/api/school/permissions');
    return response.data;
  },

  updateRolePermissions: async (roleName: string, featureCodes: string[]): Promise<void> => {
    await client.post(`/api/school/permissions/${roleName}`, featureCodes);
  }
};
