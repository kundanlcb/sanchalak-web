import { useState, useCallback } from 'react';
import axios from 'axios';
import type { FeeCategory, FeeStructure } from '../types';
import type { FeeCategoryFormData, FeeStructureFormData } from '../types/schema';

export const useFees = () => {
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/finance/fees/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStructures = useCallback(async (classId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = classId 
        ? `/api/finance/fees/structures?classId=${classId}` 
        : '/api/finance/fees/structures';
      const res = await axios.get(url);
      setStructures(res.data);
    } catch (err) {
      setError('Failed to fetch structures');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = async (data: FeeCategoryFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/finance/fees/categories', data);
      setCategories(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError('Failed to create category');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createStructure = async (data: FeeStructureFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/finance/fees/structures', data);
      setStructures(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError('Failed to create structure');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, data: Partial<FeeCategoryFormData>) => {
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/finance/fees/categories/${id}`, data);
      setCategories(prev => prev.map(c => c.id === id ? res.data : c));
      return res.data;
    } catch (err) {
      throw new Error('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/finance/fees/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      throw new Error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStructure = async (id: string, data: Partial<FeeStructureFormData>) => {
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/finance/fees/structures/${id}`, data);
      setStructures(prev => prev.map(s => s.id === id ? res.data : s));
      return res.data;
    } catch (err) {
      throw new Error('Failed to update structure');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStructure = async (id: string) => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/finance/fees/structures/${id}`);
      setStructures(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw new Error('Failed to delete structure');
    } finally {
      setIsLoading(false);
    }
  };


  return {
    categories,
    structures,
    isLoading,
    error,
    fetchCategories,
    fetchStructures,
    createCategory,
    createStructure,
    updateCategory,
    deleteCategory,
    updateStructure,
    deleteStructure
  };
};
