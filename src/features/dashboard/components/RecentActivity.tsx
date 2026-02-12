import React from 'react';
import { Clock, UserPlus, IndianRupee, FileText } from 'lucide-react';
import { Skeleton } from '../../../components/common/Skeleton';

const ACTIVITIES = [
  { id: 1, text: "New Admission: Rahul Kumar (Class 5)", time: "2 hrs ago", type: "student" },
  { id: 2, text: "Fees Collected: ₹24,500 from Class 10", time: "4 hrs ago", type: "finance" },
  { id: 3, text: "Teacher Added: Priya Sharma (Mathematics)", time: "1 day ago", type: "hr" },
  { id: 4, text: "Notice Published: Annual Sports Day", time: "1 day ago", type: "admin" },
  { id: 5, text: "Attendance Marked: Class 8-A", time: "2 days ago", type: "academic" },
];

interface RecentActivityProps {
  loading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ loading }) => {
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
      <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-8">
        {ACTIVITIES.map((activity) => (
          <div key={activity.id} className="relative pl-6">
            <span className="absolute -left-2.5 top-1 bg-white dark:bg-gray-800 p-1 rounded-full border border-gray-100 dark:border-gray-700">
               {getIcon(activity.type)}
            </span>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.text}</p>
            <time className="text-xs text-gray-500 block mt-1">{activity.time}</time>
          </div>
        ))}
      </div>
    </div>
  );
};
