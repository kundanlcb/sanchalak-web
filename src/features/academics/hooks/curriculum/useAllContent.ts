/**
 * useAllContent — Fetch all chapter content with optional filters + pagination
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../services/api/client';
import { type ChapterContent, type CreateChapterContentRequest } from '../../types/curriculum';

interface ContentFilters {
    classId?: string;
    subjectId?: string;
    chapterId?: string;
    contentType?: string;
    page?: number;
    size?: number;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;   // 0-based page index from Spring
    size: number;
    first: boolean;
    last: boolean;
}

export const useAllContent = (filters: ContentFilters = {}) => {
    const queryClient = useQueryClient();
    const page = filters.page ?? 1;
    const size = filters.size ?? 20;

    const queryKey = ['allContent', filters.classId, filters.subjectId, filters.chapterId, filters.contentType, page, size];

    const { data, isLoading, error } = useQuery<PageResponse<ChapterContent>>({
        queryKey,
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.classId) params.set('classId', filters.classId);
            if (filters.subjectId) params.set('subjectId', filters.subjectId);
            if (filters.chapterId) params.set('chapterId', filters.chapterId);
            if (filters.contentType) params.set('contentType', filters.contentType);
            params.set('page', String(page));
            params.set('size', String(size));

            const url = `/api/curriculum/content?${params.toString()}`;
            const response = await apiClient.get<PageResponse<ChapterContent>>(url);
            // Normalize IDs to strings
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

    const createContent = useMutation({
        mutationFn: async (contentData: CreateChapterContentRequest & { chapterId: string }) => {
            const response = await apiClient.post(`/api/curriculum/chapters/${contentData.chapterId}/content`, {
                title: contentData.title,
                contentType: contentData.contentType,
                contentData: contentData.contentData,
                sequenceOrder: contentData.sequenceOrder,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allContent'] });
        },
    });

    const deleteContent = useMutation({
        mutationFn: async ({ contentId }: { chapterId: string; contentId: string }) => {
            await apiClient.delete(`/api/curriculum/content/${contentId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allContent'] });
        },
    });

    return {
        contents: data?.content ?? [],
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        currentPage: (data?.number ?? 0) + 1, // Convert 0-based to 1-based
        isLoading,
        error,
        createContent: createContent.mutateAsync,
        isCreating: createContent.isPending,
        deleteContent: deleteContent.mutateAsync,
    };
};
