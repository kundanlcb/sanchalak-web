/**
 * AttendancePage Component
 * Main page for marking and viewing attendance
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, Save, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Skeleton } from '../../../components/common/Skeleton';
import { Select } from '../../../components/common/Select';
import { Input } from '../../../components/common/Input';
import { AttendanceSheet } from '../components/AttendanceSheet';
import { AttendanceStats } from '../components/AttendanceStats';
import { AttendanceHistory } from '../components/AttendanceHistory';
import * as attendanceService from '../services/attendanceService';
import { useAuth } from '../../auth/services/authContext';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { runConcurrencyTest } from '../utils/performanceTest';
import type { AttendanceStatus, ClassAttendanceSheet as AttendanceSheetType, StudentAttendance, AttendanceSummary, Attendance } from '../types/attendance.types';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const isStaff = user?.role === 'Admin' || user?.role === 'Teacher' || user?.role === 'Staff';
  const isAdmin = user?.role === 'Admin';
  const isStudentOrParent = user?.role === 'Student' || user?.role === 'Parent';

  // Staff State
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceSheet, setAttendanceSheet] = useState<AttendanceSheetType | null>(null);
  const [localAttendance, setLocalAttendance] = useState<Record<number, { status: AttendanceStatus; remarks?: string }>>({});

  // Student/Parent State
  const [myAttendanceSummary, setMyAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [myAttendanceHistory, setMyAttendanceHistory] = useState<Attendance[]>([]);

  // Common State
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Available classes (Fetch dynamically)
  const { classes: availableClasses, refresh: fetchClasses } = useAcademicStructure();

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Load student personal attendance (Parent/Student view)
  const loadMyAttendance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use logged-in user's ID
      const studentId = Number(user?.userID) || 1;
      const now = new Date();
      const startDate = new Date(now.getFullYear(), 0, 1).toISOString(); // Jan 1st
      const endDate = new Date(now.getFullYear(), 11, 31).toISOString(); // Dec 31st

      const [summary, historyResponse] = await Promise.all([
        attendanceService.getAttendanceSummary({
          studentId,
          startDate,
          endDate
        }),
        attendanceService.getAttendance({ studentId, limit: 100 })
      ]);

      setMyAttendanceSummary(summary);
      setMyAttendanceHistory(historyResponse.attendances);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load class attendance sheet (Staff view)
  const loadAttendanceSheet = async () => {
    if (!selectedClass || !selectedDate) {
      setError('Please select both class and date');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const sheet = await attendanceService.getClassAttendanceSheet({
        classId: selectedClass,
        date: selectedDate,
      });
      setAttendanceSheet(sheet);

      // Initialize local attendance state with existing data
      const initial: Record<number, { status: AttendanceStatus; remarks?: string }> = {};
      sheet.students.forEach(student => {
        initial[student.studentId] = {
          status: student.status,
          remarks: student.remarks,
        };
      });
      setLocalAttendance(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance sheet');
      setAttendanceSheet(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to load data based on role
  useEffect(() => {
    if (isStudentOrParent) {
      loadMyAttendance();
    }
  }, [isStudentOrParent]);

  const handleRunLoadTest = async () => {
    if (!confirm('Run load test? This will simulate 500 concurrent marking requests.')) return;
    setIsLoading(true);
    try {
      const result = await runConcurrencyTest();
      setSuccessMessage(`Load Test: ${result.successes} processed in ${result.duration.toFixed(0)}ms (${result.throughput.toFixed(0)} req/s)`);
    } catch (err) {
      setError('Load test failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle attendance change from AttendanceSheet component
  const handleAttendanceChange = (studentId: number, status: AttendanceStatus, remarks?: string) => {
    setLocalAttendance(prev => ({
      ...prev,
      [studentId]: { status, remarks },
    }));
  };

  // Submit attendance
  const handleSubmitAttendance = async () => {
    if (!attendanceSheet) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const attendanceRecords = attendanceSheet.students.map(student => ({
        studentId: student.studentId,
        classId: selectedClass,
        date: selectedDate,
        status: localAttendance[student.studentId]?.status || 'Present',
        remarks: localAttendance[student.studentId]?.remarks,
      }));

      const response = await attendanceService.bulkMarkAttendance({
        classId: Number(selectedClass),
        date: selectedDate,
        attendances: attendanceRecords,
        markedBy: String(user?.userID) || 'unknown',
      });

      if (response.success) {
        setSuccessMessage(
          `Attendance marked successfully! ${response.marked} students marked.${response.failed > 0 ? ` ${response.failed} failed.` : ''
          }`
        );
        // Reload sheet to show updated data
        await loadAttendanceSheet();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-load when class or date changes (Staff only)
  useEffect(() => {
    if (isStaff && selectedClass && selectedDate) {
      loadAttendanceSheet();
    }
  }, [isStaff, selectedClass, selectedDate]);

  // Calculate stats from local attendance state (for Staff view)
  const currentStats = attendanceSheet ? {
    totalStudents: attendanceSheet.totalStudents,
    presentCount: Object.values(localAttendance).filter(a => a.status === 'Present').length,
    absentCount: Object.values(localAttendance).filter(a => a.status === 'Absent').length,
    lateCount: Object.values(localAttendance).filter(a => a.status === 'Late').length,
    excusedCount: Object.values(localAttendance).filter(a => a.status === 'Excused').length,
    attendancePercentage: Math.round(
      (Object.values(localAttendance).filter(a => a.status === 'Present').length /
        attendanceSheet.totalStudents) *
      100
    ),
  } : null;

  // Prepare updated student data with local changes
  const updatedStudents: StudentAttendance[] = attendanceSheet
    ? attendanceSheet.students.map(student => ({
      ...student,
      status: localAttendance[student.studentId]?.status || student.status,
      remarks: localAttendance[student.studentId]?.remarks || student.remarks,
    }))
    : [];

  const isPastDate = new Date(selectedDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  const isReadonly = attendanceSheet?.isMarked || isPastDate;

  // RENDER: Parent/Student View
  if (isStudentOrParent) {
    if (isLoading) {
      return (
        <div className="space-y-6 animate-in">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Attendance</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              View your attendance record
            </p>
          </div>
        </div>

        {myAttendanceSummary && (
          <AttendanceStats
            totalStudents={myAttendanceSummary.totalDays}
            presentCount={myAttendanceSummary.presentDays}
            absentCount={myAttendanceSummary.absentDays}
            lateCount={myAttendanceSummary.lateDays}
            excusedCount={myAttendanceSummary.excusedDays}
            attendancePercentage={Math.round(myAttendanceSummary.attendancePercentage)}
          />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">History</h3>
          <AttendanceHistory
            records={myAttendanceHistory.map(r => ({
              date: r.date,
              status: r.status,
              remarks: r.remarks
            }))}
            studentName="My History"
          />
        </div>
      </div>
    );
  }

  // RENDER: Staff View (original)
  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Mark and manage class attendance
            </p>
          </div>
        </div>

        {/* Admin Tools */}
        {isAdmin && (
          <button
            onClick={handleRunLoadTest}
            className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 font-medium px-3 py-1.5 border border-amber-200 dark:border-amber-800 rounded-md bg-amber-50 dark:bg-amber-900/10"
          >
            <Zap className="w-3 h-3" />
            Test Load (500/s)
          </button>
        )}
      </div>

      {/* Selection Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 md:items-end">
          {/* Class Selector */}
          <Select
            label="Select Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Choose a class...</option>
            {availableClasses.map((cls) => (
              <option key={cls.id} value={String(cls.id)}>
                {cls.className || `Grade ${cls.grade}-${cls.section}`}
              </option>
            ))}
          </Select>

          {/* Date Selector */}
          <Input
            type="date"
            label="Select Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />

          {/* Load Button */}
          <div className="flex items-end">
            <button
              onClick={loadAttendanceSheet}
              disabled={!selectedClass || !selectedDate || isLoading}
              className={cn(
                'w-full px-4 py-3 sm:py-2.5 rounded-lg font-medium transition-all text-base sm:text-sm',
                'flex items-center justify-center gap-2',
                selectedClass && selectedDate && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              )}
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              {isLoading ? 'Loading...' : 'Load Attendance'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 animate-in">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Error</p>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3 animate-in">
          <Save className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">Success</p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {attendanceSheet && (
        <>
          {/* Stats Section */}
          {currentStats && (
            <AttendanceStats
              totalStudents={currentStats.totalStudents}
              presentCount={currentStats.presentCount}
              absentCount={currentStats.absentCount}
              lateCount={currentStats.lateCount}
              excusedCount={currentStats.excusedCount}
              attendancePercentage={currentStats.attendancePercentage}
            />
          )}

          {/* Attendance Sheet */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Mark Attendance
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {attendanceSheet.className} • {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                {isPastDate && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                    ⚠️ Past date records cannot be modified.
                  </p>
                )}
              </div>
              {!attendanceSheet.isMarked && !isPastDate && (
                <button
                  onClick={handleSubmitAttendance}
                  disabled={isSubmitting}
                  className={cn(
                    'w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-lg font-medium transition-all',
                    'flex items-center justify-center gap-2',
                    isSubmitting
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg active:scale-95'
                  )}
                >
                  <Save className={cn('w-4 h-4', isSubmitting && 'animate-spin')} />
                  {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
                </button>
              )}
            </div>

            <AttendanceSheet
              students={updatedStudents}
              onAttendanceChange={handleAttendanceChange}
              isSubmitting={isSubmitting}
              readonly={isReadonly}
            />

            {attendanceSheet.isMarked && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  ✓ Attendance has been marked for this class on this date.
                  {attendanceSheet.markedBy && attendanceSheet.markedDate && (
                    <span className="block mt-1">
                      Marked by {attendanceSheet.markedBy} on{' '}
                      {new Date(attendanceSheet.markedDate).toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* History Section - Would show student-specific history in production */}
          {/* <AttendanceHistory 
            records={[]} 
            studentName="Class History"
          /> */}
        </>
      )}

      {/* Loading State */}
      {isLoading && !attendanceSheet && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!attendanceSheet && !isLoading && !error && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Attendance Sheet Loaded
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Select a class and date, then click "Load Attendance" to start marking attendance.
          </p>
        </div>
      )}
    </div>
  );
};
