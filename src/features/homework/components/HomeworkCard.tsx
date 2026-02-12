import React from 'react';
import { type Homework } from '../types';
import { Calendar, Paperclip, Trash2 } from 'lucide-react';
import { Button } from '../../../components/common/Button';

interface HomeworkCardProps {
  homework: Homework;
  onDelete: (id: string) => void;
  isTeacher?: boolean;
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({ homework, onDelete, isTeacher = true }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-full mb-2">
             {homework.subjectId.replace('sub-', '').toUpperCase()}
          </span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{homework.title}</h3>
        </div>
        {isTeacher && (
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={() => onDelete(homework.id)}>
                <Trash2 className="w-4 h-4" />
            </Button>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {homework.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Due: {new Date(homework.dueDate).toLocaleDateString()}
        </div>
        {homework.attachments && homework.attachments.length > 0 && (
            <div className="flex items-center">
                <Paperclip className="w-3.5 h-3.5 mr-1" />
                {homework.attachments.length} attachments
            </div>
        )}
      </div>

       {homework.attachments && homework.attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {homework.attachments.map(att => (
                <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="block text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 truncate max-w-[150px]">
                    {att.name}
                </a>
            ))}
          </div>
       )}
    </div>
  );
};
