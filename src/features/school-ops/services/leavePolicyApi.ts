import client from '../../../services/api/client';
import type { LeaveType, CreateLeaveTypeRequest, LeaveBalance } from '../types/leavePolicy';

export const leavePolicyApi = {
    getLeaveTypes: async (): Promise<LeaveType[]> => {
        const response = await client.get<LeaveType[]>('/api/hr/leave-policies/types');
        return response.data;
    },

    createLeaveType: async (data: CreateLeaveTypeRequest): Promise<LeaveType> => {
        const response = await client.post<LeaveType>('/api/hr/leave-policies/types', data);
        return response.data;
    },

    updateLeaveType: async (id: number, data: CreateLeaveTypeRequest): Promise<LeaveType> => {
        const response = await client.put<LeaveType>(`/api/hr/leave-policies/types/${id}`, data);
        return response.data;
    },

    deleteLeaveType: async (id: number): Promise<void> => {
        await client.delete(`/api/hr/leave-policies/types/${id}`);
    },

    initializeBalances: async (academicYear: string = '2024-2025'): Promise<void> => {
        await client.post('/api/hr/leave-policies/initialize-balances', null, {
            params: { academicYear }
        });
    },

    getLeaveBalances: async (userId: number, academicYear: string = '2024-2025'): Promise<LeaveBalance[]> => {
        const response = await client.get<LeaveBalance[]>(`/api/hr/leave-policies/balances/${userId}`, {
            params: { academicYear }
        });
        return response.data;
    }
};
