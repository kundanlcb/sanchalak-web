export type NoticePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type NoticeAudience = 'All' | 'Staff' | 'Teachers' | 'Parents' | 'Students' | 'Class';

export interface NoticeAttachment {
  id: string;
  name: string;
  url: string;
  type: string; // 'pdf', 'image', etc.
  size: number; // in bytes
}

export interface Notice {
  id: string;
  title: string;
  content: string; // HTML or Markdown
  priority: NoticePriority;
  audience: NoticeAudience;
  targetClassID?: string; // If audience is 'Class'
  publishDate: string; // ISO Date
  expiryDate?: string; // ISO Date (for auto-archival)
  authorID: string;
  authorName: string;
  attachments?: NoticeAttachment[];
  isRead?: boolean; // For user-specific views
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  priority: NoticePriority;
  audience: NoticeAudience;
  targetClassID?: string;
  expiryDate?: string;
  attachments?: File[]; // For handling file uploads in service
}

export interface UpdateNoticeRequest extends Partial<Omit<CreateNoticeRequest, 'attachments'>> {
  id: string;
  attachmentsToAdd?: File[];
  attachmentIdsToRemove?: string[];
}

export interface NoticeListQuery {
  page?: number;
  limit?: number;
  audience?: NoticeAudience;
  priority?: NoticePriority;
  search?: string;
  startDate?: string;
  endDate?: string;
  includeArchived?: boolean;
}

export interface NoticeListResponse {
  notices: Notice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
