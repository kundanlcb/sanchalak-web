import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import type { DashboardStatsResponse } from '../services/dashboardService';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        if (mounted) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch dashboard stats:', err);
          setError('Failed to load dashboard statistics.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, loading, error };
};
