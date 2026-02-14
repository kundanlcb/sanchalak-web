/**
 * Subjects Hook — TanStack Query powered
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { type Subject, type CreateSubjectRequest } from '../types';

export const useSubjects = () => {
  const queryClient = useQueryClient();

  const { data: subjects = [], isLoading, error: queryError, refetch } = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await axios.get<Subject[]>('/api/academics/subjects');
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // subjects rarely change
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateSubjectRequest) => {
      const response = await axios.post<Subject>('/api/academics/subjects', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
  });

  return {
    subjects,
    isLoading: isLoading || createMutation.isPending,
    error: queryError?.message ?? createMutation.error?.message ?? null,
    createSubject: createMutation.mutateAsync,
    refetch,
  };
};
