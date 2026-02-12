import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { type MarkEntry, type UpdateMarkRequest } from '../types';

interface UseMarksFilters {
  examTermId?: string;
  subjectId?: string;
  classId?: string; // Additional filter usually needed
  section?: string;
  studentId?: string; // Add support for student-specific marks
}

export const useMarks = (filters: UseMarksFilters) => {
  const [marks, setMarks] = useState<MarkEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track pending updates for loading indicators per cell
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  const fetchMarks = useCallback(async () => {
    // Determine if we have enough info to fetch
    // Case 1: Class Grid View -> needs examTermId + subjectId
    // Case 2: Student Report View -> needs examTermId + studentId
    const isGridView = filters.examTermId && filters.subjectId;
    const isReportView = filters.examTermId && filters.studentId;

    if (!isGridView && !isReportView) {
        // Not enough info/filters to fetch meaningful data yet
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.examTermId) params.append('examTermId', filters.examTermId);
      if (filters.subjectId) params.append('subjectId', filters.subjectId);
      if (filters.classId) params.append('classId', filters.classId);
      if (filters.section) params.append('section', filters.section);
      if (filters.studentId) params.append('studentId', filters.studentId);

      const response = await axios.get<MarkEntry[]>(`/api/academics/marks?${params.toString()}`);
      setMarks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch marks');
    } finally {
      setIsLoading(false);
    }
  }, [filters.examTermId, filters.subjectId, filters.classId, filters.section, filters.studentId]);

  const updateMark = async (data: UpdateMarkRequest) => {
    const markKey = `${data.studentId}-${data.subjectId}`; // Unique key key for UI tracking
    
    // 1. Optimistic Update
    const previousMarks = [...marks];
    setMarks((prev) => {
      const existingIndex = prev.findIndex(
        (m) => m.studentId === data.studentId && 
               m.subjectId === data.subjectId && 
               m.examTermId === data.examTermId
      );

      if (existingIndex >= 0) {
        const newMarks = [...prev];
        newMarks[existingIndex] = { ...newMarks[existingIndex], marksObtained: data.marksObtained, lastUpdated: new Date().toISOString() };
        return newMarks;
      } else {
        // Create new entry placeholder
        return [...prev, {
            id: 'temp',
            studentId: data.studentId,
            examTermId: data.examTermId,
            subjectId: data.subjectId,
            marksObtained: data.marksObtained,
            lastUpdated: new Date().toISOString()
        }];
      }
    });

    setPendingUpdates((prev) => new Set(prev).add(markKey));

    try {
      // 2. API Call
      await axios.post('/api/academics/marks', data);
      // Success - no action needed as we already updated state
    } catch (err) {
      // 3. Rollback on Error
      console.error("Failed to update mark", err);
      setMarks(previousMarks); // Revert
      // Optional: Show toast error
    } finally {
      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(markKey);
        return next;
      });
    }
  };

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  return {
    marks,
    isLoading,
    error,
    updateMark,
    pendingUpdates,
    refetch: fetchMarks
  };
};
