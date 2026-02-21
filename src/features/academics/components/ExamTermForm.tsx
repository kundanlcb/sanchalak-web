import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examTermSchema, type ExamTermFormData } from '../types/schema';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Modal } from '../../../components/common/Modal';

interface ExamTermFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExamTermFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: ExamTermFormData;
}

export const ExamTermForm: React.FC<ExamTermFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExamTermFormData>({
    resolver: zodResolver(examTermSchema),
    defaultValues: initialData || {
      name: '',
      startDate: '',
      endDate: '',
      classes: ['all'], // Default to all for now, simplified
    },
  });

  // Reset form when modal opens with new initialData
  React.useEffect(() => {
    if (isOpen) {
      reset(initialData || {
        name: '',
        startDate: '',
        endDate: '',
        classes: ['all'],
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: ExamTermFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Exam Term" : "Create Exam Term"}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleFormSubmit)} disabled={isLoading}>
            {isLoading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Term' : 'Create Term')}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Input
            label="Exam Term Name"
            placeholder="e.g. Mid Term 2024"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="date"
              label="Start Date"
              error={errors.startDate?.message}
              {...register('startDate')}
            />
          </div>
          <div>
            <Input
              type="date"
              label="End Date"
              error={errors.endDate?.message}
              {...register('endDate')}
            />
          </div>
        </div>

        {/* Simplified Class Selection for MVP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Classes
          </label>
          <p className="text-sm text-gray-500 italic">
            (Assuming all classes for this prototype)
          </p>
          <input type="hidden" {...register('classes')} value={['all']} />
        </div>
      </form>
    </Modal>
  );
};
