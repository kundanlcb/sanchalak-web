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
  id: string | number;
  classId?: number; // Legacy/frontend mock
  subjectId?: number | string; // Legacy/frontend mock
  studentClass?: { id: number; className?: string; grade?: number; section?: string };
  subject?: { id: number; name: string; code?: string };
  teacher?: { id: number; name: string };
  title: string;
  description: string;
  dueDate: string;
  attachments?: HomeworkAttachment[];
  attachmentUrl?: string | null;
  createdAt?: string;
  createdBy?: number; // Teacher ID
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
