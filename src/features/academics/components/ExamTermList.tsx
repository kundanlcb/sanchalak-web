import React from 'react';
import { type ExamTerm } from '../types';
import { Skeleton } from '../../../components/common/Skeleton';
import { CheckCircle, XCircle } from 'lucide-react';

interface ExamTermListProps {
  examTerms: ExamTerm[];
  isLoading: boolean;
}

export const ExamTermList: React.FC<ExamTermListProps> = ({ examTerms, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (examTerms.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">No exam terms found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {examTerms.map((term) => (
        <div
          key={term.id}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {term.name}
            </h3>
            {term.isActive ? (
                <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                </div>
            ) : (
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs font-medium bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                    <XCircle className="w-3 h-3 mr-1" />
                    Inactive
                </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>
                <span className="font-medium">Academic Year:</span> {term.academicYear}
            </p>
            <p>
                <span className="font-medium">Date:</span> {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
            </p>
            <p>
                <span className="font-medium">Classes:</span> {term.classes.length} classes
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
