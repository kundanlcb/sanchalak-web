/**
 * useExamQuestions — CRUD for exam question papers
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { type ExamQuestion } from '../types';

interface ExamQuestionRequest {
    questionId: string;
    marks: number;
    sequenceOrder?: number;
}

export const useExamQuestions = (scheduleId: string | undefined) => {
    const queryClient = useQueryClient();
    const queryKey = ['examQuestions', scheduleId];

    const { data: examQuestions = [], isLoading, error } = useQuery<ExamQuestion[]>({
        queryKey,
        queryFn: async () => {
            if (!scheduleId) return [];
            const response = await apiClient.get<ExamQuestion[]>(`/api/academic/schedules/${scheduleId}/questions`);
            return response.data;
        },
        enabled: !!scheduleId,
        staleTime: 5 * 60 * 1000,
    });

    const addQuestion = useMutation({
        mutationFn: async (data: ExamQuestionRequest) => {
            const response = await apiClient.post(`/api/academic/schedules/${scheduleId}/questions`, data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });

    const setQuestions = useMutation({
        mutationFn: async (data: ExamQuestionRequest[]) => {
            const response = await apiClient.put(`/api/academic/schedules/${scheduleId}/questions`, data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });

    const removeQuestion = useMutation({
        mutationFn: async (examQuestionId: string) => {
            await apiClient.delete(`/api/academic/schedules/${scheduleId}/questions/${examQuestionId}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });

    const totalMarks = examQuestions.reduce((sum, eq) => sum + eq.marks, 0);

    return {
        examQuestions,
        totalMarks,
        isLoading,
        error,
        addQuestion: addQuestion.mutateAsync,
        setQuestions: setQuestions.mutateAsync,
        removeQuestion: removeQuestion.mutateAsync,
        isAdding: addQuestion.isPending,
    };
};
