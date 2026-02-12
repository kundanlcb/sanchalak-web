import apiClient from '../../../services/api/client';
import API_CONFIG from '../../../services/api/config';
import { noticeHandlers } from '../../../mocks/handlers/noticeHandlers';
import type { 
  Notice, 
  CreateNoticeRequest, 
  UpdateNoticeRequest, 
  NoticeListQuery, 
  NoticeListResponse 
} from '../types/notice.types';

export const getNotices = async (query: NoticeListQuery): Promise<NoticeListResponse> => {
  if (API_CONFIG.USE_MOCK_API) {
    return noticeHandlers.handleGetNotices(query);
  }
  const response = await apiClient.get<NoticeListResponse>('/notices', { params: query });
  return response.data;
};

export const getNotice = async (id: string): Promise<Notice> => {
  if (API_CONFIG.USE_MOCK_API) {
    return noticeHandlers.handleGetNotice(id);
  }
  const response = await apiClient.get<Notice>(`/notices/${id}`);
  return response.data;
};

export const createNotice = async (request: CreateNoticeRequest): Promise<Notice> => {
  if (API_CONFIG.USE_MOCK_API) {
    // Inject mock user details since we don't have real auth in service layer
    // In a real app, the backend would infer this from the token
    return noticeHandlers.handleCreateNotice({
      ...request,
      authorID: 'user-001', // Mock admin
      authorName: 'Admin User'
    });
  }
  
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
  if (API_CONFIG.USE_MOCK_API) {
    return noticeHandlers.handleUpdateNotice(request);
  }
  const response = await apiClient.put<Notice>(`/notices/${request.id}`, request);
  return response.data;
};

export const deleteNotice = async (id: string): Promise<{ success: true }> => {
  if (API_CONFIG.USE_MOCK_API) {
    return noticeHandlers.handleDeleteNotice(id);
  }
  await apiClient.delete(`/notices/${id}`);
  return { success: true };
};

export const markAsRead = async (id: string): Promise<{ success: true }> => {
  if (API_CONFIG.USE_MOCK_API) {
    return noticeHandlers.handleMarkAsRead(id);
  }
  await apiClient.post(`/notices/${id}/read`);
  return { success: true };
};
