/**
 * Exam Terms Hook — TanStack Query powered
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { type ExamTerm, type CreateExamTermRequest } from '../types';

export const useExamTerms = () => {
  const queryClient = useQueryClient();

  const { data: examTerms = [], isLoading, error: queryError, refetch } = useQuery<ExamTerm[]>({
    queryKey: ['examTerms'],
    queryFn: async () => {
      const response = await axios.get<ExamTerm[]>('/api/academics/exam-terms');
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // --- Mutation: Create exam term (optimistic) ---
  const createMutation = useMutation({
    mutationKey: ['examTerms', 'create'],
    mutationFn: async (data: CreateExamTermRequest) => {
      const response = await axios.post<ExamTerm>('/api/academics/exam-terms', data);
      return response.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['examTerms'] });
      const previous = queryClient.getQueryData<ExamTerm[]>(['examTerms']);
      const temp = { id: `temp-${Date.now()}`, ...data } as ExamTerm;
      queryClient.setQueryData<ExamTerm[]>(['examTerms'], (old) => [
        ...(old ?? []),
        temp,
      ]);
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['examTerms'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['examTerms'] }),
  });

  return {
    examTerms,
    isLoading: isLoading || createMutation.isPending,
    error: queryError?.message ?? createMutation.error?.message ?? null,
    createExamTerm: createMutation.mutateAsync,
    refetch,
  };
};
