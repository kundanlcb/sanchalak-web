import React, { useState } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Modal } from '../../../components/common/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subjectSchema, type SubjectFormData } from '../types/schema';
import { Plus, BookOpen } from 'lucide-react';
import { Skeleton } from '../../../components/common/Skeleton';

export const SubjectConfig: React.FC = () => {
  const { subjects, isLoading, createSubject } = useSubjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Subjects</h2>
          <p className="text-sm text-gray-500">Manage curriculum subjects</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
            {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div key={subject.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <BookOpen className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-semibold text-gray-900 dark:text-gray-100">{subject.name}</h3>
                   <div className="text-sm text-gray-500 dark:text-gray-400">Code: {subject.code}</div>
                   <div className="text-xs text-gray-400 mt-1">
                       Max: {subject.maxMarks} | Pass: {subject.passingMarks}
                   </div>
                </div>
            </div>
          ))}
          {subjects.length === 0 && (
             <div className="col-span-full text-center py-8 text-gray-500">No subjects configured</div>
          )}
        </div>
      )}

      <SubjectFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={async (data) => {
            await createSubject(data);
            setIsModalOpen(false);
        }}
      />
    </div>
  );
};

interface SubjectFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SubjectFormData) => Promise<void>;
}

const SubjectFormModal: React.FC<SubjectFormProps> = ({ isOpen, onClose, onSubmit }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<SubjectFormData>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: '',
            code: '',
            classId: 'all', // Default
            maxMarks: 100,
            passingMarks: 33
        }
    });

    const onFormSubmit = async (data: SubjectFormData) => {
        await onSubmit(data);
        reset();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Subject">
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <Input label="Subject Name" placeholder="Mathematics" error={errors.name?.message} {...register('name')} />
                <Input label="Subject Code" placeholder="MATH101" error={errors.code?.message} {...register('code')} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Max Marks" type="number" error={errors.maxMarks?.message} {...register('maxMarks', { valueAsNumber: true })} />
                    <Input label="Passing Marks" type="number" error={errors.passingMarks?.message} {...register('passingMarks', { valueAsNumber: true })} />
                </div>
                 {/* Hidden Class ID for now */}
                 <input type="hidden" {...register('classId')} value="all" />
                
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Subject'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
