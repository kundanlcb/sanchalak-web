import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, School } from 'lucide-react';
import { type Class, ClassSchema } from '../types';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';

const CreateClassSchema = ClassSchema.omit({ classID: true });
type ClassFormValues = z.infer<typeof CreateClassSchema>;

interface ClassManagerProps {
  classes: Class[];
  addClass: (data: Partial<Class>) => Promise<any>;
  loading: boolean;
}

export const ClassManager: React.FC<ClassManagerProps> = ({ classes, addClass, loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClassFormValues>({
    resolver: zodResolver(CreateClassSchema),
  });

  const onSubmit = async (data: ClassFormValues) => {
    await addClass(data);
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <div>
           <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <School className="w-5 h-5 text-orange-500" />
             Classes
           </h2>
           <p className="text-sm text-gray-500">Manage school classes and sections</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.length === 0 ? (
             <div className="col-span-full py-8 text-center text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                No classes defined. Add your first class.
             </div>
        ) : (
            classes.map((cls) => (
                <div key={cls.classID} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {cls.className || `Class ${cls.grade}-${cls.section}`}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Grade {cls.grade} • Section {cls.section}
                            </p>
                        </div>
                        <span className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-mono text-gray-600 dark:text-gray-300">
                            {cls.room || 'No Room'}
                        </span>
                    </div>
                </div>
            ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Class"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
                label="Grade (Number)"
                type="number"
                placeholder="e.g. 10"
                error={errors.grade?.message}
                {...register('grade')}
            />
            <Input
                label="Section"
                placeholder="e.g. A"
                error={errors.section?.message}
                {...register('section')}
            />
          </div>
          <Input
            label="Class Name (Optional)"
            placeholder="e.g. Grade 10-A"
            error={errors.className?.message}
            {...register('className')}
          />
           <Input
            label="Room Number"
            placeholder="e.g. 101"
            error={errors.room?.message}
            {...register('room')}
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <button
               type="button"
               onClick={() => setIsModalOpen(false)}
               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
               type="submit"
               disabled={loading}
               className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Saving...' : 'Save Class'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
