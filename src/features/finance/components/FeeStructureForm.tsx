import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeeStructureSchema, type FeeStructureFormData } from '../types/schema';
import type { FeeCategory } from '../types';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';

interface FeeStructureFormProps {
  categories: FeeCategory[];
  classes: { id: number | string; name: string }[];
  onSubmit: (data: FeeStructureFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<FeeStructureFormData>;
}

export const FeeStructureForm: React.FC<FeeStructureFormProps> = ({
  categories,
  classes,
  onSubmit,
  onCancel,
  isLoading,
  initialData
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FeeStructureFormData>({
    resolver: zodResolver(FeeStructureSchema),
    defaultValues: {
      academicYear: '2025-2026',
      ...initialData
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Academic Year"
        {...register('academicYear')}
        error={errors.academicYear?.message}
        options={['2025-2026', '2026-2027'].map(v => ({ value: v, label: v }))}
      />

      <Select
        label="Class/Grade"
        {...register('classId')}
        error={errors.classId?.message}
        options={classes.map(c => ({ value: String(c.id), label: c.name }))}
      />

      <Select
        label="Fee Category"
        {...register('categoryId')}
        error={errors.categoryId?.message}
        options={categories.map(c => ({ value: c.id, label: c.name }))}
      />

      <Input
        type="number"
        label="Amount (₹)"
        {...register('amount', { valueAsNumber: true })}
        error={errors.amount?.message}
      />

      <Input
        type="number"
        label="Due Day (of month)"
        {...register('dueDateDay', { valueAsNumber: true })}
        error={errors.dueDateDay?.message}
        placeholder="e.g. 10"
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Structure' : 'Save Structure'}
        </Button>
      </div>
    </form>
  );
};
