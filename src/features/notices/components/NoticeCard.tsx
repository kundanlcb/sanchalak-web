import React from 'react';
import { Clock, Users, ChevronRight } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { Notice } from '../types/notice.types';

interface NoticeCardProps {
  notice: Notice;
  onClick: (notice: Notice) => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onClick }) => {
  const isUrgent = notice.priority === 'Urgent';

  const priorityColors = {
    Low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={() => onClick(notice)}
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm border transition-all cursor-pointer hover:shadow-md",
        isUrgent ? "border-red-200 dark:border-red-900/50" : "border-gray-200 dark:border-gray-700",
        !notice.isRead && "border-l-4 border-l-blue-500" // Unread indicator
      )}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={cn(
              "px-2.5 py-0.5 text-xs font-semibold rounded-full",
              priorityColors[notice.priority]
            )}>
              {notice.priority}
            </span>
            <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(notice.publishDate)}
            </span>
            {notice.audience !== 'All' && (
              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded">
                <Users className="w-3 h-3 mr-1" />
                {notice.audience}
              </span>
            )}
          </div>
          
          <h3 className={cn(
            "text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1",
            notice.isRead ? "text-gray-700 dark:text-gray-200" : "text-gray-900 dark:text-white"
          )}>
            {notice.title}
          </h3>
          
          <div 
            className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </div>

        <div className="self-center">
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {isUrgent && (
        <div className="absolute -top-1 -right-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}
    </div>
  );
};
