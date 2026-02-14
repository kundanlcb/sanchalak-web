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

  // --- Mutation: Create homework ---
  const createMutation = useMutation({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
    },
  });

  // --- Mutation: Delete homework ---
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/homework/${id}`);
      return id;
    },
    onMutate: async (id: string) => {
      // Optimistic: remove from list immediately
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
