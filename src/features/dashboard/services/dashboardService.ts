import apiClient from '../../../services/api/client';
import API_CONFIG from '../../../services/api/config';
import { handleGetDashboardStats } from '../../../mocks/handlers/dashboardHandlers';
import type { DashboardStatsResponse } from '../../../mocks/handlers/dashboardHandlers';

export type { DashboardStatsResponse };

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  if (API_CONFIG.USE_MOCK_API) {
    return handleGetDashboardStats();
  }

  const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats');
  return response.data;
}
