import { useQuery } from '@tanstack/react-query';
import { getGenderDistribution } from '../services/dashboardService';
import type { GenderData } from '../types/dashboard.types';

export const useDashboardGender = () => {
    const { data, isLoading, error, refetch } = useQuery<GenderData>({
        queryKey: ['dashboard', 'gender-distribution'],
        queryFn: getGenderDistribution,
        staleTime: 5 * 60 * 1000,
    });

    return {
        data: data,
        loading: isLoading,
        error: error?.message ?? null,
        refetch,
    };
};
