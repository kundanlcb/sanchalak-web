import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademicStructure } from '../hooks/useAcademicStructure';
import { Loader2, Users, BookOpen } from 'lucide-react';

export const AcademicSetupPage: React.FC = () => {
  const { classes, loading } = useAcademicStructure();
  const navigate = useNavigate();

  if (loading && classes.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select a class to manage its subjects, students, and exams.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
            onClick={() => navigate(`/admin/academics/classes/${cls.id}`)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cls.className || `${cls.grade} ${cls.section}`}</h3>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Active
                </span>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Manage Cohort</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Curriculum & Subjects</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full p-12 text-center border-2 border-dashed rounded-xl border-gray-300 dark:border-gray-700 text-gray-500">
            No classes have been configured in the system yet.
          </div>
        )}
      </div>
    </div>
  );
};
