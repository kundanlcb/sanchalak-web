// specs/002-academic-core/contracts/exams.ts

export interface ExamTerm {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  classes: string[]; // List of Class IDs
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  maxMarks: number;
  passingMarks: number;
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
  maxMarks: number;
  passingMarks: number;
}
