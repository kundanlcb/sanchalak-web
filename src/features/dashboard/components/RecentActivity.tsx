import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Skeleton } from '../../../components/common/Skeleton';
import type { ActivityFeed } from '../types/dashboard.types';

interface RecentActivityProps {
  loading?: boolean;
  activities?: ActivityFeed[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ loading, activities = [] }) => {
  if (loading) {
    return <Skeleton className="w-full h-[300px] rounded-xl" />;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'ALERT': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'INFO': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
      {activities.length > 0 ? (
        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6">
              <span className="absolute -left-2.5 top-1 bg-white dark:bg-gray-800 p-1 rounded-full border border-gray-100 dark:border-gray-700">
                {getIcon(activity.type)}
              </span>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.message}</p>
              <time className="text-xs text-gray-500 block mt-1">{new Date(activity.timestamp).toLocaleString()}</time>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No recent activity</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[180px]">
            New events and updates will appear here as they happen.
          </p>
        </div>
      )}
    </div>
  );
};
