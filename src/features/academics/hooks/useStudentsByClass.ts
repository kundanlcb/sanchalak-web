/**
 * Students By Class Hook — TanStack Query powered
 */

import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../../students/services/studentService';
import type { Student } from '../../students/types/student.types';

export const useStudentsByClass = (classId: string, section: string) => {
  const enabled = classId === 'all' || !!classId;

  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ['students', 'byClass', classId, section],
    queryFn: async () => {
      const response = await getStudents({
        classID: classId === 'all' ? undefined : classId,
        section: section === 'all' ? undefined : section,
        limit: 100,
      });
      const data = response.students || [];
      data.sort((a, b) =>
        (a.rollNumber || '').toString().localeCompare((b.rollNumber || '').toString()),
      );
      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  return { students, isLoading };
};
