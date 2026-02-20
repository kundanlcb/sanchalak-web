/**
 * Homework Hook — TanStack Query powered
 * Queries and mutations for homework CRUD with caching and offline support.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { type Homework, type CreateHomeworkRequest } from '../types';
import { useAuth } from '../../auth/services/authContext';

export const useHomework = (filters: { classId?: string, subjectId?: string, date?: string } = {}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { classId, subjectId, date } = filters;
  const queryKey = ['homework', classId ?? 'all', subjectId ?? 'all', date ?? 'any'];

  // --- Query: Fetch homework list ---
  const {
    data: homeworkList = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Homework[]>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (classId) params.append('classId', classId);
      if (subjectId) params.append('subjectId', subjectId);
      if (date) params.append('dueDate', date);

      const url = `/api/homework${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<Homework[]>(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // --- Mutation: Create homework (optimistic) ---
  const createMutation = useMutation({
    mutationKey: ['homework', 'create'],
    mutationFn: async (data: any) => {
      const payload: CreateHomeworkRequest = {
        classId: parseInt(String(data.classId), 10),
        subjectId: parseInt(String(data.subjectId), 10),
        teacherId: parseInt(user?.userID || '1', 10),
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        attachments: data.attachments || [],
      };
      const response = await apiClient.post<Homework>('/api/homework', payload);
      return response.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Homework[]>(queryKey);
      // Optimistic: append a temp item
      const tempItem = {
        id: `temp-${Date.now()}`,
        classId: data.classId,
        subjectId: data.subjectId,
        title: data.title,
        description: data.description ?? '',
        dueDate: data.dueDate,
        attachments: data.attachments || [],
        createdAt: new Date().toISOString(),
      } as unknown as Homework;
      queryClient.setQueryData<Homework[]>(queryKey, (old) => [
        ...(old ?? []),
        tempItem,
      ]);
      return { previous };
    },
    onError: (_err, _data, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
    },
  });

  // --- Mutation: Delete homework (optimistic) ---
  const deleteMutation = useMutation({
    mutationKey: ['homework', 'delete'],
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/homework/${id}`);
      return id;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Homework[]>(queryKey);
      queryClient.setQueryData<Homework[]>(queryKey, (old) =>
        old?.filter((h) => h.id !== id) ?? [],
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
    },
  });

  return {
    homeworkList,
    isLoading: isLoading || createMutation.isPending || deleteMutation.isPending,
    error: queryError?.message ?? createMutation.error?.message ?? deleteMutation.error?.message ?? null,
    createHomework: createMutation.mutateAsync,
    deleteHomework: deleteMutation.mutateAsync,
    refetch,
  };
};
