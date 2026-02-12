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
    return <div className="text-gray-500 py-8 text-center bg-white rounded shadow">No fee structures defined yet.</div>;
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
        <div key={classId} className="bg-white rounded shadow text-sm overflow-hidden border border-gray-200">
          <div className="bg-gray-50 px-4 py-3 font-semibold border-b border-gray-200">
            Class ID: {classId}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Due Day</th>
                <th className="px-4 py-3 font-medium">Frequency</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const cat = categories.find(c => c.id === item.categoryId);
                return (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{cat?.name || item.categoryId}</td>
                    <td className="px-4 py-3 text-gray-700">₹ {item.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-600">{item.dueDateDay ? `${item.dueDateDay}th` : '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{cat?.frequency || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onEdit(item)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
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
