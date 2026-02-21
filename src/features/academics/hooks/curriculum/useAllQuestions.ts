/**
 * useAllQuestions — Fetch all questions with optional filters + pagination
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../services/api/client';
import { type Question, type CreateQuestionRequest } from '../../types/curriculum';
import type { PageResponse } from './useAllContent';

interface QuestionFilters {
    classId?: string;
    subjectId?: string;
    chapterId?: string;
    page?: number;
    size?: number;
}

export const useAllQuestions = (filters: QuestionFilters = {}) => {
    const queryClient = useQueryClient();
    const page = filters.page ?? 1;
    const size = filters.size ?? 20;

    const queryKey = ['allQuestions', filters.classId, filters.subjectId, filters.chapterId, page, size];

    const { data, isLoading, error } = useQuery<PageResponse<Question>>({
        queryKey,
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.classId) params.set('classId', filters.classId);
            if (filters.subjectId) params.set('subjectId', filters.subjectId);
            if (filters.chapterId) params.set('chapterId', filters.chapterId);
            params.set('page', String(page));
            params.set('size', String(size));

            const url = `/api/curriculum/questions?${params.toString()}`;
            const response = await apiClient.get<PageResponse<Question>>(url);
            return {
                ...response.data,
                content: response.data.content.map(item => ({
                    ...item,
                    id: String(item.id),
                    chapterId: String(item.chapterId),
                })),
            };
        },
        staleTime: 5 * 60 * 1000,
    });

    const createQuestion = useMutation({
        mutationFn: async (questionData: CreateQuestionRequest & { chapterId: string }) => {
            const response = await apiClient.post(`/api/curriculum/chapters/${questionData.chapterId}/questions`, {
                questionText: questionData.questionText,
                questionType: questionData.questionType,
                marks: questionData.marks,
                options: questionData.options,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allQuestions'] });
        },
    });

    const deleteQuestion = useMutation({
        mutationFn: async ({ questionId }: { chapterId: string; questionId: string }) => {
            await apiClient.delete(`/api/curriculum/questions/${questionId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allQuestions'] });
        },
    });

    return {
        questions: data?.content ?? [],
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        currentPage: (data?.number ?? 0) + 1,
        isLoading,
        error,
        createQuestion: createQuestion.mutateAsync,
        isCreating: createQuestion.isPending,
        deleteQuestion: deleteQuestion.mutateAsync,
    };
};
