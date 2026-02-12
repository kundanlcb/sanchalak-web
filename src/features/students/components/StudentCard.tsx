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
        <div className="h-16 w-16 flex-shrink-0">
          {student.profilePhoto ? (
            <img
              src={student.profilePhoto}
              alt={student.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-2xl font-semibold text-blue-600 dark:text-blue-300">
                {student.name.charAt(0)}
              </span>
            </div>
          )}
         </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {student.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {student.studentID} • {student.admissionNumber}
          </p>
          <div className="mt-1">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                student.status === 'Active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {student.status}
            </span>
          </div>
        </div>
      </div>
      
      {/* Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Class:</span>
          <span>Grade {student.classID.split('-')[2]}-{student.section}</span>
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
            {student.address.city}, {student.address.state}
          </span>
        </div>
      </div>
      
      {/* Parent Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Primary Contact
        </p>
        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
          {student.primaryParent.name}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {student.primaryParent.relationship} • {student.primaryParent.mobileNumber}
        </p>
      </div>
    </div>
  );
};
