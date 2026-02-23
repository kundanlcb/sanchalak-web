import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { FeeStructure, FeeCategory } from '../types';

interface FeeStructureListProps {
  structures: FeeStructure[];
  categories: FeeCategory[];
  onEdit: (structure: FeeStructure) => void;
  onDelete: (id: string) => void;
}

export const FeeStructureList: React.FC<FeeStructureListProps> = ({
  structures,
  categories,
  onEdit,
  onDelete
}) => {
  if (structures.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400 py-8 text-center bg-white dark:bg-gray-800 rounded shadow border border-transparent dark:border-gray-700 transition-colors">No fee structures defined yet.</div>;
  }

  // Group by Class
  const grouped = structures.reduce((acc, curr) => {
    const key = curr.classId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, FeeStructure[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([classId, items]) => (
        <div key={classId} className="bg-white dark:bg-gray-800 rounded-lg shadow text-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 font-semibold border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
            Class ID: {classId}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px] divide-y divide-gray-100 dark:divide-gray-700">
              <thead className="bg-gray-50/50 dark:bg-gray-900/30">
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Due Day</th>
                  <th className="px-4 py-3 font-medium">Frequency</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {items.map(item => {
                  const cat = categories.find(c => c.id === item.categoryId);
                  return (
                    <tr key={item.id} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{cat?.name || item.categoryId}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹ {item.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.dueDateDay ? `${item.dueDateDay}th` : '-'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{cat?.frequency || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onEdit(item)}
                            className="text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(item.id)}
                            className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
