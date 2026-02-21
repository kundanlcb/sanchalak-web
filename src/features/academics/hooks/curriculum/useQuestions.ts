import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../services/api/client';
import { type Question, type CreateQuestionRequest } from '../../types/curriculum';

export const useQuestions = (chapterId?: string) => {
    const queryClient = useQueryClient();
    const queryKey = ['chapter_questions', chapterId];

    const { data: questions = [], isLoading } = useQuery<Question[]>({
        queryKey,
        queryFn: async () => {
            if (!chapterId) return [];
            const response = await apiClient.get<any[]>(`/api/curriculum/chapters/${chapterId}/questions`);
            return response.data.map(item => ({
                ...item,
                id: String(item.id),
                chapterId: String(item.chapterId),
                options: item.options?.map((o: any) => ({
                    ...o,
                    id: String(o.id)
                }))
            }));
        },
        enabled: !!chapterId,
    });

    const addQuestion = useMutation({
        mutationFn: async (data: CreateQuestionRequest) => {
            const response = await apiClient.post(`/api/curriculum/chapters/${chapterId}/questions`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapter_questions', chapterId] });
        },
    });

    const deleteQuestion = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/api/curriculum/questions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapter_questions', chapterId] });
        },
    });

    return {
        questions,
        isLoading,
        addQuestion: addQuestion.mutateAsync,
        isAdding: addQuestion.isPending,
        deleteQuestion: deleteQuestion.mutateAsync,
    };
};
