import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { type Homework, type CreateHomeworkRequest } from '../types';

export const useHomework = (initialClassId?: string) => {
  const [exercises, setExercises] = useState<Homework[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomework = useCallback(async (classId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = classId ? `/api/homework?classId=${classId}` : '/api/homework';
      const response = await axios.get<Homework[]>(url);
      setExercises(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch homework');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createHomework = async (data: CreateHomeworkRequest & { files?: File[] }) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate File Upload Logic here if needed.
      // In real app, we upload files first -> get URLs -> submit payload.
      // For mock, likely just send "attachments" metadata in body or multipart.
      // Our handler likely expects JSON with 'attachments' array.
      
      const payload: CreateHomeworkRequest = {
        classId: data.classId,
        subjectId: data.subjectId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        attachments: data.attachments || []
        // We assume 'files' are processed into 'attachments' by the component
      };

      const response = await axios.post<Homework>('/api/homework', payload);
      setExercises((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create homework';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHomework = async (id: string) => {
    setIsLoading(true);
    try {
        await axios.delete(`/api/homework/${id}`);
        setExercises(prev => prev.filter(h => h.id !== id));
    } catch (err) {
        setError("Failed to delete homework");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework(initialClassId);
  }, [fetchHomework, initialClassId]);

  return {
    homeworkList: exercises,
    isLoading,
    error,
    createHomework,
    deleteHomework,
    refetch: fetchHomework
  };
};
