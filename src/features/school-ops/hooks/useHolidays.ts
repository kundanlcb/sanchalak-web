import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { holidayApi } from '../services/holidayApi';
import type { CreateHolidayRequest } from '../types/holiday';

export const useHolidays = (academicYear: string = '2024-2025') => {
    const queryClient = useQueryClient();

    const { data: holidays = [], isLoading, error } = useQuery({
        queryKey: ['holidays', academicYear],
        queryFn: () => holidayApi.getHolidays(academicYear),
    });

    const createMutation = useMutation({
        mutationFn: holidayApi.createHoliday,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['holidays'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreateHolidayRequest }) =>
            holidayApi.updateHoliday(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['holidays'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: holidayApi.deleteHoliday,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['holidays'] });
        }
    });

    return {
        holidays,
        isLoading,
        error,
        createHoliday: createMutation.mutateAsync,
        updateHoliday: updateMutation.mutateAsync,
        deleteHoliday: deleteMutation.mutateAsync,
    };
};
