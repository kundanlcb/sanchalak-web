import client from '../../../services/api/client';
import type { LeaveType } from '../types/leavePolicy';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveRequest {
    id: number;
    requesterId: number;
    requesterName?: string;
    leaveType: Partial<LeaveType>;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    reason: string;
    attachmentUrl?: string;
    status: LeaveStatus;
    approverId?: number;
    approverComments?: string;
    actionedAt?: string;
    createdAt: string;
}

export interface LeaveActionRequest {
    status: 'APPROVED' | 'REJECTED';
    comments: string;
}

export const leaveRequestApi = {
    applyLeave: async (data: Partial<LeaveRequest>): Promise<LeaveRequest> => {
        const response = await client.post<LeaveRequest>('/api/hr/leaves/apply', data);
        return response.data;
    },

    getMyRequests: async (): Promise<LeaveRequest[]> => {
        const response = await client.get<LeaveRequest[]>('/api/hr/leaves/my');
        return response.data;
    },

    getPendingRequests: async (): Promise<LeaveRequest[]> => {
        const response = await client.get<LeaveRequest[]>('/api/hr/leaves/pending');
        return response.data;
    },

    processRequest: async (id: number, action: LeaveActionRequest): Promise<LeaveRequest> => {
        const response = await client.put<LeaveRequest>(`/api/hr/leaves/${id}/process`, action);
        return response.data;
    },

    cancelRequest: async (id: number): Promise<void> => {
        await client.delete(`/api/hr/leaves/${id}/cancel`);
    }
};
