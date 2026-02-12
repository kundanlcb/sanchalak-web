import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHomework } from '../hooks/useHomework';
import { HomeworkCard } from '../components/HomeworkCard';
import { HomeworkForm } from '../components/HomeworkForm';
import { Button } from '../../../components/common/Button';
import { Plus } from 'lucide-react';
import { Skeleton } from '../../../components/common/Skeleton';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';

export const HomeworkPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedClassId, setSelectedClassId] = useState('CLS-2026-00003'); // Default to Class 5
  
  const { homeworkList, isLoading, createHomework, deleteHomework } = useHomework(selectedClassId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const classes = [
      { id: 'CLS-2026-00003', label: 'Class 5-A' },
      { id: 'CLS-2026-00011', label: 'Class 6-A' },
      { id: 'CLS-2026-00012', label: 'Class 7-A' } // Assuming mock ID for 7
  ];

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

       {/* Filters - Active */}
       <div className="flex gap-4 overflow-x-auto pb-2">
           {classes.map(cls => (
               <button 
                 key={cls.id} 
                 onClick={() => setSelectedClassId(cls.id)}
                 className={`
                    px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors
                    ${selectedClassId === cls.id 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}
                 `}
               >
                   {cls.label}
               </button>
           ))}
       </div>

      {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
          </div>
      ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {homeworkList.map(hw => (
                  <HomeworkCard key={hw.id} homework={hw} onDelete={(id) => setDeleteId(id)} />
              ))}
              {homeworkList.length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-500">
                      No homework assigned yet.
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
