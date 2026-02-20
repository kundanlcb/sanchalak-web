// src/features/homework/types/index.ts

export type AttachmentType = 'image' | 'pdf';

export interface HomeworkAttachment {
  id: string;
  name: string;
  url: string;
  type: AttachmentType;
  size: number; // bytes
}

export interface Homework {
  id: string;
  classId: number;
  subjectId: number;
  title: string;
  description: string;
  dueDate: string;
  attachments: HomeworkAttachment[];
  createdAt: string;
  createdBy: number; // Teacher ID
}

export interface CreateHomeworkRequest {
  classId: number;
  subjectId: number;
  teacherId: number;
  title: string;
  description: string;
  dueDate: string;
  attachments?: HomeworkAttachment[]; // Matching frontend form structure
}
