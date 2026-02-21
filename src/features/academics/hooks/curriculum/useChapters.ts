import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../services/api/client';
import { type SubjectChapter, type CreateSubjectChapterRequest } from '../../types/curriculum';

export const useChapters = (classId?: string, subjectId?: string) => {
    const queryClient = useQueryClient();
    const queryKey = ['chapters', classId, subjectId];

    const { data: chapters = [], isLoading, error } = useQuery<SubjectChapter[]>({
        queryKey,
        queryFn: async () => {
            if (!classId || !subjectId) return [];
            const response = await apiClient.get<any[]>(`/api/curriculum/chapters?classId=${classId}&subjectId=${subjectId}`);
            return response.data.map(item => ({
                ...item,
                id: String(item.id),
                classId: String(item.classId),
                subjectId: String(item.subjectId)
            }));
        },
        enabled: !!classId && !!subjectId,
    });

    const createChapter = useMutation({
        mutationFn: async (data: CreateSubjectChapterRequest) => {
            const response = await apiClient.post('/api/curriculum/chapters', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapters'] });
        },
    });

    const deleteChapter = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/api/curriculum/chapters/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapters'] });
        },
    });

    return {
        chapters,
        isLoading,
        error,
        createChapter: createChapter.mutateAsync,
        isCreating: createChapter.isPending,
        deleteChapter: deleteChapter.mutateAsync,
    };
};
