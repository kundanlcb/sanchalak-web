import type { Teacher, Class, Routine } from '../types';
// Assuming a base client is configured, but if not we use axios directly or importing from src/services/api/client
// Checking previous turn, src/services/api/client.ts exists. I should try to use it.
import client from '../../../services/api/client';

const BASE_URL = '/school-ops';

export const schoolOpsApi = {
  // Teachers
  getTeachers: async (): Promise<Teacher[]> => {
    const response = await client.get<Teacher[]>(`${BASE_URL}/teachers`);
    return response.data;
  },

  getTeacherById: async (id: string): Promise<Teacher> => {
    const response = await client.get<Teacher>(`${BASE_URL}/teachers/${id}`);
    return response.data;
  },

  createTeacher: async (data: Partial<Teacher>): Promise<Teacher> => {
    const response = await client.post<Teacher>(`${BASE_URL}/teachers`, data);
    return response.data;
  },

  updateTeacher: async (id: string, data: Partial<Teacher>): Promise<Teacher> => {
    const response = await client.put<Teacher>(`${BASE_URL}/teachers/${id}`, data);
    return response.data;
  },

  deleteTeacher: async (id: string): Promise<void> => {
    await client.delete(`${BASE_URL}/teachers/${id}`);
  },

  // Classes
  getClasses: async (): Promise<Class[]> => {
    const response = await client.get<Class[]>('/academic/classes');
    return response.data;
  },

  createClass: async (data: Partial<Class>): Promise<Class> => {
    const response = await client.post<Class>(`${BASE_URL}/classes`, data);
    return response.data;
  },

  deleteClass: async (id: string): Promise<void> => {
    // Assuming backend supports delete
    await client.delete(`${BASE_URL}/classes/${id}`);
  },

  // Subjects (from Academics module)
  getSubjects: async (): Promise<any[]> => {
    // Reusing the academics endpoint
    const response = await client.get('/academic/subjects');
    return response.data;
  },

  createSubject: async (data: any): Promise<any> => {
    const response = await client.post('/academics/subjects', data);
    return response.data;
  },

  // Routines
  getRoutines: async (filters?: { classId?: string; teacherId?: string }): Promise<Routine[]> => {
    const params = new URLSearchParams();
    if (filters?.classId) params.append('classId', filters.classId);
    if (filters?.teacherId) params.append('teacherId', filters.teacherId);

    const response = await client.get<Routine[]>(`${BASE_URL}/routines?${params.toString()}`);
    return response.data;
  },

  createRoutine: async (data: Routine): Promise<Routine> => {
    const response = await client.post<Routine>(`${BASE_URL}/routines`, data);
    return response.data;
  },

  deleteRoutine: async (id: string): Promise<void> => {
    await client.delete(`${BASE_URL}/routines/${id}`);
  }
};
