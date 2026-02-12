import { useState, useCallback, useEffect } from 'react';
import { getStudents } from '../../students/services/studentService';
import type { Student } from '../../students/types/student.types';

export const useStudentsByClass = (classId: string, section: string) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    // If selecting specific class/section, ensure we have values (unless 'all')
    if (classId !== 'all' && !classId) {
        setStudents([]);
        return;
    }

    setIsLoading(true);
    try {
      const response = await getStudents({
        classID: classId === 'all' ? undefined : classId,
        section: section === 'all' ? undefined : section,
        limit: 100 // Fetch reasonably large batch for dropdown
      });
      
      const data = response.students || [];
      
      // Sort by roll number or name
      data.sort((a, b) => (a.rollNumber || '').toString().localeCompare((b.rollNumber || '').toString()));
      
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setStudents([]); 
    } finally {
      setIsLoading(false);
    }
  }, [classId, section]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, isLoading };
};
