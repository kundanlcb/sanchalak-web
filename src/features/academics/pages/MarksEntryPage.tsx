import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExamTerms } from '../hooks/useExamTerms';
import { useSubjects } from '../hooks/useSubjects';
import { useMarks } from '../hooks/useMarks';
import { useStudentsByClass } from '../hooks/useStudentsByClass';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { MarksGrid } from '../components/MarksGrid';
import { Loader2 } from 'lucide-react';
import { Select } from '../../../components/common/Select';
import { type UpdateMarkRequest } from '../types';

export const MarksEntryPage: React.FC = () => {
  const { t } = useTranslation();
  // Filters State
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedExamTermId, setSelectedExamTermId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Data Hooks
  const { examTerms, isLoading: loadingTerms } = useExamTerms();
  const { subjects, isLoading: loadingSubjects } = useSubjects();
  const { classes, loading: loadingClasses } = useAcademicStructure();

  // Students
  const { students, isLoading: loadingStudents } = useStudentsByClass(selectedClassId, selectedSection);

  // Marks
  const { marks, isLoading: loadingMarks, bulkSaveMarks, isSavingBulk } = useMarks({
    examTermId: selectedExamTermId,
    subjectId: selectedSubjectId,
    classId: selectedClassId,
    section: selectedSection
  });

  const [localMarks, setLocalMarks] = useState<Record<string, number>>({});
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const handleUpdateMark = (studentId: string, marksObtained: number) => {
    setLocalMarks(prev => ({ ...prev, [studentId]: marksObtained }));
  };

  const handleSaveAll = async () => {
    if (!selectedExamTermId || !selectedSubjectId || !selectedClassId) return;

    const marksPayload = Object.entries(localMarks).map(([studentId, marksObtained]) => ({
      studentId: Number(studentId),
      marksObtained,
    }));

    if (marksPayload.length === 0) return;

    try {
      await bulkSaveMarks({
        examTermId: selectedExamTermId,
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        marks: marksPayload,
      });
      setLocalMarks({});
    } catch (e) {
      console.error("Failed to save marks", e);
    }
  };

  const isLoadingInitial = loadingTerms || loadingSubjects;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('academics.marks.title')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t('academics.marks.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Class Selection */}
        <div className="relative">
          <Select
            label="Class"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            disabled={loadingClasses}
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={String(cls.id)}>
                Grade {cls.grade}-{cls.section} {cls.className ? `(${cls.className})` : ''}
              </option>
            ))}
          </Select>
          {loadingClasses && <Loader2 className="absolute right-2 top-8 h-4 w-4 animate-spin text-gray-400" />}
        </div>

        {/* Section Selection */}
        <Select
          label="Section"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value="all">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
          <option value="D">Section D</option>
        </Select>

        {/* Exam Term Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Term</label>
          <div className="relative">
            <Select
              value={selectedExamTermId}
              onChange={(e) => setSelectedExamTermId(e.target.value)}
              disabled={loadingTerms}
            >
              <option value="">Select Exam</option>
              {examTerms.map(term => (
                <option key={term.id} value={term.id}>{term.name}</option>
              ))}
            </Select>
            {loadingTerms && <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin text-gray-400" />}
          </div>
        </div>

        {/* Subject Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
          <div className="relative">
            <Select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={loadingSubjects}
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </Select>
            {loadingSubjects && <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin text-gray-400" />}
          </div>
        </div>
      </div>

      {isLoadingInitial ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleSaveAll}
              disabled={isSavingBulk || Object.keys(localMarks).length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isSavingBulk && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSavingBulk ? 'Saving...' : 'Save All Marks'}
            </button>
          </div>
          <MarksGrid
            students={students}
            marks={marks}
            localMarks={localMarks}
            subject={selectedSubject}
            examTermId={selectedExamTermId}
            isLoading={loadingStudents || loadingMarks}
            onUpdateMark={handleUpdateMark}
          />
        </div>
      )}
    </div>
  );
};
