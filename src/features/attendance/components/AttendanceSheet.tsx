/**
 * AttendanceSheet Component
 * Class roster with Present/Absent toggle buttons for marking attendance
 */

import React, { useState } from 'react';
import { Check, X, Clock, FileText } from 'lucide-react';
import type { StudentAttendance, AttendanceStatus } from '../types/attendance.types';
import { cn } from '../../../utils/cn';

interface AttendanceSheetProps {
  students: StudentAttendance[];
  onAttendanceChange: (studentId: number, status: AttendanceStatus, remarks?: string) => void;
  isSubmitting?: boolean;
  readonly?: boolean;
}

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  students,
  onAttendanceChange,
  isSubmitting = false,
  readonly = false,
}) => {
  const [remarks, setRemarks] = useState<Record<number, string>>({});

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    if (readonly || isSubmitting) return;
    onAttendanceChange(studentId, status, remarks[studentId]);
  };

  const handleRemarksChange = (studentId: number, value: string) => {
    setRemarks(prev => ({ ...prev, [studentId]: value }));
    // Auto-update if status is already set
    const student = students.find(s => s.studentId === studentId);
    if (student && student.status !== 'Present') {
      onAttendanceChange(studentId, student.status, value);
    }
  };

  const getStatusButton = (student: StudentAttendance, status: AttendanceStatus) => {
    const isActive = student.status === status;
    const baseClass = "flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 active:scale-95";

    const statusColors = {
      Present: isActive
        ? 'bg-green-500 text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20',
      Absent: isActive
        ? 'bg-red-500 text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20',
      Late: isActive
        ? 'bg-yellow-500 text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
      Excused: isActive
        ? 'bg-blue-500 text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      Holiday: 'bg-gray-300 text-gray-700',
    };

    const icons = {
      Present: <Check className="w-3 h-3 sm:w-4 sm:h-4" />,
      Absent: <X className="w-3 h-3 sm:w-4 sm:h-4" />,
      Late: <Clock className="w-3 h-3 sm:w-4 sm:h-4" />,
      Excused: <FileText className="w-3 h-3 sm:w-4 sm:h-4" />,
      Holiday: null,
    };

    return (
      <button
        type="button"
        onClick={() => handleStatusChange(student.studentId, status)}
        disabled={readonly || isSubmitting}
        className={cn(baseClass, statusColors[status], readonly && 'cursor-not-allowed opacity-60')}
      >
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {icons[status]}
          <span className="hidden xs:inline sm:inline">{status}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-2">
      {students.map((student, index) => (
        <div
          key={student.studentId}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-soft transition-all duration-200"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          {/* Student Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              {/* Profile Photo / Initial */}
              {student.profilePhoto ? (
                <img
                  src={student.profilePhoto}
                  alt={student.name || (student as any).studentName || 'Unknown'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-lg">
                    {(student.name || (student as any).studentName || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Name and Roll Number */}
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  {student.name || (student as any).studentName || 'Unknown Student'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Roll No: {student.rollNumber || 'N/A'}
                </p>
              </div>
            </div>

            {/* Status Badge (Mobile) */}
            <div className="sm:hidden">
              <div
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold',
                  student.status === 'Present' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                  student.status === 'Absent' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                  student.status === 'Late' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                  student.status === 'Excused' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                )}
              >
                {student.status}
              </div>
            </div>
          </div>

          {/* Status Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {getStatusButton(student, 'Present')}
            {getStatusButton(student, 'Absent')}
            {getStatusButton(student, 'Late')}
            {getStatusButton(student, 'Excused')}
          </div>

          {/* Remarks Input (shown if not Present) */}
          {student.status !== 'Present' && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Remarks (optional)
              </label>
              <input
                type="text"
                value={remarks[student.studentId] || student.remarks || ''}
                onChange={(e) => handleRemarksChange(student.studentId, e.target.value)}
                placeholder="Add reason or notes..."
                disabled={readonly || isSubmitting}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          )}

          {/* Existing Remarks (readonly mode) */}
          {readonly && student.remarks && (
            <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Remarks:</p>
              <p className="text-sm text-gray-900 dark:text-white mt-1">{student.remarks}</p>
            </div>
          )}
        </div>
      ))}

      {students.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No students in this class</p>
        </div>
      )}
    </div>
  );
};
