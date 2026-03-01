import { useQuery } from '@tanstack/react-query';
import { getStarStudents } from '../services/dashboardService';
import type { StarStudent } from '../types/dashboard.types';

export const useDashboardStarStudents = () => {
    const { data, isLoading, error, refetch } = useQuery<StarStudent[]>({
        queryKey: ['dashboard', 'star-students'],
        queryFn: getStarStudents,
        staleTime: 5 * 60 * 1000,
    });

    return {
        students: data ?? [],
        loading: isLoading,
        error: error?.message ?? null,
        refetch,
    };
};
