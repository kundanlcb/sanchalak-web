import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { homeworkSchema, type HomeworkFormData } from '../types/schema';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Modal } from '../../../components/common/Modal';
import { Upload, X } from 'lucide-react';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useTeachers } from '../../school-ops/hooks/useTeachers';
import { cn } from '../../../utils/cn';

interface HomeworkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HomeworkFormData & { attachments: any[] }) => Promise<void>;
  isLoading?: boolean;
}

export const HomeworkForm: React.FC<HomeworkFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { classes, subjects } = useAcademicStructure();
  const { teachers } = useTeachers();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HomeworkFormData>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      classId: '',
      subjectId: '',
      teacherId: '',
    }
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleFormSubmit = async (data: HomeworkFormData) => {
    // Transform files to attachment stub objects
    const attachments = files.map((file, index) => ({
      id: `att-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.includes('pdf') ? 'pdf' : 'image',
      size: file.size,
      url: URL.createObjectURL(file) // temporary local URL
    }));

    await onSubmit({ ...data, attachments });
    reset();
    setFiles([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Homework"
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleFormSubmit)} disabled={isLoading}>
            {isLoading ? 'Posting...' : 'Post Homework'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input label="Title" placeholder="Chapter 5 Exercises" error={errors.title?.message} {...register('title')} />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            className={cn(
              "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
              "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
              errors.description && "border-red-500 focus:ring-red-500"
            )}
            rows={3}
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Class" {...register('classId')} error={errors.classId?.message}>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={String(cls.id)}>
                {cls.className || `Grade ${cls.grade}-${cls.section}`}
              </option>
            ))}
          </Select>
          <Select label="Subject" {...register('subjectId')} error={errors.subjectId?.message}>
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={String(sub.id)}>{sub.name}</option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Teacher" {...register('teacherId')} error={errors.teacherId?.message}>
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={String(teacher.id)}>{teacher.name}</option>
            ))}
          </Select>
          <Input type="date" label="Due Date" error={errors.dueDate?.message} {...register('dueDate')} />
        </div>

        {/* File Upload Mock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachments</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a file</span>
                  <input type="file" className="sr-only" multiple onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
            </div>
          </div>
          {files.length > 0 && (
            <div className="mt-2 space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-red-500"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};
