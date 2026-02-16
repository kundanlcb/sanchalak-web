import React from 'react';
import { Clock, UserPlus, IndianRupee, FileText } from 'lucide-react';
import { Skeleton } from '../../../components/common/Skeleton';

interface Activity {
  id: number;
  text: string;
  time: string;
  type: string;
}

interface RecentActivityProps {
  loading?: boolean;
  activities?: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ loading, activities = [] }) => {
  if (loading) {
    return <Skeleton className="w-full h-[300px] rounded-xl" />;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'student': return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'finance': return <IndianRupee className="w-4 h-4 text-green-500" />;
      case 'admin': return <FileText className="w-4 h-4 text-orange-500" />;
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
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.text}</p>
              <time className="text-xs text-gray-500 block mt-1">{activity.time}</time>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center">No recent activity</p>
      )}
    </div>
  );
};
