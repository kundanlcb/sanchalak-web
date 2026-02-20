/**
 * Academic Structure Hook — TanStack Query powered
 * Fetches classes and subjects with caching and offline support.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Class, Subject } from '../types';
import { schoolOpsApi } from '../services/api';

export const useAcademicStructure = () => {
  const queryClient = useQueryClient();

  // --- Query: Classes ---
  const classesQuery = useQuery<Class[]>({
    queryKey: ['academic', 'classes'],
    queryFn: schoolOpsApi.getClasses,
    staleTime: 30 * 60 * 1000,
  });

  // --- Query: Subjects ---
  const subjectsQuery = useQuery<Subject[]>({
    queryKey: ['academic', 'subjects'],
    queryFn: schoolOpsApi.getSubjects,
    staleTime: 30 * 60 * 1000,
  });

  // --- Mutation: Add class (optimistic) ---
  const addClassMutation = useMutation({
    mutationKey: ['academic', 'class', 'add'],
    mutationFn: (data: Partial<Class>) => schoolOpsApi.createClass(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['academic', 'classes'] });
      const previous = queryClient.getQueryData<Class[]>(['academic', 'classes']);
      const temp = { id: Date.now(), ...data } as Class;
      queryClient.setQueryData<Class[]>(['academic', 'classes'], (old) => [
        ...(old ?? []),
        temp,
      ]);
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['academic', 'classes'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['academic', 'classes'] }),
  });

  // --- Mutation: Add subject (optimistic) ---
  const addSubjectMutation = useMutation({
    mutationKey: ['academic', 'subject', 'add'],
    mutationFn: (data: Partial<Subject>) => schoolOpsApi.createSubject(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['academic', 'subjects'] });
      const previous = queryClient.getQueryData<Subject[]>(['academic', 'subjects']);
      const temp = { id: Date.now(), ...data } as Subject;
      queryClient.setQueryData<Subject[]>(['academic', 'subjects'], (old) => [
        ...(old ?? []),
        temp,
      ]);
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['academic', 'subjects'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['academic', 'subjects'] }),
  });

  // --- Mutation: Update class ---
  const updateClassMutation = useMutation({
    mutationKey: ['academic', 'class', 'update'],
    mutationFn: ({ id, data }: { id: number; data: Partial<Class> }) => schoolOpsApi.updateClass(id, data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['academic', 'classes'] }),
  });

  // --- Mutation: Delete class ---
  const deleteClassMutation = useMutation({
    mutationKey: ['academic', 'class', 'delete'],
    mutationFn: (id: number) => schoolOpsApi.deleteClass(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['academic', 'classes'] });
      const previous = queryClient.getQueryData<Class[]>(['academic', 'classes']);
      queryClient.setQueryData<Class[]>(['academic', 'classes'], (old) =>
        (old ?? []).filter((c) => c.id !== id)
      );
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['academic', 'classes'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['academic', 'classes'] }),
  });

  // --- Mutation: Update subject ---
  const updateSubjectMutation = useMutation({
    mutationKey: ['academic', 'subject', 'update'],
    mutationFn: ({ id, data }: { id: number; data: Partial<Subject> }) => schoolOpsApi.updateSubject(id, data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['academic', 'subjects'] }),
  });

  // --- Mutation: Delete subject ---
  const deleteSubjectMutation = useMutation({
    mutationKey: ['academic', 'subject', 'delete'],
    mutationFn: (id: number) => schoolOpsApi.deleteSubject(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['academic', 'subjects'] });
      const previous = queryClient.getQueryData<Subject[]>(['academic', 'subjects']);
      queryClient.setQueryData<Subject[]>(['academic', 'subjects'], (old) =>
        (old ?? []).filter((s) => s.id !== id)
      );
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['academic', 'subjects'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['academic', 'subjects'] }),
  });

  return {
    classes: classesQuery.data ?? [],
    subjects: subjectsQuery.data ?? [],
    loading: classesQuery.isLoading || subjectsQuery.isLoading,
    error: classesQuery.error?.message ?? subjectsQuery.error?.message ?? null,
    refresh: () => {
      classesQuery.refetch();
      subjectsQuery.refetch();
    },
    addClass: addClassMutation.mutateAsync,
    addSubject: addSubjectMutation.mutateAsync,
    updateClass: (id: number, data: Partial<Class>) => updateClassMutation.mutateAsync({ id, data }),
    deleteClass: deleteClassMutation.mutateAsync,
    updateSubject: (id: number, data: Partial<Subject>) => updateSubjectMutation.mutateAsync({ id, data }),
    deleteSubject: deleteSubjectMutation.mutateAsync,
  };
};
