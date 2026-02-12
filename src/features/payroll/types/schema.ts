import { z } from 'zod';

export const SalaryStructureSchema = z.object({
  academicYear: z.string().min(1, 'Academic Year is required'),
  baseSalary: z.number().min(0, 'Base Salary must be positive'),
  allowances: z.object({
    hra: z.number().min(0),
    da: z.number().min(0),
    ta: z.number().min(0)
  }),
  deductions: z.object({
    pf: z.number().min(0),
    tds: z.number().min(0)
  }),
  paymentFrequency: z.enum(['Monthly'])
});

export type SalaryStructureFormData = z.infer<typeof SalaryStructureSchema>;

export const PayrollGenerateSchema = z.object({
  month: z.string().min(1, 'Month is required'),
  year: z.string().min(4, 'Year is required')
});

export type PayrollGenerateFormData = z.infer<typeof PayrollGenerateSchema>;
