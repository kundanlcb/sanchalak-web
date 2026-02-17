import apiClient from '../../../services/api/client';
import type {
  Notice,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  NoticeListQuery,
  NoticeListResponse
} from '../types/notice.types';

export const getNotices = async (query: NoticeListQuery): Promise<NoticeListResponse> => {
  const response = await apiClient.get<any>('/api/notices', { params: query });
  // The backend returns ApiResult<Map<String, Object>>
  // where data contains { notices: [], unreadCount: X, totalCount: Y }
  if (response.data?.success && response.data?.data) {
    const { notices, totalCount } = response.data.data;
    return {
      notices: notices || [],
      total: totalCount || 0,
      page: query.page || 1,
      limit: query.limit || 10,
      totalPages: Math.ceil((totalCount || 0) / (query.limit || 10))
    };
  }
  return { notices: [], total: 0, page: 1, limit: 10, totalPages: 1 };
};

export const getNotice = async (id: string): Promise<Notice> => {
  const response = await apiClient.get<Notice>(`/api/notices/${id}`);
  return response.data;
};

export const createNotice = async (request: CreateNoticeRequest): Promise<Notice> => {
  // Handle file uploads if attachments exist
  if (request.attachments && request.attachments.length > 0) {
    const formData = new FormData();
    Object.entries(request).forEach(([key, value]) => {
      if (key === 'attachments') {
        (value as File[]).forEach(file => formData.append('attachments', file));
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await apiClient.post<Notice>('/api/notices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  const response = await apiClient.post<Notice>('/api/notices', request);
  return response.data;
};

export const updateNotice = async (request: UpdateNoticeRequest): Promise<Notice> => {
  const response = await apiClient.put<Notice>(`/api/notices/${request.id}`, request);
  return response.data;
};

export const deleteNotice = async (id: string): Promise<{ success: true }> => {
  await apiClient.delete(`/api/notices/${id}`);
  return { success: true };
};

export const markAsRead = async (id: string): Promise<{ success: true }> => {
  await apiClient.post(`/api/notices/${id}/read`);
  return { success: true };
};
