import { z } from 'zod';

// --- Enums / Constants ---

export const SUBJECT_TYPES = ['Theory', 'Practical', 'Activity'] as const;
export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export const GLOBAL_PERIODS = ['Period 1', 'Period 2', 'Period 3', 'Break', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8'] as const;

// --- Zod Schemas ---

export const SubjectSchema = z.object({
  id: z.coerce.number(), // backend uses BIGINT
  name: z.string().min(2, "Subject name is required"),
  code: z.string().min(2, "Subject code is required"),
  type: z.enum(SUBJECT_TYPES).optional().default('Theory'),
  classId: z.coerce.number().optional(), // Link to class if specific
  maxMarks: z.number().optional(),
  passingMarks: z.number().optional(),
});

export const ClassSchema = z.object({
  id: z.coerce.number(), // backend uses BIGINT
  grade: z.coerce.number().min(1, "Grade is required"), // e.g., 1, 10
  section: z.string().min(1, "Section is required"), // e.g., "A"
  className: z.string().optional(), // "Grade 1-A"
  room: z.string().optional(),
  academicYear: z.string().optional(),
  classTeacherID: z.string().optional(),
});

export const TeacherSchema = z.object({
  id: z.coerce.number(), // backend uses BIGINT
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  joiningDate: z.string(), // ISO string YYYY-MM-DD
  specializedSubjects: z.array(z.coerce.number()), // Array of Subject IDs
  qualification: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const RoutineSchema = z.object({
  id: z.coerce.number(),
  classId: z.coerce.number(), // FK to Class.id
  day: z.enum(DAYS_OF_WEEK),
  period: z.enum(GLOBAL_PERIODS),
  subjectId: z.coerce.number(), // FK to Subject.id
  teacherId: z.coerce.number(), // FK to Teacher.id
});

// --- TypeScript Interfaces ---

export type Subject = z.infer<typeof SubjectSchema>;
export type Class = z.infer<typeof ClassSchema>;
export type Teacher = z.infer<typeof TeacherSchema>;
export type Routine = z.infer<typeof RoutineSchema>;

// --- Aggregated Types ---

export interface RoutineCell {
  period: typeof GLOBAL_PERIODS[number];
  day: typeof DAYS_OF_WEEK[number];
  entry?: Routine; // If undefined, cell is empty/free
}
