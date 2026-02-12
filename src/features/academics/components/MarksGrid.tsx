import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type MarkEntry, type Subject } from '../types';
import { MarksGridRow } from './MarksGridRow';
import { Skeleton } from '../../../components/common/Skeleton';
import { useGridNavigation } from '../hooks/useGridNavigation';
import type { Student } from '../../students/types/student.types';

interface MarksGridProps {
  students: Student[];
  marks: MarkEntry[];
  subject?: Subject;
  examTermId: string;
  isLoading: boolean;
  onUpdateMark: (studentId: string, marksObtained: number) => Promise<void>;
  pendingUpdates: Set<string>;
}

export const MarksGrid: React.FC<MarksGridProps> = ({
  students,
  marks,
  subject,
  isLoading,
  onUpdateMark,
  pendingUpdates,
}) => {
  const { t } = useTranslation();
  const tableRef = useRef<HTMLTableElement>(null);
  useGridNavigation(tableRef);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!subject) {
    return <div className="text-gray-500">Please select a subject to enter marks.</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
      <table ref={tableRef} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-800 z-10 w-48 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Student
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Roll No
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
              {t('academics.marks.maxMarks')} ({subject.maxMarks})
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student) => {
            const studentMark = marks.find(m => m.studentId === student.studentID);
            const isUpdating = pendingUpdates.has(`${student.studentID}-${subject.id}`);
            
            return (
              <MarksGridRow
                key={student.studentID}
                student={student}
                marksObtained={studentMark?.marksObtained}
                maxMarks={subject.maxMarks}
                isUpdating={isUpdating}
                onUpdate={(val) => onUpdateMark(student.studentID, val)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
