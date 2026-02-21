import React, { useState } from 'react';
import { useExamTerms } from '../hooks/useExamTerms';
import { ExamTermList } from '../components/ExamTermList';
import { ExamTermForm } from '../components/ExamTermForm';
import { type ExamTermFormData } from '../types/schema';
import { Button } from '../../../components/common/Button';
import { Plus } from 'lucide-react';
import { type CreateExamTermRequest, type ExamTerm } from '../types';
import { SubjectConfig } from '../components/SubjectConfig';
import { ExamScheduleConfig } from '../components/ExamScheduleConfig';
import { useTranslation } from 'react-i18next';

export const ExamConfigPage: React.FC = () => {
  const { t } = useTranslation();
  const { examTerms, isLoading, createExamTerm, updateExamTerm } = useExamTerms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'exams' | 'subjects' | 'schedules'>('exams');
  const [selectedTerm, setSelectedTerm] = useState<ExamTerm | null>(null);

  const handleCreateOrUpdateTerm = async (data: ExamTermFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedTerm) {
        await updateExamTerm({
          id: selectedTerm.id,
          data: {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
          }
        });
      } else {
        const request: CreateExamTermRequest = {
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          classes: data.classes,
        };
        await createExamTerm(request);
      }
      setIsModalOpen(false);
      setSelectedTerm(null);
    } catch (error) {
      console.error("Failed to save exam term", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openForm = (term?: ExamTerm) => {
    setSelectedTerm(term || null);
    setIsModalOpen(true);
  };


  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('exams')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'exams'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            {t('academics.exams.tabTerms')}
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'subjects'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            {t('academics.exams.tabSubjects')}
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'schedules'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            Schedules
          </button>
        </nav>
      </div>

      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {t('academics.exams.title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('academics.exams.subtitle')}
              </p>
            </div>
            <Button onClick={() => openForm()} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              {t('academics.exams.newTerm')}
            </Button>
          </div>

          <ExamTermList examTerms={examTerms} isLoading={isLoading} onEdit={openForm} />

          <ExamTermForm
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTerm(null);
            }}
            onSubmit={handleCreateOrUpdateTerm}
            isLoading={isSubmitting}
            initialData={selectedTerm ? {
              name: selectedTerm.name,
              startDate: selectedTerm.startDate,
              endDate: selectedTerm.endDate,
              classes: ['all']
            } : undefined}
          />
        </div>
      )}

      {activeTab === 'subjects' && <SubjectConfig />}
      {activeTab === 'schedules' && <ExamScheduleConfig />}
    </div>
  );
};
