import React from 'react';
import { useAcademicStructure } from '../hooks/useAcademicStructure';
import { SubjectManager } from '../components/SubjectManager';
import { ClassManager } from '../components/ClassManager';
import { Loader2 } from 'lucide-react';

export const AcademicSetupPage: React.FC = () => {
  const { classes, subjects, loading, addClass, addSubject } = useAcademicStructure();

  if (loading && classes.length === 0 && subjects.length === 0) {
      return (
          <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
      );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Setup</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Configure core school structure, classes, and subjects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         {/* Left Column: Classes */}
         <div className="space-y-6">
            <ClassManager 
                classes={classes} 
                addClass={addClass} 
                loading={loading} 
            />
         </div>

         {/* Right Column: Subjects */}
         <div className="space-y-6">
            <SubjectManager 
                subjects={subjects} 
                addSubject={addSubject} 
                loading={loading} 
            />
         </div>
      </div>
    </div>
  );
};
