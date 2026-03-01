import { dashboardApi } from '../../../api/instances';
import { apiClient } from '../../../services/api/client';
import type { DashboardStatsResponse, GrowthData, GenderData, StarStudent, ActivityFeed } from '../types/dashboard.types';

export type { DashboardStatsResponse, GrowthData, GenderData, StarStudent, ActivityFeed };

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const response = await dashboardApi.getDashboardStats();
  return response.data as unknown as DashboardStatsResponse;
}

export async function getGrowthData(duration: string): Promise<GrowthData[]> {
  const response = await apiClient.get(`/api/dashboard/growth?duration=${duration}`);
  return response.data;
}

export async function getGenderDistribution(): Promise<GenderData> {
  const response = await apiClient.get(`/api/dashboard/gender-distribution`);
  return response.data;
}

export async function getStarStudents(): Promise<StarStudent[]> {
  const response = await apiClient.get(`/api/dashboard/star-students`);
  return response.data;
}

export async function getActivityFeed(): Promise<ActivityFeed[]> {
  const response = await apiClient.get(`/api/dashboard/activity-feed`);
  return response.data;
}
