/**
 * Routine Hook — TanStack Query powered
 * Queries and mutations for timetable routines with caching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Routine } from '../types';
import { schoolOpsApi } from '../services/api';

export const useRoutine = (initialFilters?: { classId?: string; teacherId?: string }) => {
  const queryClient = useQueryClient();
  const queryKey = ['routines', initialFilters ?? {}];

  const {
    data: routines = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Routine[]>({
    queryKey,
    queryFn: () => schoolOpsApi.getRoutines(initialFilters),
    staleTime: 30 * 60 * 1000,
    enabled: !!initialFilters?.classId,
  });

  // --- Mutation: Add routine (optimistic) ---
  const addMutation = useMutation({
    mutationKey: ['routines', 'add'],
    mutationFn: (entry: Routine) => schoolOpsApi.createRoutine(entry),
    onMutate: async (entry) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Routine[]>(queryKey);
      const temp = { ...entry, id: entry.id || `temp-${Date.now()}` } as Routine;
      queryClient.setQueryData<Routine[]>(queryKey, (old) => [
        ...(old ?? []),
        temp,
      ]);
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(queryKey, ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['routines'] }),
  });

  // --- Mutation: Remove routine (optimistic) ---
  const removeMutation = useMutation({
    mutationKey: ['routines', 'remove'],
    mutationFn: (id: string) => schoolOpsApi.deleteRoutine(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Routine[]>(queryKey);
      queryClient.setQueryData<Routine[]>(queryKey, (old) =>
        old?.filter((r) => r.id !== id) ?? [],
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => queryClient.setQueryData(queryKey, ctx?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['routines'] }),
  });

  return {
    routines,
    loading: isLoading || addMutation.isPending || removeMutation.isPending,
    error: queryError?.message ?? addMutation.error?.message ?? removeMutation.error?.message ?? null,
    fetchRoutines: refetch,
    addRoutine: addMutation.mutateAsync,
    removeRoutine: removeMutation.mutateAsync,
  };
};
