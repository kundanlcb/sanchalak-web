/**
 * Marks Hook — TanStack Query powered
 * Queries marks with filters and supports optimistic mark updates.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { type MarkEntry, type UpdateMarkRequest } from '../types';

interface UseMarksFilters {
  examTermId?: string;
  subjectId?: string;
  classId?: string;
  section?: string;
  studentId?: string;
}

export const useMarks = (filters: UseMarksFilters) => {
  const queryClient = useQueryClient();
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  const queryKey = ['marks', filters];

  // Only fetch when we have meaningful filters
  const isGridView = !!(filters.examTermId && filters.subjectId);
  const isReportView = !!(filters.examTermId && filters.studentId);
  const enabled = isGridView || isReportView;

  const { data: marks = [], isLoading, error: queryError, refetch } = useQuery<MarkEntry[]>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.examTermId) params.append('examTermId', filters.examTermId);
      if (filters.subjectId) params.append('subjectId', filters.subjectId);
      if (filters.classId) params.append('classId', filters.classId);
      if (filters.section) params.append('section', filters.section);
      if (filters.studentId) params.append('studentId', filters.studentId);
      const response = await apiClient.get<MarkEntry[]>(`/api/academic/marks?${params.toString()}`);
      return response.data;
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 min — marks change during entry
  });

  // --- Mutation: Update mark (with optimistic update) ---
  const updateMarkMutation = useMutation({
    mutationKey: ['marks', 'update'],
    mutationFn: async (data: UpdateMarkRequest) => {
      await apiClient.post('/api/academics/marks', data);
      return data;
    },
    onMutate: async (data) => {
      const markKey = `${data.studentId}-${data.subjectId}`;
      setPendingUpdates((prev) => new Set(prev).add(markKey));

      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<MarkEntry[]>(queryKey);

      queryClient.setQueryData<MarkEntry[]>(queryKey, (old = []) => {
        const existingIndex = old.findIndex(
          (m) => m.studentId === data.studentId &&
            m.subjectId === data.subjectId &&
            m.examTermId === data.examTermId,
        );
        if (existingIndex >= 0) {
          const updated = [...old];
          updated[existingIndex] = {
            ...updated[existingIndex],
            marksObtained: data.marksObtained,
            lastUpdated: new Date().toISOString(),
          };
          return updated;
        }
        return [...old, {
          id: 'temp',
          studentId: data.studentId,
          examTermId: data.examTermId,
          subjectId: data.subjectId,
          marksObtained: data.marksObtained,
          lastUpdated: new Date().toISOString(),
        }];
      });

      return { previous, markKey };
    },
    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: (_data, _err, _vars, context) => {
      if (context?.markKey) {
        setPendingUpdates((prev) => {
          const next = new Set(prev);
          next.delete(context.markKey);
          return next;
        });
      }
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    marks,
    isLoading,
    error: queryError?.message ?? updateMarkMutation.error?.message ?? null,
    updateMark: updateMarkMutation.mutateAsync,
    pendingUpdates,
    refetch,
  };
};
