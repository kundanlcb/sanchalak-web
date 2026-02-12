// specs/002-academic-core/contracts/marks.ts

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
