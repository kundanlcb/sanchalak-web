import { useState, useCallback } from 'react';
import type { Routine } from '../types';
import { schoolOpsApi } from '../services/api';

export const useRoutine = (initialFilters?: { classId?: string; teacherId?: string }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = useCallback(async (filters = initialFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await schoolOpsApi.getRoutines(filters);
      setRoutines(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch routines');
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  const addRoutine = async (entry: Routine) => {
      setLoading(true);
      setError(null);
      try {
          const newEntry = await schoolOpsApi.createRoutine(entry);
          setRoutines(prev => [...prev, newEntry]);
          return newEntry;
      } catch (err: any) {
          // MSW returns 409 for conflicts, extract message
          const msg = err.response?.data?.message || err.message || 'Failed to create routine';
          setError(msg);
          throw new Error(msg);
      } finally {
          setLoading(false);
      }
  };

  const removeRoutine = async (id: string) => {
      setLoading(true);
      try {
          await schoolOpsApi.deleteRoutine(id);
          setRoutines(prev => prev.filter(r => r.id !== id));
      } catch (err: any) {
          setError(err.message || 'Failed to delete routine');
      } finally {
          setLoading(false);
      }
  };

  return {
    routines,
    loading,
    error,
    fetchRoutines,
    addRoutine,
    removeRoutine
  };
};
