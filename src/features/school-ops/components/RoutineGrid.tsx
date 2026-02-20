import React from 'react';
import { DAYS_OF_WEEK, GLOBAL_PERIODS } from '../types';
import type { Routine, Subject, Teacher } from '../types';
import { cn } from '../../../utils/cn';

interface RoutineGridProps {
  routines: Routine[];
  subjects: Subject[];
  teachers: Teacher[];
  editable?: boolean;
  onCellClick?: (day: string, period: string, currentRoutine?: Routine) => void;
}

export const RoutineGrid: React.FC<RoutineGridProps> = ({
  routines,
  subjects,
  teachers,
  editable = false,
  onCellClick
}) => {

  const getRoutineForCell = (day: string, period: string) => {
    return routines.find(r => r.day === day && r.period === period);
  };

  const getSubjectName = (id: number | string) => subjects.find(s => s.id === id)?.name || String(id);
  const getTeacherName = (id: number | string) => teachers.find(t => t.id === id)?.name || String(id);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[1000px] border border-gray-200 dark:border-gray-700 rounded-lg">
        {/* Header Row */}
        <div className="grid grid-cols-[100px_repeat(8,1fr)] bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-gray-50 dark:bg-gray-800 z-10">
            Day / Period
          </div>
          {GLOBAL_PERIODS.map(period => (
            <div key={period} className="p-3 text-sm font-semibold text-center text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
              {period}
            </div>
          ))}
        </div>

        {/* Days Rows */}
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="grid grid-cols-[100px_repeat(8,1fr)] border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky left-0 z-10 flex items-center justify-center">
              {day}
            </div>
            {GLOBAL_PERIODS.map(period => {
              const routine = getRoutineForCell(day, period);
              const isBreak = period === 'Break';

              if (isBreak) {
                return (
                  <div key={`${day}-${period}`} className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                    <span className="text-xs text-gray-400 rotate-90 sm:rotate-0 tracking-widest uppercase">Break</span>
                  </div>
                );
              }

              return (
                <div
                  key={`${day}-${period}`}
                  onClick={() => !isBreak && onCellClick?.(day, period, routine)}
                  className={cn(
                    "min-h-[80px] p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 transition-colors relative group",
                    editable && "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20",
                    !routine && "bg-white dark:bg-gray-800",
                    routine && "bg-blue-50/50 dark:bg-blue-900/10"
                  )}
                >
                  {routine ? (
                    <div className="flex flex-col h-full justify-center text-xs">
                      <span className="font-semibold text-blue-700 dark:text-blue-300 mb-1 line-clamp-2">
                        {getSubjectName(routine.subjectId)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 truncate">
                        {getTeacherName(routine.teacherId)}
                      </span>
                    </div>
                  ) : (
                    editable && (
                      <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 text-blue-400 font-medium text-xs">
                        + Assign
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
