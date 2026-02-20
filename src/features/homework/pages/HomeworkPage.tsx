import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHomework } from '../hooks/useHomework';
import { HomeworkCard } from '../components/HomeworkCard';
import { HomeworkForm } from '../components/HomeworkForm';
import { Button } from '../../../components/common/Button';
import { Plus, Loader2 } from 'lucide-react';
import { Skeleton } from '../../../components/common/Skeleton';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { Select } from '../../../components/common/Select';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useSubjects } from '../../academics/hooks/useSubjects';

export const HomeworkPage: React.FC = () => {
  const { t } = useTranslation();
  const { classes, loading: loadingClasses } = useAcademicStructure();
  const { subjects, isLoading: loadingSubjects } = useSubjects();

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const { homeworkList, isLoading, createHomework, deleteHomework } = useHomework({
    classId: selectedClassId,
    subjectId: selectedSubjectId,
    date: selectedDate
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Set default class once loaded
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(String(classes[0].id));
    }
  }, [classes, selectedClassId]);

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createHomework(data);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteHomework(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {t('homework.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('homework.subtitle')}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          {t('homework.assign')}
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Class Selection */}
        <div className="relative">
          <Select
            label="Class"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            disabled={loadingClasses}
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={String(cls.id)}>
                Grade {cls.grade}-{cls.section} {cls.className ? `(${cls.className})` : ''}
              </option>
            ))}
          </Select>
          {loadingClasses && <Loader2 className="absolute right-2 top-8 h-4 w-4 animate-spin text-gray-400" />}
        </div>

        {/* Subject Selection */}
        <div className="relative">
          <Select
            label="Subject"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            disabled={loadingSubjects}
          >
            <option value="">All Subjects</option>
            {subjects.map(sub => (
              <option key={sub.id} value={String(sub.id)}>{sub.name}</option>
            ))}
          </Select>
          {loadingSubjects && <Loader2 className="absolute right-2 top-8 h-4 w-4 animate-spin text-gray-400" />}
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-100"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeworkList.map(hw => (
            <HomeworkCard key={hw.id} homework={hw} onDelete={(id) => setDeleteId(id)} />
          ))}
          {homeworkList.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No homework found for the selected filters.
            </div>
          )}
        </div>
      )}

      <HomeworkForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Homework"
        message="Are you sure you want to delete this assignment? Students will no longer see it."
        confirmLabel="Delete"
        type="danger"
      />
    </div>
  );
};
