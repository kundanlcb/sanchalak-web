import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SalaryStructureSchema, type SalaryStructureFormData } from '../types/schema';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Select } from '../../../components/common/Select';

interface SalaryConfigFormProps {
  initialData?: SalaryStructureFormData;
  onSubmit: (data: SalaryStructureFormData) => Promise<void>;
  isLoading?: boolean;
}

export const SalaryConfigForm: React.FC<SalaryConfigFormProps> = ({
  initialData,
  onSubmit,
  isLoading
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SalaryStructureFormData>({
    resolver: zodResolver(SalaryStructureSchema),
    defaultValues: initialData || {
      academicYear: '2025-2026',
      paymentFrequency: 'Monthly',
      baseSalary: 0,
      allowances: { hra: 0, da: 0, ta: 0 },
      deductions: { pf: 0, tds: 0 }
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Academic Year"
          {...register('academicYear')}
          error={errors.academicYear?.message}
          options={['2025-2026', '2026-2027'].map(v => ({ value: v, label: v }))}
        />
        <Select
          label="Frequency"
          {...register('paymentFrequency')}
          error={errors.paymentFrequency?.message}
          options={[{ value: 'Monthly', label: 'Monthly' }]}
        />
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">Earnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Base Salary (₹)"
            {...register('baseSalary', { valueAsNumber: true })}
            error={errors.baseSalary?.message}
          />
          <Input
            type="number"
            label="HRA (₹)"
            {...register('allowances.hra', { valueAsNumber: true })}
            error={errors.allowances?.hra?.message}
          />
          <Input
            type="number"
            label="DA (₹)"
            {...register('allowances.da', { valueAsNumber: true })}
            error={errors.allowances?.da?.message}
          />
          <Input
            type="number"
            label="TA (₹)"
            {...register('allowances.ta', { valueAsNumber: true })}
            error={errors.allowances?.ta?.message}
          />
        </div>
      </div>

      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
        <h3 className="font-semibold text-red-900 dark:text-red-300 mb-3">Deductions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="PF (₹)"
            {...register('deductions.pf', { valueAsNumber: true })}
            error={errors.deductions?.pf?.message}
          />
          <Input
            type="number"
            label="TDS (₹)"
            {...register('deductions.tds', { valueAsNumber: true })}
            error={errors.deductions?.tds?.message}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </form>
  );
};
