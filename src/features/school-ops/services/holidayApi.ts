import client from '../../../services/api/client';
import type { Holiday, CreateHolidayRequest } from '../types/holiday';

export const holidayApi = {
    getHolidays: async (academicYear: string = '2024-2025'): Promise<Holiday[]> => {
        const response = await client.get<Holiday[]>('/api/academics/holidays', {
            params: { academicYear }
        });
        return response.data;
    },

    createHoliday: async (data: CreateHolidayRequest): Promise<Holiday> => {
        const response = await client.post<Holiday>('/api/academics/holidays', data);
        return response.data;
    },

    updateHoliday: async (id: number, data: CreateHolidayRequest): Promise<Holiday> => {
        const response = await client.put<Holiday>(`/api/academics/holidays/${id}`, data);
        return response.data;
    },

    deleteHoliday: async (id: number): Promise<void> => {
        await client.delete(`/api/academics/holidays/${id}`);
    }
};
