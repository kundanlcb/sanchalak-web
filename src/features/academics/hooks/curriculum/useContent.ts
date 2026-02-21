import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../services/api/client';
import { type ChapterContent, type CreateChapterContentRequest } from '../../types/curriculum';

export const useContent = (chapterId?: string) => {
    const queryClient = useQueryClient();
    const queryKey = ['chapter_content', chapterId];

    const { data: contents = [], isLoading } = useQuery<ChapterContent[]>({
        queryKey,
        queryFn: async () => {
            if (!chapterId) return [];
            const response = await apiClient.get<any[]>(`/api/curriculum/chapters/${chapterId}/content`);
            return response.data.map(item => ({
                ...item,
                id: String(item.id),
                chapterId: String(item.chapterId)
            }));
        },
        enabled: !!chapterId,
    });

    const addContent = useMutation({
        mutationFn: async (data: CreateChapterContentRequest) => {
            const response = await apiClient.post(`/api/curriculum/chapters/${chapterId}/content`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapter_content', chapterId] });
        },
    });

    const deleteContent = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/api/curriculum/content/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapter_content', chapterId] });
        },
    });

    return {
        contents,
        isLoading,
        addContent: addContent.mutateAsync,
        isAdding: addContent.isPending,
        deleteContent: deleteContent.mutateAsync,
    };
};
