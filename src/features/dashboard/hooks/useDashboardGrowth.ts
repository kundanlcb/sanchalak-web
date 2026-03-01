import { useQuery } from '@tanstack/react-query';
import { getGrowthData } from '../services/dashboardService';
import type { GrowthData } from '../types/dashboard.types';

export const useDashboardGrowth = (duration: string) => {
    const { data, isLoading, error, refetch } = useQuery<GrowthData[]>({
        queryKey: ['dashboard', 'growth', duration],
        queryFn: () => getGrowthData(duration),
        staleTime: 5 * 60 * 1000,
    });

    return {
        data: data ?? [],
        loading: isLoading,
        error: error?.message ?? null,
        refetch,
    };
};
