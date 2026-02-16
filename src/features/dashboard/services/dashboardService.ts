import apiClient from '../../../services/api/client';
import type { DashboardStatsResponse } from '../types/dashboard.types';

export type { DashboardStatsResponse };

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats');
  return response.data;
}
