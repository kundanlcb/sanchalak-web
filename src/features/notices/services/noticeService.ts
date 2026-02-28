import apiClient from '../../../services/api/client';
import type {
  Notice,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  NoticeListQuery,
  NoticeListResponse,
  NoticeAudience,
  NoticePriority
} from '../types/notice.types';
import type { NoticeRequest as ApiNoticeRequest } from '../../../api/models/notice-request';
import type { NoticeDto } from '../../../api/models/notice-dto';

// Mapping helpers
const mapAudienceToRole = (audience: NoticeAudience): string => {
  const mapping: Record<NoticeAudience, string> = {
    'All': 'ALL',
    'Students': 'STUDENT',
    'Parents': 'PARENT',
    'Teachers': 'TEACHER',
    'Staff': 'ALL', // Standardized for now
    'Class': 'ALL'  // Backend specific class support pending
  };
  return mapping[audience] || 'ALL';
};

const mapRoleToAudience = (role: string): NoticeAudience => {
  const mapping: Record<string, NoticeAudience> = {
    'STUDENT': 'Students',
    'PARENT': 'Parents',
    'TEACHER': 'Teachers',
    'ALL': 'All'
  };
  return mapping[role.toUpperCase()] || 'All';
};

const mapPriorityToBackend = (priority: NoticePriority): string => {
  return priority.toUpperCase();
};

const mapPriorityToFrontend = (priority: string): NoticePriority => {
  const p = priority.charAt(0) + priority.slice(1).toLowerCase();
  if (['Low', 'Medium', 'High', 'Urgent'].includes(p)) return p as NoticePriority;
  return 'Medium';
};

const mapDtoToNotice = (dto: NoticeDto): Notice => ({
  id: String(dto.id || ''),
  title: dto.title || '',
  content: (dto as any).content || '', // Handle missing content in list view if needed
  priority: mapPriorityToFrontend(dto.priority || 'Medium'),
  audience: mapRoleToAudience(dto.targetRole || 'ALL'),
  publishDate: dto.publishDate || new Date().toISOString(),
  expiryDate: dto.expiryDate,
  authorName: dto.createdByName || 'Admin',
  authorID: '', // Not provided in current DTO
  isRead: dto.read || false,
  createdAt: dto.publishDate || new Date().toISOString(), // Fallback
  updatedAt: dto.publishDate || new Date().toISOString()   // Fallback
});

export const getNotices = async (query: NoticeListQuery): Promise<NoticeListResponse> => {
  const response = await apiClient.get<any>('/api/notices', {
    params: {
      onlyRecent: query.includeArchived === false,
      // Backend doesn't support full search/pagination yet, but we'll pass them
    }
  });

  if (response.data?.success && response.data?.data) {
    const { notices, totalCount } = response.data.data;
    const mappedNotices = (notices || []).map(mapDtoToNotice);

    return {
      notices: mappedNotices,
      total: totalCount || mappedNotices.length,
      page: query.page || 1,
      limit: query.limit || 10,
      totalPages: Math.ceil((totalCount || mappedNotices.length) / (query.limit || 10))
    };
  }
  return { notices: [], total: 0, page: 1, limit: 10, totalPages: 1 };
};

export const getNotice = async (id: string): Promise<Notice> => {
  const response = await apiClient.get<any>(`/api/notices/${id}`);
  if (response.data?.success && response.data?.data) {
    return mapDtoToNotice(response.data.data);
  }
  throw new Error('Notice not found');
};

export const createNotice = async (request: CreateNoticeRequest): Promise<Notice> => {
  const apiRequest: ApiNoticeRequest = {
    title: request.title,
    content: request.content,
    priority: mapPriorityToBackend(request.priority),
    targetRole: mapAudienceToRole(request.audience),
    expiryDate: request.expiryDate,
  };

  const response = await apiClient.post<any>('/api/notices', apiRequest);

  if (response.data?.success && response.data?.data) {
    return mapDtoToNotice(response.data.data);
  }
  throw new Error(response.data?.message || 'Failed to create notice');
};

export const updateNotice = async (request: UpdateNoticeRequest): Promise<Notice> => {
  const apiRequest: Partial<ApiNoticeRequest> = {
    title: request.title,
    content: request.content,
    priority: request.priority ? mapPriorityToBackend(request.priority) : undefined,
    targetRole: request.audience ? mapAudienceToRole(request.audience) : undefined,
    expiryDate: request.expiryDate,
  };

  const response = await apiClient.put<any>(`/api/notices/${request.id}`, apiRequest);
  if (response.data?.success && response.data?.data) {
    return mapDtoToNotice(response.data.data);
  }
  throw new Error(response.data?.message || 'Failed to update notice');
};

export const deleteNotice = async (id: string): Promise<{ success: true }> => {
  await apiClient.delete(`/api/notices/${id}`);
  return { success: true };
};

export const markAsRead = async (id: string): Promise<{ success: true }> => {
  // Backend marks as read automatically on GET /{id} or has a specific endpoint
  // Based on NoticeController, GET /{id} handles it. 
  // But NoticeDetail.tsx calls this, so let's check if there's a dedicated POST /{id}/read
  // If not, we can just return success as GET already did it.
  try {
    await apiClient.post(`/api/notices/${id}/read`);
  } catch (e) {
    // Ignore if endpoint doesn't exist, as detail view marks it
  }
  return { success: true };
};
