import React, { useState } from 'react';
import { useExamTerms } from '../hooks/useExamTerms';
import { ExamTermList } from '../components/ExamTermList';
import { ExamTermForm } from '../components/ExamTermForm';
import { type ExamTermFormData } from '../types/schema';
import { Button } from '../../../components/common/Button';
import { Plus } from 'lucide-react';
import { type CreateExamTermRequest } from '../types';
import { SubjectConfig } from '../components/SubjectConfig';
import { useTranslation } from 'react-i18next';

export const ExamConfigPage: React.FC = () => {
  const { t } = useTranslation();
  const { examTerms, isLoading, createExamTerm } = useExamTerms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'exams' | 'subjects'>('exams');

  const handleCreateTerm = async (data: ExamTermFormData) => {
    setIsSubmitting(true);
    try {
      // Map form data to API request
      const request: CreateExamTermRequest = {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        classes: data.classes,
      };
      await createExamTerm(request);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create exam term", error);
    } finally {
      setIsSubmitting(false);
    }
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
            <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              {t('academics.exams.newTerm')}
            </Button>
          </div>

          <ExamTermList examTerms={examTerms} isLoading={isLoading} />

          <ExamTermForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateTerm}
            isLoading={isSubmitting}
          />
        </div>
      )}

      {activeTab === 'subjects' && <SubjectConfig />}
    </div>
  );
};
