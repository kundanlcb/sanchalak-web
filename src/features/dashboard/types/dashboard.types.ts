export interface DashboardStatsResponse {
    students: number;
    teachers: number;
    classes: number;
    monthlyEarnings: number;
    attendance: number;
}

export interface GrowthData {
    name: string;
    collections: number;
    students: number;
}

export type GenderData = Record<string, number>;

export interface StarStudent {
    id: string;
    name: string;
    section: string;
    totalMarks: number;
    percentage: number;
}

export interface ActivityFeed {
    id: number;
    message: string;
    timestamp: string;
    type: string;
}
