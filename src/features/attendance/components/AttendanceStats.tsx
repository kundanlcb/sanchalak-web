/**
 * AttendanceStats Component
 * Displays attendance percentage, present/absent counts with visual stats
 */

import React from 'react';
import { Users, UserCheck, UserX, Clock, FileText } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface AttendanceStatsProps {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendancePercentage: number;
  className?: string;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  totalStudents,
  presentCount,
  absentCount,
  lateCount,
  excusedCount,
  attendancePercentage,
  className,
}) => {
  const stats = [
    {
      label: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      textColor: 'text-gray-600 dark:text-gray-400',
    },
    {
      label: 'Present',
      value: presentCount,
      icon: UserCheck,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Absent',
      value: absentCount,
      icon: UserX,
      color: 'from-red-400 to-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Late',
      value: lateCount,
      icon: Clock,
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Excused',
      value: excusedCount,
      icon: FileText,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <div className={cn('space-y-4 sm:space-y-6', className)}>
      {/* Main Attendance Percentage Card */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800/30 shadow-soft overflow-hidden">
        <div className="relative z-10 text-center">
          <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
            Today's Attendance
          </p>
          <div className="relative inline-flex items-center justify-center">
            {/* Desktop Circle */}
            <svg className="hidden sm:block w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-blue-200 dark:text-blue-900/50"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - attendancePercentage / 100)}`}
                className={cn(
                  'transition-all duration-1000',
                  attendancePercentage >= 90 && 'text-green-500',
                  attendancePercentage >= 75 && attendancePercentage < 90 && 'text-yellow-500',
                  attendancePercentage < 75 && 'text-red-500'
                )}
                strokeLinecap="round"
              />
            </svg>
            {/* Mobile Circle - Smaller */}
            <svg className="sm:hidden w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-blue-200 dark:text-blue-900/50"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - attendancePercentage / 100)}`}
                className={cn(
                  'transition-all duration-1000',
                  attendancePercentage >= 90 && 'text-green-500',
                  attendancePercentage >= 75 && attendancePercentage < 90 && 'text-yellow-500',
                  attendancePercentage < 75 && 'text-red-500'
                )}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <p className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {attendancePercentage}%
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {presentCount}/{totalStudents}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm',
                attendancePercentage >= 90 && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                attendancePercentage >= 75 && attendancePercentage < 90 && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                attendancePercentage < 75 && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              )}
            >
              {attendancePercentage >= 90 && '✓ Excellent'}
              {attendancePercentage >= 75 && attendancePercentage < 90 && '⚠ Good'}
              {attendancePercentage < 75 && '✗ Needs Attention'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-soft hover:shadow-soft-lg transition-all duration-200 animate-in',
              stat.bgColor
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={cn('w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br', stat.color, 'flex items-center justify-center shadow-md flex-shrink-0')}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate">
                  {stat.label}
                </p>
                <p className={cn('text-xl sm:text-2xl font-bold', stat.textColor)}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-soft">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status Breakdown
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {totalStudents} students
          </p>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {presentCount > 0 && (
            <div
              className="bg-green-500 transition-all duration-500"
              style={{ width: `${(presentCount / totalStudents) * 100}%` }}
              title={`Present: ${presentCount}`}
            />
          )}
          {absentCount > 0 && (
            <div
              className="bg-red-500 transition-all duration-500"
              style={{ width: `${(absentCount / totalStudents) * 100}%` }}
              title={`Absent: ${absentCount}`}
            />
          )}
          {lateCount > 0 && (
            <div
              className="bg-yellow-500 transition-all duration-500"
              style={{ width: `${(lateCount / totalStudents) * 100}%` }}
              title={`Late: ${lateCount}`}
            />
          )}
          {excusedCount > 0 && (
            <div
              className="bg-blue-500 transition-all duration-500"
              style={{ width: `${(excusedCount / totalStudents) * 100}%` }}
              title={`Excused: ${excusedCount}`}
            />
          )}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span className="text-gray-600 dark:text-gray-400">Present</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
              <span className="text-gray-600 dark:text-gray-400">Absent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
              <span className="text-gray-600 dark:text-gray-400">Late</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <span className="text-gray-600 dark:text-gray-400">Excused</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
