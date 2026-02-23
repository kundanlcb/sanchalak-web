import React from 'react';
import { DAYS_OF_WEEK } from '../types';
import type { Routine, Subject, Teacher, TimetableSlot } from '../types';
import { cn } from '../../../utils/cn';

interface RoutineGridProps {
  routines: Routine[];
  subjects: Subject[];
  teachers: Teacher[];
  slots: TimetableSlot[];
  editable?: boolean;
  onCellClick?: (day: string, period: string, periodIndex: number, currentRoutine?: Routine) => void;
}

export const RoutineGrid: React.FC<RoutineGridProps> = ({
  routines,
  subjects,
  teachers,
  slots,
  editable = false,
  onCellClick
}) => {

  const getRoutineForCell = (day: string, slotIndex: number) => {
    return routines.find(r => r.day === day && r.periodIndex === slotIndex);
  };

  const getSubjectName = (id: number | string) => subjects.find(s => s.id === id)?.name || String(id);
  const getTeacherName = (id: number | string) => teachers.find(t => t.id === id)?.name || String(id);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[1000px] border border-gray-200 dark:border-gray-700 rounded-lg">
        {/* Header Row */}
        <div className="grid border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" style={{ gridTemplateColumns: `100px repeat(${slots.length}, minmax(120px, 1fr))` }}>
          <div className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-gray-50 dark:bg-gray-800 z-10 flex items-center">
            Day / Period
          </div>
          {slots.map(slot => (
            <div key={slot.name} className="p-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 flex flex-col justify-center items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{slot.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-500 font-normal">{slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</span>
            </div>
          ))}
        </div>

        {/* Days Rows */}
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="grid grid-cols-[100px_repeat(auto-fit,minmax(120px,1fr))] border-b border-gray-200 dark:border-gray-700 last:border-b-0" style={{ gridTemplateColumns: `100px repeat(${slots.length}, minmax(120px, 1fr))` }}>
            <div className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky left-0 z-10 flex items-center justify-center">
              {day}
            </div>
            {slots.map(slot => {
              const routine = getRoutineForCell(day, slot.orderIndex);
              const isBreak = slot.isBreak;

              if (isBreak) {
                return (
                  <div key={`${day}-${slot.name}`} className="bg-orange-50/50 dark:bg-orange-900/10 flex items-center justify-center border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                    <span className="text-xs text-orange-400 dark:text-orange-500 rotate-90 sm:rotate-0 tracking-widest uppercase font-medium">{slot.name}</span>
                  </div>
                );
              }

              return (
                <div
                  key={`${day}-${slot.name}`}
                  onClick={() => !isBreak && onCellClick?.(day, slot.name, slot.orderIndex, routine)}
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
