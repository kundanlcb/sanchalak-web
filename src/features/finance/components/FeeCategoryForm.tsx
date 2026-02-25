import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeeCategorySchema, type FeeCategoryFormData } from '../types/schema';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';

interface FeeCategoryFormProps {
  onSubmit: (data: FeeCategoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<FeeCategoryFormData>;
}

export const FeeCategoryForm: React.FC<FeeCategoryFormProps> = ({ onSubmit, onCancel, isLoading, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FeeCategoryFormData>({
    resolver: zodResolver(FeeCategorySchema),
    defaultValues: {
      isMandatory: true,
      active: true,
      frequency: 'Monthly',
      ...initialData
    }
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        isMandatory: true,
        active: true,
        frequency: 'Monthly',
        ...initialData
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Category Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Description"
        {...register('description')}
        error={errors.description?.message}
      />

      <Select
        label="Type"
        {...register('type')}
        error={errors.type?.message}
        options={['Tuition', 'Transport', 'Exam', 'Lab', 'Library', 'Activity', 'Other'].map(v => ({ value: v, label: v }))}
      />

      <Select
        label="Frequency"
        {...register('frequency')}
        error={errors.frequency?.message}
        options={['Monthly', 'Quarterly', 'Annual', 'OneTime'].map(v => ({ value: v, label: v }))}
      />

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isMandatory"
            {...register('isMandatory')}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="isMandatory" className="text-sm text-gray-700 dark:text-gray-300">Is Mandatory?</label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Category'}</Button>
      </div>
    </form>
  );
};
