import { z } from 'zod';

export const homeworkSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().optional(),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid due date',
  }),
  // Attachments are handled separately often due to File API, 
  // but if we were validating the array of uploaded file metadata:
  // attachments: z.array(z.any()).optional()
}).refine((data) => {
    const due = new Date(data.dueDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    return due >= today;
}, {
    message: 'Due date cannot be in the past',
    path: ['dueDate']
});

export type HomeworkFormData = z.infer<typeof homeworkSchema>;
