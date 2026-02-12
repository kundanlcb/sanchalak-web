import { z } from 'zod';

export const examTermSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date',
  }),
  classes: z.array(z.string()).min(1, 'At least one class must be selected'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  classId: z.string().min(1, 'Class is required'),
  maxMarks: z.number().min(1, 'Max marks must be greater than 0'),
  passingMarks: z.number().min(0, 'Passing marks cannot be negative'),
}).refine((data) => {
  return data.passingMarks <= data.maxMarks;
}, {
  message: 'Passing marks cannot exceed max marks',
  path: ['passingMarks'],
});

export type ExamTermFormData = z.infer<typeof examTermSchema>;
export type SubjectFormData = z.infer<typeof subjectSchema>;

export const markEntrySchema = z.object({
  studentId: z.string(),
  examTermId: z.string(),
  subjectId: z.string(),
  marksObtained: z.number().min(0, 'Marks cannot be negative'),
  remarks: z.string().optional(),
});

export type MarkEntryFormData = z.infer<typeof markEntrySchema>;
