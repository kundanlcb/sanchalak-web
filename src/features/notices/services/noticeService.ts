import apiClient from '../../../services/api/client';
import type {
  Notice,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  NoticeListQuery,
  NoticeListResponse
} from '../types/notice.types';

export const getNotices = async (query: NoticeListQuery): Promise<NoticeListResponse> => {
  const response = await apiClient.get<NoticeListResponse>('/notices', { params: query });
  return response.data;
};

export const getNotice = async (id: string): Promise<Notice> => {
  const response = await apiClient.get<Notice>(`/notices/${id}`);
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

    const response = await apiClient.post<Notice>('/notices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  const response = await apiClient.post<Notice>('/notices', request);
  return response.data;
};

export const updateNotice = async (request: UpdateNoticeRequest): Promise<Notice> => {
  const response = await apiClient.put<Notice>(`/notices/${request.id}`, request);
  return response.data;
};

export const deleteNotice = async (id: string): Promise<{ success: true }> => {
  await apiClient.delete(`/notices/${id}`);
  return { success: true };
};

export const markAsRead = async (id: string): Promise<{ success: true }> => {
  await apiClient.post(`/notices/${id}/read`);
  return { success: true };
};
