export type HolidayType = 'NATIONAL' | 'REGIONAL' | 'INSTITUTIONAL';

export interface Holiday {
    id: number;
    tenantId?: string;
    name: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    type: HolidayType;
    applicableToStudents: boolean;
    applicableToStaff: boolean;
    academicYear: string;
}

export type CreateHolidayRequest = Omit<Holiday, 'id' | 'tenantId'>;
