import { z } from 'zod';

export const FeeCategorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['Tuition', 'Transport', 'Exam', 'Lab', 'Library', 'Activity', 'Other']),
  frequency: z.enum(['Monthly', 'Quarterly', 'Annual', 'OneTime']),
  isMandatory: z.boolean(),
  active: z.boolean()
});

export type FeeCategoryFormData = z.infer<typeof FeeCategorySchema>;

export const FeeStructureSchema = z.object({
  academicYear: z.string().min(1, 'Academic Year is required'),
  classId: z.union([z.string(), z.number()]).refine(val => !!val, { message: 'Class is required' }),
  categoryId: z.string().min(1, 'Fee Category is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  dueDateDay: z.number().min(1).max(31).optional(),
  lateFeeRule: z.object({
    gracePeriodDays: z.number().min(0),
    penaltyType: z.enum(['Fixed', 'Percentage']),
    penaltyAmount: z.number().min(0)
  }).optional()
});

export type FeeStructureFormData = z.infer<typeof FeeStructureSchema>;
