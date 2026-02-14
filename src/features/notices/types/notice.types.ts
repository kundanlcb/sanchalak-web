/**
 * Notice Types
 * Domain types that derive from generated API models where shapes overlap.
 * Components should ALWAYS import from here — never from src/api/ directly.
 */

// ============================================================================
// Re-exported API Types (for service layer use)
// ============================================================================

/** Generated DTOs — use these in services that call the API directly */
export type { NoticeDto } from '../../../api/models/notice-dto';
export type { NoticeDetailDto } from '../../../api/models/notice-detail-dto';
export type { NoticeRequest as ApiNoticeRequest } from '../../../api/models/notice-request';

// ============================================================================
// Domain Types (used by components and stores)
// ============================================================================

export type NoticePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type NoticeAudience = 'All' | 'Staff' | 'Teachers' | 'Parents' | 'Students' | 'Class';

export interface NoticeAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: NoticePriority;
  audience: NoticeAudience;
  targetClassID?: string;
  publishDate: string;
  expiryDate?: string;
  authorID: string;
  authorName: string;
  attachments?: NoticeAttachment[];
  isRead?: boolean;
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
  attachments?: File[];
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
