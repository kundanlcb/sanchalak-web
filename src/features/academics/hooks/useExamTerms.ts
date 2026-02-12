import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { type ExamTerm, type CreateExamTermRequest } from '../types';

export const useExamTerms = () => {
  const [examTerms, setExamTerms] = useState<ExamTerm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExamTerms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<ExamTerm[]>('/api/academics/exam-terms');
      setExamTerms(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exam terms');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createExamTerm = async (data: CreateExamTermRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<ExamTerm>('/api/academics/exam-terms', data);
      setExamTerms((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create exam term';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExamTerms();
  }, [fetchExamTerms]);

  return {
    examTerms,
    isLoading,
    error,
    createExamTerm,
    refetch: fetchExamTerms,
  };
};
