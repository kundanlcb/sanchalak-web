import React from 'react';
import { useAcademicStructure } from '../hooks/useAcademicStructure';
import { ClassManager } from '../components/ClassManager';

export const AcademicSetupPage: React.FC = () => {
  const { classes, loading, addClass, updateClass, deleteClass } = useAcademicStructure();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classes Setup</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage all grades, sections, and class data for the school.</p>
        </div>
      </div>

      <ClassManager
        classes={classes}
        addClass={addClass}
        updateClass={updateClass}
        deleteClass={deleteClass}
        loading={loading}
      />
    </div>
  );
};
