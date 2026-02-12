import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { type Subject, type CreateSubjectRequest } from '../types';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Subject[]>('/api/academics/subjects');
      setSubjects(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subjects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSubject = async (data: CreateSubjectRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<Subject>('/api/academics/subjects', data);
      setSubjects((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create subject';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    isLoading,
    error,
    createSubject,
    refetch: fetchSubjects,
  };
};
