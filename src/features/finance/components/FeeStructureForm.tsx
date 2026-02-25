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
      <Input
        label="Structure Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="e.g. Annual Fees 2025"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Academic Year"
          {...register('academicYear')}
          error={errors.academicYear?.message}
          options={['2025-2026', '2026-2027'].map(v => ({ value: v, label: v }))}
        />

        <Select
          label="Frequency"
          {...register('frequency')}
          error={errors.frequency?.message}
          options={['Monthly', 'Quarterly', 'Annual', 'OneTime'].map(v => ({ value: v, label: v }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="number"
          label="Amount (₹)"
          {...register('amount', {
            setValueAs: v => v === "" ? undefined : parseFloat(v)
          })}
          error={errors.amount?.message}
        />

        <Input
          type="number"
          label="Due Day"
          {...register('dueDateDay', {
            setValueAs: v => v === "" ? undefined : parseInt(v, 10)
          })}
          error={errors.dueDateDay?.message}
          placeholder="1-31"
        />

        <Input
          type="number"
          label="Grace Days"
          {...register('gracePeriodDays', {
            setValueAs: v => v === "" ? undefined : parseInt(v, 10)
          })}
          error={errors.gracePeriodDays?.message}
        />
      </div>

      <Input
        type="number"
        label="Late Fee Amount (₹)"
        {...register('lateFeeAmount', {
          setValueAs: v => v === "" ? undefined : parseFloat(v)
        })}
        error={errors.lateFeeAmount?.message}
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
