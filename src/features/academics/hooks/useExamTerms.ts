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

  const createMutation = useMutation({
    mutationFn: async (data: CreateExamTermRequest) => {
      const response = await axios.post<ExamTerm>('/api/academics/exam-terms', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['examTerms'] }),
  });

  return {
    examTerms,
    isLoading: isLoading || createMutation.isPending,
    error: queryError?.message ?? createMutation.error?.message ?? null,
    createExamTerm: createMutation.mutateAsync,
    refetch,
  };
};
