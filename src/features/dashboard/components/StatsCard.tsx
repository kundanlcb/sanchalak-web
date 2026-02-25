import React from 'react';
import { type LucideIcon, TrendingUp } from 'lucide-react';
import { Skeleton } from '../../../components/common/Skeleton';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: 'purple' | 'blue' | 'orange' | 'green';
  loading?: boolean;
}

const colorStyles = {
  purple: {
    border: 'border-t-purple-500',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconText: 'text-purple-600 dark:text-purple-400',
    trendText: 'text-purple-500 dark:text-purple-400',
    gradientFrom: 'from-purple-500',
  },
  blue: {
    border: 'border-t-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconText: 'text-blue-600 dark:text-blue-400',
    trendText: 'text-blue-500 dark:text-blue-400',
    gradientFrom: 'from-blue-500',
  },
  orange: {
    border: 'border-t-orange-500',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconText: 'text-orange-600 dark:text-orange-400',
    trendText: 'text-orange-500 dark:text-orange-400',
    gradientFrom: 'from-orange-500',
  },
  green: {
    border: 'border-t-emerald-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    trendText: 'text-emerald-500 dark:text-emerald-400',
    gradientFrom: 'from-emerald-500',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color, loading }) => {
  const styles = colorStyles[color];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 border-t-2 border-t-gray-200 dark:border-t-gray-600">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-11 w-11 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 border-t-[3px] ${styles.border} transition-all hover:shadow-md hover:-translate-y-0.5 duration-200`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold mt-1.5 text-gray-900 dark:text-white tabular-nums leading-tight">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${styles.trendText}`}>
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${styles.iconBg}`}>
          <Icon className={`w-5 h-5 ${styles.iconText}`} />
        </div>
      </div>
    </div>
  );
};
