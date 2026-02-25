import React from 'react';
import { DAYS_OF_WEEK } from '../types';
import type { Routine, Subject, Teacher, TimetableSlot } from '../types';
import { cn } from '../../../utils/cn';
import { Plus, Coffee } from 'lucide-react';

interface RoutineGridProps {
  routines: Routine[];
  subjects: Subject[];
  teachers: Teacher[];
  slots: TimetableSlot[];
  editable?: boolean;
  onCellClick?: (day: string, period: string, periodIndex: number, currentRoutine?: Routine) => void;
}

// Distinct soft accent colors for each subject (cycle through them)
const SUBJECT_COLORS = [
  { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-l-blue-400', text: 'text-blue-700 dark:text-blue-300', teacher: 'text-blue-500/80 dark:text-blue-400/80' },
  { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-l-violet-400', text: 'text-violet-700 dark:text-violet-300', teacher: 'text-violet-500/80 dark:text-violet-400/80' },
  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-l-emerald-400', text: 'text-emerald-700 dark:text-emerald-300', teacher: 'text-emerald-500/80 dark:text-emerald-400/80' },
  { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-l-amber-400', text: 'text-amber-700 dark:text-amber-300', teacher: 'text-amber-500/80 dark:text-amber-400/80' },
  { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-l-rose-400', text: 'text-rose-700 dark:text-rose-300', teacher: 'text-rose-500/80 dark:text-rose-400/80' },
  { bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-l-teal-400', text: 'text-teal-700 dark:text-teal-300', teacher: 'text-teal-500/80 dark:text-teal-400/80' },
  { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-l-indigo-400', text: 'text-indigo-700 dark:text-indigo-300', teacher: 'text-indigo-500/80 dark:text-indigo-400/80' },
  { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-l-orange-400', text: 'text-orange-700 dark:text-orange-300', teacher: 'text-orange-500/80 dark:text-orange-400/80' },
];

const DAY_SHORT: Record<string, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed',
  THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
};

export const RoutineGrid: React.FC<RoutineGridProps> = ({
  routines, subjects, teachers, slots, editable = false, onCellClick
}) => {

  const getRoutineForCell = (day: string, slotIndex: number) =>
    routines.find(r => r.day === day && r.periodIndex === slotIndex);

  const getSubjectName = (id: number | string) => subjects.find(s => s.id === id)?.name || String(id);
  const getTeacherName = (id: number | string) => teachers.find(t => t.id === id)?.name || String(id);

  // Stable color per subject ID
  const subjectColorMap = new Map<number | string, typeof SUBJECT_COLORS[0]>();
  subjects.forEach((s, i) => subjectColorMap.set(s.id, SUBJECT_COLORS[i % SUBJECT_COLORS.length]));
  return (
    <div className="space-y-4">
      {/* ── Period Header strip ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div
            className="min-w-max grid"
            style={{ gridTemplateColumns: `120px repeat(${slots.length}, minmax(130px, 1fr))` }}
          >
            {/* Corner cell */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-r border-gray-100 dark:border-gray-700 flex items-center">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Day / Period</span>
            </div>

            {/* Period headers */}
            {slots.map((slot, idx) => (
              <div
                key={slot.name}
                className={cn(
                  'px-3 py-3 border-b border-r last:border-r-0 border-gray-100 dark:border-gray-700 text-center',
                  slot.isBreak
                    ? 'bg-orange-50/70 dark:bg-orange-900/10'
                    : idx % 2 === 0
                      ? 'bg-gray-50 dark:bg-gray-900/50'
                      : 'bg-white dark:bg-gray-800'
                )}
              >
                {slot.isBreak ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <Coffee className="h-3.5 w-3.5 text-orange-400" />
                    <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider">{slot.name}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{slot.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                      {slot.startTime.substring(0, 5)}–{slot.endTime.substring(0, 5)}
                    </p>
                  </>
                )}
              </div>
            ))}

            {/* Day rows */}
            {DAYS_OF_WEEK.map((day, dayIdx) => (
              <React.Fragment key={day}>
                {/* Day label */}
                <div className={cn(
                  'px-4 py-3 border-b last:border-b-0 border-r border-gray-100 dark:border-gray-700 flex flex-col justify-center sticky left-0 z-10',
                  dayIdx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-900/20'
                )}>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{DAY_SHORT[day] ?? day}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                </div>

                {/* Cells */}
                {slots.map(slot => {
                  const routine = getRoutineForCell(day, slot.orderIndex);
                  const palette = routine ? (subjectColorMap.get(routine.subjectId) ?? SUBJECT_COLORS[0]) : null;

                  if (slot.isBreak) {
                    return (
                      <div
                        key={`${day}-${slot.name}`}
                        className="min-h-[70px] border-b last:border-b-0 border-r last:border-r-0 border-gray-100 dark:border-gray-700 bg-orange-50/40 dark:bg-orange-900/5 flex items-center justify-center"
                      >
                        <Coffee className="h-4 w-4 text-orange-300 dark:text-orange-700" />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`${day}-${slot.name}`}
                      onClick={() => onCellClick?.(day, slot.name, slot.orderIndex, routine)}
                      className={cn(
                        'min-h-[70px] p-1.5 border-b last:border-b-0 border-r last:border-r-0 border-gray-100 dark:border-gray-700 transition-all group relative',
                        editable && 'cursor-pointer',
                        !routine && editable && 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10',
                        !routine && !editable && (dayIdx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/30 dark:bg-gray-900/10')
                      )}
                    >
                      {routine && palette ? (
                        <div className={cn(
                          'h-full rounded-xl border-l-[3px] px-2.5 py-2 flex flex-col justify-between',
                          palette.bg,
                          palette.border,
                          editable && 'group-hover:brightness-95 transition-all'
                        )}>
                          <span className={cn('text-xs font-bold leading-tight line-clamp-2', palette.text)}>
                            {getSubjectName(routine.subjectId)}
                          </span>
                          <span className={cn('text-[10px] font-medium truncate mt-1', palette.teacher)}>
                            {getTeacherName(routine.teacherId)}
                          </span>
                        </div>
                      ) : (
                        editable && (
                          <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-1 text-blue-400 dark:text-blue-500 text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">
                              <Plus className="h-3 w-3" />
                              Assign
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};
