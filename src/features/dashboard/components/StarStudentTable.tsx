import React from 'react';
import { Trophy } from 'lucide-react';
import { Skeleton } from '../../../components/common/Skeleton';

const TOP_STUDENTS = [
  { id: 'STU-2026-001', name: 'Aarav Gupta', marks: 485, percentage: 97, section: 'A' },
  { id: 'STU-2026-042', name: 'Zara Khan', marks: 482, percentage: 96.4, section: 'B' },
  { id: 'STU-2026-103', name: 'Rohan Mehta', marks: 478, percentage: 95.6, section: 'A' },
  { id: 'STU-2026-015', name: 'Ishita Sharma', marks: 475, percentage: 95, section: 'C' },
  { id: 'STU-2026-089', name: 'Vihaan Singh', marks: 472, percentage: 94.4, section: 'B' },
];

interface StarStudentTableProps {
  loading?: boolean;
}

export const StarStudentTable: React.FC<StarStudentTableProps> = ({ loading }) => {
  if (loading) {
    return <Skeleton className="w-full h-[300px] rounded-xl" />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Star Students</h3>
            <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th className="px-6 py-3">Rank</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3 text-right">Marks</th>
                        <th className="px-6 py-3 text-right">%</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {TOP_STUDENTS.map((student, index) => (
                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                #{index + 1}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                {student.name}
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                {student.id}
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                {student.marks}
                            </td>
                            <td className="px-6 py-4 text-right text-green-600 font-medium">
                                {student.percentage}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
