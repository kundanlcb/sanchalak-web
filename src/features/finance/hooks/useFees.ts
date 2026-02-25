/**
 * Fees Hook — TanStack Query powered
 * Queries and mutations for fee categories and structures with caching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import type { FeeCategory, FeeStructure } from '../types';
import type { FeeCategoryFormData, FeeStructureFormData } from '../types/schema';

export const useFees = () => {
  const queryClient = useQueryClient();

  // --- Query: Fee categories ---
  const categoriesQuery = useQuery<FeeCategory[]>({
    queryKey: ['fees', 'categories'],
    queryFn: async () => {
      const res = await apiClient.get<FeeCategory[]>('/api/finance/categories');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // --- Query: Fee structures ---
  const structuresQuery = useQuery<FeeStructure[]>({
    queryKey: ['fees', 'structures'],
    queryFn: async () => {
      const res = await apiClient.get<any[]>('/api/finance/structures');
      // Flatten backend structures (nested items) into frontend FeeStructure format
      const flattened: FeeStructure[] = [];
      res.data.forEach(s => {
        if (s.items && s.items.length > 0) {
          s.items.forEach((item: any) => {
            flattened.push({
              id: `${s.id}-${item.id || Math.random()}`,
              academicYear: s.academicYear,
              classId: 'N/A', // Assignments are handled separately in backend
              categoryId: item.categoryId.toString(),
              amount: item.amount,
              dueDateDay: 10, // Placeholder
              name: s.name,
              frequency: s.frequency
            } as any);
          });
        }
      });
      return flattened;
    },
    staleTime: 10 * 60 * 1000,
  });

  // --- Mutations (all with mutationKey for persistence) ---

  const createCategoryMutation = useMutation({
    mutationKey: ['fees', 'category', 'create'],
    mutationFn: async (data: FeeCategoryFormData) => {
      const res = await apiClient.post<FeeCategory>('/api/finance/categories', data);
      return res.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['fees', 'categories'] });
      const previous = queryClient.getQueryData<FeeCategory[]>(['fees', 'categories']);
      const temp = { id: `temp-${Date.now()}`, ...data } as unknown as FeeCategory;
      queryClient.setQueryData<FeeCategory[]>(['fees', 'categories'], (old) => [
        ...(old ?? []),
        temp,
      ]);
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['fees', 'categories'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['fees', 'categories'] }),
  });

  const createStructureMutation = useMutation({
    mutationKey: ['fees', 'structure', 'create'],
    mutationFn: async (data: FeeStructureFormData) => {
      // Map flat form data to backend FeeStructureDto
      const payload = {
        name: data.name,
        academicYear: data.academicYear,
        frequency: data.frequency,
        lateFeeAmount: data.lateFeeAmount,
        gracePeriodDays: data.gracePeriodDays,
        items: [
          {
            categoryId: data.categoryId,
            amount: data.amount
          }
        ]
      };
      const res = await apiClient.post<any>('/api/finance/structures', payload);
      const structure = res.data;

      // Assign to class if classId is provided
      if (data.classId && structure.id) {
        await apiClient.post(`/api/finance/structures/${structure.id}/assign?classId=${data.classId}`);
      }
      return structure;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['fees', 'structures'] });
      const previous = queryClient.getQueryData<FeeStructure[]>(['fees', 'structures']);
      const temp = { id: `temp-${Date.now()}`, ...data } as unknown as FeeStructure;
      queryClient.setQueryData<FeeStructure[]>(['fees', 'structures'], (old) => [
        ...(old ?? []),
        temp,
      ]);
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['fees', 'structures'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['fees', 'structures'] }),
  });

  const updateCategoryMutation = useMutation({
    mutationKey: ['fees', 'category', 'update'],
    mutationFn: async ({ id, data }: { id: string; data: Partial<FeeCategoryFormData> }) => {
      const res = await apiClient.put<FeeCategory>(`/api/finance/categories/${id}`, data);
      return res.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['fees', 'categories'] });
      const previous = queryClient.getQueryData<FeeCategory[]>(['fees', 'categories']);
      queryClient.setQueryData<FeeCategory[]>(['fees', 'categories'], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ...data } : c)) ?? [],
      );
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['fees', 'categories'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['fees', 'categories'] }),
  });

  const deleteCategoryMutation = useMutation({
    mutationKey: ['fees', 'category', 'delete'],
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/finance/categories/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['fees', 'categories'] });
      const prev = queryClient.getQueryData<FeeCategory[]>(['fees', 'categories']);
      queryClient.setQueryData<FeeCategory[]>(['fees', 'categories'], (old) =>
        old?.filter((c) => c.id !== id) ?? [],
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => queryClient.setQueryData(['fees', 'categories'], ctx?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['fees', 'categories'] }),
  });

  const updateStructureMutation = useMutation({
    mutationKey: ['fees', 'structure', 'update'],
    mutationFn: async ({ id, data }: { id: string; data: Partial<FeeStructureFormData> }) => {
      // Note: id here might be a composite id from flattening (e.g. "5-101"). 
      // We need the real structure id (the part before the hyphen).
      const realId = id.toString().split('-')[0];
      const payload = {
        name: data.name,
        academicYear: data.academicYear,
        frequency: data.frequency,
        lateFeeAmount: data.lateFeeAmount,
        gracePeriodDays: data.gracePeriodDays,
        items: data.categoryId ? [
          {
            categoryId: data.categoryId,
            amount: data.amount
          }
        ] : undefined
      };
      const res = await apiClient.put<any>(`/api/finance/structures/${realId}`, payload);
      return res.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['fees', 'structures'] });
      const previous = queryClient.getQueryData<FeeStructure[]>(['fees', 'structures']);
      queryClient.setQueryData<FeeStructure[]>(['fees', 'structures'], (old) =>
        old?.map((s) => (s.id === id ? { ...s, ...data } : s)) ?? [],
      );
      return { previous };
    },
    onError: (_e, _d, ctx) => queryClient.setQueryData(['fees', 'structures'], ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['fees', 'structures'] }),
  });

  const deleteStructureMutation = useMutation({
    mutationKey: ['fees', 'structure', 'delete'],
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/finance/structures/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['fees', 'structures'] });
      const prev = queryClient.getQueryData<FeeStructure[]>(['fees', 'structures']);
      queryClient.setQueryData<FeeStructure[]>(['fees', 'structures'], (old) =>
        old?.filter((s) => s.id !== id) ?? [],
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => queryClient.setQueryData(['fees', 'structures'], ctx?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['fees', 'structures'] }),
  });

  const isPending = [createCategoryMutation, createStructureMutation, updateCategoryMutation,
    deleteCategoryMutation, updateStructureMutation, deleteStructureMutation]
    .some(m => m.isPending);

  return {
    categories: categoriesQuery.data ?? [],
    structures: structuresQuery.data ?? [],
    isLoading: categoriesQuery.isLoading || structuresQuery.isLoading || isPending,
    error: categoriesQuery.error?.message ?? structuresQuery.error?.message ?? null,
    fetchCategories: categoriesQuery.refetch,
    fetchStructures: structuresQuery.refetch,
    createCategory: createCategoryMutation.mutateAsync,
    createStructure: createStructureMutation.mutateAsync,
    updateCategory: (id: string, data: Partial<FeeCategoryFormData>) =>
      updateCategoryMutation.mutateAsync({ id, data }),
    deleteCategory: deleteCategoryMutation.mutateAsync,
    updateStructure: (id: string, data: Partial<FeeStructureFormData>) =>
      updateStructureMutation.mutateAsync({ id, data }),
    deleteStructure: deleteStructureMutation.mutateAsync,
  };
};
