import { useQuery } from '@tanstack/react-query';
import { getActivityFeed } from '../services/dashboardService';
import type { ActivityFeed } from '../types/dashboard.types';

export const useDashboardActivity = () => {
    const { data, isLoading, error, refetch } = useQuery<ActivityFeed[]>({
        queryKey: ['dashboard', 'activity-feed'],
        queryFn: getActivityFeed,
        staleTime: 2 * 60 * 1000,
    });

    return {
        activities: data ?? [],
        loading: isLoading,
        error: error?.message ?? null,
        refetch,
    };
};
