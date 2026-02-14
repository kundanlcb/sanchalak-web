/**
 * Homework Hook — TanStack Query powered
 * Queries and mutations for homework CRUD with caching and offline support.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { type Homework, type CreateHomeworkRequest } from '../types';

export const useHomework = (initialClassId?: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['homework', initialClassId ?? 'all'];

  // --- Query: Fetch homework list ---
  const {
    data: homeworkList = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Homework[]>({
    queryKey,
    queryFn: async () => {
      const url = initialClassId
        ? `/api/homework?classId=${initialClassId}`
        : '/api/homework';
      const response = await axios.get<Homework[]>(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // --- Mutation: Create homework (optimistic) ---
  const createMutation = useMutation({
    mutationKey: ['homework', 'create'],
    mutationFn: async (data: CreateHomeworkRequest & { files?: File[] }) => {
      const payload: CreateHomeworkRequest = {
        classId: data.classId,
        subjectId: data.subjectId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        attachments: data.attachments || [],
      };
      const response = await axios.post<Homework>('/api/homework', payload);
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
      await axios.delete(`/api/homework/${id}`);
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
