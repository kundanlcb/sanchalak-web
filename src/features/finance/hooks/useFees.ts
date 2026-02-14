/**
 * Fees Hook — TanStack Query powered
 * Queries and mutations for fee categories and structures with caching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { FeeCategory, FeeStructure } from '../types';
import type { FeeCategoryFormData, FeeStructureFormData } from '../types/schema';

export const useFees = () => {
  const queryClient = useQueryClient();

  // --- Query: Fee categories ---
  const categoriesQuery = useQuery<FeeCategory[]>({
    queryKey: ['fees', 'categories'],
    queryFn: async () => {
      const res = await axios.get('/api/finance/fees/categories');
      return res.data;
    },
    staleTime: 10 * 60 * 1000, // 10 min — fee categories rarely change
  });

  // --- Query: Fee structures ---
  const structuresQuery = useQuery<FeeStructure[]>({
    queryKey: ['fees', 'structures'],
    queryFn: async () => {
      const res = await axios.get('/api/finance/fees/structures');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // --- Mutations ---
  const createCategoryMutation = useMutation({
    mutationFn: async (data: FeeCategoryFormData) => {
      const res = await axios.post('/api/finance/fees/categories', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fees', 'categories'] }),
  });

  const createStructureMutation = useMutation({
    mutationFn: async (data: FeeStructureFormData) => {
      const res = await axios.post('/api/finance/fees/structures', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fees', 'structures'] }),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FeeCategoryFormData> }) => {
      const res = await axios.put(`/api/finance/fees/categories/${id}`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fees', 'categories'] }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/finance/fees/categories/${id}`);
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<FeeStructureFormData> }) => {
      const res = await axios.put(`/api/finance/fees/structures/${id}`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fees', 'structures'] }),
  });

  const deleteStructureMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/finance/fees/structures/${id}`);
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
