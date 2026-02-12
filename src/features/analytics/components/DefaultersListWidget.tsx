import React from 'react';
import type { FeeDefaulter } from '../types';
import { formatCurrency } from '../../finance/utils/feeUtils';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DefaultersListWidgetProps {
  defaulters: FeeDefaulter[];
}

export const DefaultersListWidget: React.FC<DefaultersListWidgetProps> = ({ defaulters }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden h-full transition-colors">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Top Fee Defaulters</h3>
        <Link to="/admin/finance/fees" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">View All</Link>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {defaulters.map((student) => (
          <div key={student.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{student.studentName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{student.studentId} • {student.grade}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(student.amountDue)}</p>
              <p className="text-xs text-red-500 dark:text-red-400">{student.daysOverdue} days overdue</p>
            </div>
          </div>
        ))}
      </div>
      {defaulters.length === 0 && (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          No defaulters found. Good job!
        </div>
      )}
    </div>
  );
};
