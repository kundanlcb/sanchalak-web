/**
 * StudentCard Component
 * Summary card view of student profile
 */

import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import type { Student } from '../types/student.types';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Header with Photo and Name */}
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 flex-shrink-0 relative">
          {student.profilePhoto ? (
            <img
              src={student.profilePhoto}
              alt={student.name}
              className="h-16 w-16 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-700"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center border border-blue-200/50 dark:border-blue-700/50">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {student.name.charAt(0)}
              </span>
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800 ${student.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-gray-900 dark:text-white truncate tracking-tight">
            {student.name}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">
            Adm: {student.admissionNumber}
          </p>
        </div>
        <div className="mt-1">
          <span
            className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${student.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
          >
            {student.status}
          </span>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Class:</span>
            <span>Grade {student.classId}-{student.section}</span>
            <span className="text-gray-400">•</span>
            <span>Roll {student.rollNumber}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{student.mobileNumber}</span>
          </div>

          {student.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="truncate">{student.email}</span>
            </div>
          )}

          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">
              {student.address?.city}, {student.address?.state}
            </span>
          </div>
        </div>

        {/* Parent Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {student.primaryParent?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {student.primaryParent?.relationship} • {student.primaryParent?.mobileNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
