/**
 * Teachers Hook — TanStack Query powered
 * Queries and mutations for teacher CRUD with caching and offline support.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Teacher } from '../types';
import { schoolOpsApi } from '../services/api';

export const useTeachers = () => {
  const queryClient = useQueryClient();

  // --- Query: Fetch teachers list ---
  const {
    data: teachers = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Teacher[]>({
    queryKey: ['teachers'],
    queryFn: schoolOpsApi.getTeachers,
    staleTime: 5 * 60 * 1000,
  });

  // --- Mutation: Add teacher (optimistic) ---
  const addMutation = useMutation({
    mutationKey: ['teachers', 'add'],
    mutationFn: (data: Partial<Teacher>) => schoolOpsApi.createTeacher(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['teachers'] });
      const previous = queryClient.getQueryData<Teacher[]>(['teachers']);
      const tempTeacher = {
        id: `temp-${Date.now()}`,
        ...data,
      } as Teacher;
      queryClient.setQueryData<Teacher[]>(['teachers'], (old) => [
        ...(old ?? []),
        tempTeacher,
      ]);
      return { previous };
    },
    onError: (_err, _data, context) => {
      queryClient.setQueryData(['teachers'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  // --- Mutation: Update teacher (optimistic) ---
  const updateMutation = useMutation({
    mutationKey: ['teachers', 'update'],
    mutationFn: ({ id, data }: { id: string; data: Partial<Teacher> }) =>
      schoolOpsApi.updateTeacher(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['teachers'] });
      const previous = queryClient.getQueryData<Teacher[]>(['teachers']);
      queryClient.setQueryData<Teacher[]>(['teachers'], (old) =>
        old?.map((t) => (t.id === id ? { ...t, ...data } : t)) ?? [],
      );
      return { previous };
    },
    onError: (_err, _data, context) => {
      queryClient.setQueryData(['teachers'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  // --- Mutation: Delete teacher (optimistic) ---
  const removeMutation = useMutation({
    mutationKey: ['teachers', 'remove'],
    mutationFn: (id: string) => schoolOpsApi.deleteTeacher(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['teachers'] });
      const previous = queryClient.getQueryData<Teacher[]>(['teachers']);
      queryClient.setQueryData<Teacher[]>(['teachers'], (old) =>
        old?.filter((t) => t.id !== id) ?? [],
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['teachers'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  // Keep compatible return interface
  const addTeacher = async (data: Partial<Teacher>) => addMutation.mutateAsync(data);
  const updateTeacher = async (id: string, data: Partial<Teacher>) =>
    updateMutation.mutateAsync({ id, data });
  const removeTeacher = async (id: string) => removeMutation.mutateAsync(id);

  const isPending = addMutation.isPending || updateMutation.isPending || removeMutation.isPending;

  return {
    teachers,
    loading: isLoading || isPending,
    error: queryError?.message ?? addMutation.error?.message ?? updateMutation.error?.message ?? removeMutation.error?.message ?? null,
    fetchTeachers: refetch,
    addTeacher,
    updateTeacher,
    removeTeacher,
  };
};
