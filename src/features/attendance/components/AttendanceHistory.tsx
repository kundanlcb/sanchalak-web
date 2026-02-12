/**
 * AttendanceHistory Component
 * Calendar view showing attendance history with color-coded dates
 */

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { AttendanceStatus } from '../types/attendance.types';

interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
  studentName?: string;
  className?: string;
  onDateClick?: (date: string) => void;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  records,
  studentName,
  className,
  onDateClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get month details
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calculate calendar grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Create attendance map for quick lookup
  const attendanceMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    records.forEach(record => {
      map.set(record.date, record);
    });
    return map;
  }, [records]);

  // Generate calendar days array
  const calendarDays: (number | null)[] = [];
  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const getDateString = (day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isFutureDate = (day: number): boolean => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const getStatusColor = (status: AttendanceStatus): string => {
    const colorMap: Record<AttendanceStatus, string> = {
      Present: 'bg-green-500 text-white',
      Absent: 'bg-red-500 text-white',
      Late: 'bg-yellow-500 text-white',
      Excused: 'bg-blue-500 text-white',
      Holiday: 'bg-gray-400 text-white',
    };
    return colorMap[status] || 'bg-gray-200 text-gray-700';
  };

  // Calculate monthly summary
  const monthlySummary = useMemo(() => {
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: 0,
    };

    records.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate.getFullYear() === year && recordDate.getMonth() === month) {
        summary.total++;
        if (record.status === 'Present') summary.present++;
        if (record.status === 'Absent') summary.absent++;
        if (record.status === 'Late') summary.late++;
        if (record.status === 'Excused') summary.excused++;
      }
    });

    return summary;
  }, [records, year, month]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-soft', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md shrink-0">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Attendance History
            </h3>
            {studentName && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{studentName}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleToday}
          className="w-full sm:w-auto px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-200 dark:border-blue-800 sm:border-transparent"
        >
          Today
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
          {monthName}
        </h4>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateString = getDateString(day);
            const attendance = attendanceMap.get(dateString);
            const today = isToday(day);
            const future = isFutureDate(day);

            return (
              <button
                key={day}
                onClick={() => onDateClick && !future && onDateClick(dateString)}
                disabled={future}
                className={cn(
                  'aspect-square flex items-center justify-center rounded-lg font-medium text-sm transition-all',
                  'hover:scale-105 active:scale-95',
                  attendance
                    ? getStatusColor(attendance.status)
                    : future
                    ? 'bg-gray-100 dark:bg-gray-700/30 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                  today && !attendance && 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800',
                  attendance && 'shadow-md'
                )}
                title={attendance ? `${attendance.status}${attendance.remarks ? `: ${attendance.remarks}` : ''}` : undefined}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Legend
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Present ({monthlySummary.present})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Absent ({monthlySummary.absent})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Late ({monthlySummary.late})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Excused ({monthlySummary.excused})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Holiday</span>
          </div>
        </div>
        {monthlySummary.total > 0 && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <span className="font-semibold">This Month:</span> {monthlySummary.present} present out of {monthlySummary.total} days
              ({Math.round((monthlySummary.present / monthlySummary.total) * 100)}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
