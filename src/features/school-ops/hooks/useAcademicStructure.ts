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
    staleTime: 30 * 60 * 1000, // 30 min — rarely changes
  });

  // --- Query: Subjects ---
  const subjectsQuery = useQuery<Subject[]>({
    queryKey: ['academic', 'subjects'],
    queryFn: schoolOpsApi.getSubjects,
    staleTime: 30 * 60 * 1000,
  });

  // --- Mutation: Add class ---
  const addClassMutation = useMutation({
    mutationFn: (data: Partial<Class>) => schoolOpsApi.createClass(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['academic', 'classes'] }),
  });

  // --- Mutation: Add subject ---
  const addSubjectMutation = useMutation({
    mutationFn: (data: Partial<Subject>) => schoolOpsApi.createSubject(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['academic', 'subjects'] }),
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
  };
};
