import { useState, useCallback, useEffect } from 'react';
import type { Teacher } from '../types';
import { schoolOpsApi } from '../services/api';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await schoolOpsApi.getTeachers();
      setTeachers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTeacher = async (data: Partial<Teacher>) => {
    setLoading(true);
    try {
      const newTeacher = await schoolOpsApi.createTeacher(data);
      setTeachers(prev => [...prev, newTeacher]);
      return newTeacher;
    } catch (err: any) {
      setError(err.message || 'Failed to add teacher');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeacher = async (id: string, data: Partial<Teacher>) => {
    setLoading(true);
    try {
      const updated = await schoolOpsApi.updateTeacher(id, data);
      setTeachers(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update teacher');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTeacher = async (id: string) => {
    setLoading(true);
    try {
        await schoolOpsApi.deleteTeacher(id);
        setTeachers(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
        setError(err.message || 'Failed to delete teacher');
        throw err;
    } finally {
        setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    addTeacher,
    updateTeacher,
    removeTeacher
  };
};
