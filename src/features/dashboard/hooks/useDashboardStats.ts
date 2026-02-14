/**
 * Dashboard Stats Hook — TanStack Query powered
 * Fetches dashboard statistics with caching and offline support.
 */

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../services/dashboardService';
import type { DashboardStatsResponse } from '../services/dashboardService';

export const useDashboardStats = () => {
  const { data, isLoading, error, refetch } = useQuery<DashboardStatsResponse>({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 min — dashboard data changes frequently
  });

  return {
    stats: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
};
