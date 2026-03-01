import React, { useState } from 'react';
import { useExamTerms } from '../hooks/useExamTerms';
import { ExamTermList } from '../components/ExamTermList';
import { ExamTermForm } from '../components/ExamTermForm';
import { type ExamTermFormData } from '../types/schema';
import { Button } from '../../../components/common/Button';
import { Plus, Calendar, ClipboardList, FileQuestion, BarChart3, FileText } from 'lucide-react';
import { type CreateExamTermRequest, type ExamTerm } from '../types';
import { ExamScheduleConfig } from '../components/ExamScheduleConfig';
import { ExamQuestionPaper } from '../components/ExamQuestionPaper';
import { ExamAdmitCards } from '../components/ExamAdmitCards';
import { ExamResultsMarksheet } from '../components/ExamResultsMarksheet';

type ExamTab = 'terms' | 'schedules' | 'questions' | 'admit-cards' | 'results';

const tabConfig: { key: ExamTab; label: string; icon: React.ElementType }[] = [
  { key: 'terms', label: 'Exam Terms', icon: Calendar },
  { key: 'schedules', label: 'Schedules', icon: ClipboardList },
  { key: 'questions', label: 'Question Papers', icon: FileQuestion },
  { key: 'admit-cards', label: 'Admit Cards', icon: FileText },
  { key: 'results', label: 'Results', icon: BarChart3 },
];

export const ExamConfigPage: React.FC = () => {
  const { examTerms, isLoading, createExamTerm, updateExamTerm, deleteExamTerm } = useExamTerms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<ExamTab>('terms');
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

  const handleDeleteTerm = async (id: string) => {
    try {
      if (deleteExamTerm) {
        await deleteExamTerm(id);
      }
    } catch (error) {
      console.error("Failed to delete exam term", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Exam Tabs">
          {tabConfig.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                                    flex items-center gap-2 whitespace-nowrap pb-3 px-4 border-b-2 font-medium text-sm transition-colors
                                    ${isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'terms' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Exam Terms
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create and manage exam periods like Unit Test, Midterm, Final Exam.
              </p>
            </div>
            <Button onClick={() => openForm()} className="w-full sm:w-auto flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Exam Term
            </Button>
          </div>

          <ExamTermList examTerms={examTerms} isLoading={isLoading} onEdit={openForm} onDelete={handleDeleteTerm} />

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

      {activeTab === 'schedules' && <ExamScheduleConfig />}
      {activeTab === 'questions' && <ExamQuestionPaper />}
      {activeTab === 'admit-cards' && <ExamAdmitCards />}
      {activeTab === 'results' && <ExamResultsMarksheet />}
    </div>
  );
};
