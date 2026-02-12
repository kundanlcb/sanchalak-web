import { 
  type Notice, 
  type CreateNoticeRequest, 
  type UpdateNoticeRequest, 
  type NoticeListQuery,
  type NoticeListResponse,
} from '../../features/notices/types/notice.types';
import noticesData from '../data/notices.json';

// In-memory storage
let notices: Notice[] = [...(noticesData as any[])];

// Generate ID
const generateNoticeID = (): string => {
  const ids = notices.map(n => parseInt(n.id.split('-')[2]));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return `NOT-2026-${String(maxId + 1).padStart(5, '0')}`;
};

// Delay simulator
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get notices with filters
export const handleGetNotices = async (query: NoticeListQuery): Promise<NoticeListResponse> => {
  await delay(300);

  let filtered = [...notices];

  // Search
  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(n => 
      n.title.toLowerCase().includes(term) || 
      n.content.toLowerCase().includes(term)
    );
  }

  // Audience Filter
  if (query.audience && query.audience !== 'All') {
    filtered = filtered.filter(n => n.audience === query.audience || n.audience === 'All');
  }

  // Priority Filter
  if (query.priority) {
    filtered = filtered.filter(n => n.priority === query.priority);
  }

  // Date Range
  if (query.startDate) {
    filtered = filtered.filter(n => n.publishDate >= query.startDate!);
  }
  if (query.endDate) {
    filtered = filtered.filter(n => n.publishDate <= query.endDate!);
  }

  // Archival (Default: hide expired/archived)
  if (!query.includeArchived) {
    const now = new Date().toISOString();
    filtered = filtered.filter(n => !n.expiryDate || n.expiryDate > now);
  }

  // Sorting (Newest first)
  filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  // Pagination
  const page = query.page || 1;
  const limit = query.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    notices: filtered.slice(startIndex, endIndex),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit)
  };
};

// Get single notice
export const handleGetNotice = async (id: string): Promise<Notice> => {
  await delay(200);
  const notice = notices.find(n => n.id === id);
  if (!notice) throw new Error('Notice not found');
  return notice;
};

// Create notice
export const handleCreateNotice = async (request: CreateNoticeRequest & { authorID: string, authorName: string }): Promise<Notice> => {
  await delay(500);

  const { attachments, ...rest } = request;

  const newNotice: Notice = {
    id: generateNoticeID(),
    ...rest,
    attachments: attachments ? attachments.map((file, i) => ({
      id: `ATT-${Date.now()}-${i}`,
      name: file.name,
      url: `https://mock-storage.com/${file.name}`,
      type: file.type,
      size: file.size
    })) : undefined,
    publishDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRead: false
  };

  notices.unshift(newNotice);
  return newNotice;
};

// Update notice
export const handleUpdateNotice = async (request: UpdateNoticeRequest): Promise<Notice> => {
  await delay(400);

  const index = notices.findIndex(n => n.id === request.id);
  if (index === -1) throw new Error('Notice not found');

  const updatedNotice = {
    ...notices[index],
    ...request,
    updatedAt: new Date().toISOString()
  };

  notices[index] = updatedNotice;
  return updatedNotice;
};

// Delete notice
export const handleDeleteNotice = async (id: string): Promise<{ success: true }> => {
  await delay(300);
  notices = notices.filter(n => n.id !== id);
  return { success: true };
};

// Mark as read (Mock implementation just updates the flag for the session)
export const handleMarkAsRead = async (id: string): Promise<{ success: true }> => {
  await delay(200);
  const notice = notices.find(n => n.id === id);
  if (notice) {
    notice.isRead = true;
  }
  return { success: true };
};

export const noticeHandlers = {
  handleGetNotices,
  handleGetNotice,
  handleCreateNotice,
  handleUpdateNotice,
  handleDeleteNotice,
  handleMarkAsRead
};
