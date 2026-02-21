import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { type ExamSchedule, type CreateExamScheduleRequest } from '../types';

interface UseExamSchedulesFilters {
    examTermId?: string;
    classId?: string;
}

export const useExamSchedules = (filters: UseExamSchedulesFilters) => {
    const queryClient = useQueryClient();
    const queryKey = ['examSchedules', filters];

    const { data: schedules = [], isLoading, error, refetch } = useQuery<ExamSchedule[]>({
        queryKey,
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.examTermId) params.append('examTermId', filters.examTermId);
            if (filters.classId) params.append('classId', filters.classId);

            const response = await apiClient.get<any[]>(`/api/academic/schedules?${params.toString()}`);
            return response.data.map((item: any) => ({
                id: String(item.id),
                examTermId: String(item.examTerm?.id),
                classId: String(item.studentClass?.id),
                subjectId: String(item.subject?.id),
                examDate: item.examDate,
                maxMarks: item.maxMarks,
            }));
        },
        enabled: !!filters.examTermId && !!filters.classId,
        staleTime: 5 * 60 * 1000,
    });

    const saveScheduleMutation = useMutation({
        mutationKey: ['examSchedules', 'save'],
        mutationFn: async (data: CreateExamScheduleRequest) => {
            const response = await apiClient.post('/api/academic/schedules', data);
            return response.data;
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        schedules,
        isLoading,
        error,
        saveSchedule: saveScheduleMutation.mutateAsync,
        isSaving: saveScheduleMutation.isPending,
        refetch,
    };
};
