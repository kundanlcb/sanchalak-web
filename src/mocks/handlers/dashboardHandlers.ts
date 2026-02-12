import { http, HttpResponse, delay } from 'msw';
import { db } from '../db';

export interface DashboardStatsResponse {
  students: number;
  teachers: number;
  classes: number;
  monthlyEarnings: number;
}

export async function handleGetDashboardStats(): Promise<DashboardStatsResponse> {
  await delay(500);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyEarnings = db.transactions
    .filter(t => {
      const d = new Date(t.timestamp);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.status === 'Success';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    students: db.students.filter(s => s.isActive).length,
    teachers: db.teachers.filter(t => t.isActive).length,
    classes: db.classes.length,
    monthlyEarnings
  };
}

export const dashboardHandlers = [
  http.get('/api/dashboard/stats', async () => {
    const stats = await handleGetDashboardStats();
    return HttpResponse.json(stats);
  })
];
