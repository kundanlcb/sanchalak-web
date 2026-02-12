// specs/002-academic-core/contracts/homework.ts

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
  classId: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  attachments: HomeworkAttachment[];
  createdAt: string;
  createdBy: string; // Teacher ID
}

export interface CreateHomeworkRequest {
  classId: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  attachments: File[]; // Represented as Files in frontend before upload
}
