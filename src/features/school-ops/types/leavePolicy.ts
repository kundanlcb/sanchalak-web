export interface LeaveType {
    id: number;
    name: string;
    isPaid: boolean;
    defaultAnnualQuota: number;
    applicableRoles: string[];
    requiresDocumentUpload: boolean;
}

export type CreateLeaveTypeRequest = Omit<LeaveType, 'id'>;

export interface LeaveBalance {
    id: number;
    targetUserId: number;
    leaveType: LeaveType;
    academicYear: string;
    totalGranted: number;
    totalUsed: number;
    balance: number;
}
