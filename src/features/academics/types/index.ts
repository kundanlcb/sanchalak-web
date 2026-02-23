// src/features/academics/types/index.ts

export interface ExamTerm {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  classes: string[]; // List of Class IDs
}

export interface ExamSchedule {
  id: string;
  examTermId: string;
  classId: string;
  subjectId: string;
  examDate: string;
  maxMarks: number;
  passingMarks?: number;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  // Populated from backend relations
  examTerm?: { id: number; name: string };
  studentClass?: { id: number; name?: string; className?: string };
  subject?: { id: number; name: string; code: string };
}

export interface CreateExamScheduleRequest {
  examTermId: string;
  classId: string;
  subjectId: string;
  examDate: string;
  maxMarks: number;
  passingMarks?: number;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
}

export interface ExamQuestion {
  id: string;
  examScheduleId: string;
  marks: number;
  sequenceOrder: number;
  question: {
    id: number;
    chapterId: number;
    questionText: string;
    questionType: string;
    marks: number;
    options?: { id: number; optionText: string; isCorrect: boolean }[];
  };
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  maxMarks?: number;
  passingMarks?: number;
}

export interface CreateExamTermRequest {
  name: string;
  startDate: string;
  endDate: string;
  classes: string[];
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  classId: string;
}

export interface MarkEntry {
  id: string; // Composite ID often useful: "${termId}_${studentId}_${subjectId}"
  studentId: string;
  examTermId: string;
  subjectId: string;
  marksObtained: number;
  remarks?: string;
  lastUpdated: string;
}

export interface MarksGridRow {
  student: {
    id: string;
    name: string;
    rollNumber: string;
  };
  marks?: number; // Current value
  status: 'saved' | 'unsaved' | 'error';
}

export interface UpdateMarkRequest {
  studentId: string;
  examTermId: string;
  subjectId: string;
  marksObtained: number;
}
