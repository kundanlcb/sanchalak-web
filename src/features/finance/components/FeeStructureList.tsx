import React from 'react';
import { Edit, Trash2, Plus, LayoutGrid } from 'lucide-react';
import type { FeeStructure, FeeCategory } from '../types';

interface FeeStructureListProps {
  structures: FeeStructure[];
  categories: FeeCategory[];
  onEdit: (structure: FeeStructure) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const FeeStructureList: React.FC<FeeStructureListProps> = ({
  structures, categories, onEdit, onDelete, onAdd
}) => {
  if (structures.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center py-20 px-8 text-center gap-5">
        <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <LayoutGrid className="h-8 w-8 text-blue-400 dark:text-blue-500" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-300">No fee structures yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Define fee structures to set up recurring charges per class.</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Fee Structure
        </button>
      </div>
    );
  }

  // Group by Class
  const grouped = structures.reduce((acc, curr) => {
    const key = curr.classId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, FeeStructure[]>);

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([classId, items]) => (
        <div key={classId} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-3 font-semibold border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
            Class ID: {classId}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px] divide-y divide-gray-50 dark:divide-gray-700">
              <thead className="bg-gray-50/50 dark:bg-gray-900/30">
                <tr className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Due Day</th>
                  <th className="px-5 py-3 font-semibold">Frequency</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {items.map(item => {
                  const cat = categories.find(c => c.id === item.categoryId);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{cat?.name || item.categoryId}</td>
                      <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 tabular-nums">₹{item.amount.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{item.dueDateDay ? `${item.dueDateDay}th` : '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{cat?.frequency || '—'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-gray-500 dark:hover:text-blue-400 transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-gray-500 dark:hover:text-red-400 transition-colors" title="Delete">
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

      {/* Add button – right-aligned below list */}
      <div className="flex justify-end">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Fee Structure
        </button>
      </div>
    </div>
  );
};
