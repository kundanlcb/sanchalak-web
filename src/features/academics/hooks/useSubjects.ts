/**
 * Subjects Hook — TanStack Query powered
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { type Subject, type CreateSubjectRequest } from '../types';

export const useSubjects = () => {
  const queryClient = useQueryClient();

  const { data: subjects = [], isLoading, error: queryError, refetch } = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await apiClient.get<Subject[]>('/api/academic/subjects');
      return response.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  // --- Mutation: Create subject (optimistic) ---
  const createMutation = useMutation({
    mutationKey: ['subjects', 'create'],
    mutationFn: async (data: CreateSubjectRequest) => {
      const response = await apiClient.post<Subject>('/api/academic/subjects', data);
      return response.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['subjects'] });
      const previous = queryClient.getQueryData<Subject[]>(['subjects']);
      const temp = { id: `temp-${Date.now()}`, ...data } as Subject;
      queryClient.setQueryData<Subject[]>(['subjects'], (old) => [
        ...(old ?? []),
        temp,
      ]);
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['subjects'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
  });

  return {
    subjects,
    isLoading: isLoading || createMutation.isPending,
    error: queryError?.message ?? createMutation.error?.message ?? null,
    createSubject: createMutation.mutateAsync,
    refetch,
  };
};
