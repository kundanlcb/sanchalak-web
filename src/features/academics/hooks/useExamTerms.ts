/**
 * Exam Terms Hook — TanStack Query powered
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicApi } from '../../../api/instances';
import type { ExamTermRequest } from '../../../api/models';
import { type ExamTerm, type CreateExamTermRequest } from '../types';

export const useExamTerms = () => {
  const queryClient = useQueryClient();

  const { data: examTerms = [], isLoading, error: queryError, refetch } = useQuery<ExamTerm[]>({
    queryKey: ['examTerms'],
    queryFn: async () => {
      const response = await academicApi.getAllTerms();
      // Map API response to local ExamTerm type
      return response.data.map((term) => ({
        id: String(term.id),
        name: term.name || '',
        startDate: term.startDate || '',
        endDate: term.endDate || '',
        isActive: term.isActive || false,
        academicYear: '', // Not returned by API
        classes: [],     // Not returned by API
      }));
    },
    staleTime: 10 * 60 * 1000,
  });

  // --- Mutation: Create exam term (optimistic) ---
  const createMutation = useMutation({
    mutationKey: ['examTerms', 'create'],
    mutationFn: async (data: CreateExamTermRequest) => {
      // Map local request to API request (omit classes)
      const request: ExamTermRequest = {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
      };
      const response = await academicApi.createTerm({ examTermRequest: request });

      const term = response.data;
      return {
        id: String(term.id),
        name: term.name || '',
        startDate: term.startDate || '',
        endDate: term.endDate || '',
        isActive: term.isActive || false,
        academicYear: '',
        classes: [],
      };
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

  // --- Mutation: Update exam term ---
  const updateMutation = useMutation({
    mutationKey: ['examTerms', 'update'],
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateExamTermRequest> }) => {
      const request: ExamTermRequest = {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
      };
      const response = await academicApi.updateTerm(Number(id), { examTermRequest: request });
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['examTerms'] });
      const previous = queryClient.getQueryData<ExamTerm[]>(['examTerms']);

      queryClient.setQueryData<ExamTerm[]>(['examTerms'], (old) => {
        return (old ?? []).map((term) => {
          if (term.id === id) {
            return { ...term, ...data };
          }
          return term;
        });
      });
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['examTerms'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['examTerms'] }),
  });

  return {
    examTerms,
    isLoading: isLoading || createMutation.isPending || updateMutation.isPending,
    error: queryError?.message ?? createMutation.error?.message ?? updateMutation.error?.message ?? null,
    createExamTerm: createMutation.mutateAsync,
    updateExamTerm: updateMutation.mutateAsync,
    refetch,
  };
};
