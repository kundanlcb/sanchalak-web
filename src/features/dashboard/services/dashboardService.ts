import { dashboardApi } from '../../../api/instances';
import type { DashboardStatsResponse } from '../types/dashboard.types';

export type { DashboardStatsResponse };

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const response = await dashboardApi.getDashboardStats();
  // The generated API returns 'object', so we cast it to our expected type
  return response.data as unknown as DashboardStatsResponse;
}
