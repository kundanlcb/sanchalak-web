/**
 * Fee Demand Bill Service — API calls for generating monthly demand bills.
 */

import { apiClient } from '../../../services/api/client';

export interface DemandBillLineItem {
    categoryName: string;
    amount: number;
}

export interface BackDueBreakdown {
    label: string;
    period: string;
    amount: number;
}

export interface DemandBillRequest {
    monthLabel: string;
    classId?: number | null;
    backDues?: number;
    lineItems: DemandBillLineItem[];
    backDueBreakdown?: BackDueBreakdown[];
}

export interface DemandBillLineItemResponse {
    categoryName: string;
    monthsUpto: string;
    amount: number;
    isBackDue: boolean;
}

export interface DemandBillPreviewItem {
    studentId: number;
    studentName: string;
    fatherName: string;
    className: string;
    rollNo: string;
    admissionNumber: string;
    billNo: string;
    billDate: string;
    monthLabel: string;
    lineItems: DemandBillLineItemResponse[];
    totalCurrentFees: number;
    totalBackDues: number;
    grandTotal: number;
}

export const demandBillService = {
    /**
     * Preview bills without saving to DB.
     */
    preview: async (request: DemandBillRequest): Promise<DemandBillPreviewItem[]> => {
        const res = await apiClient.post<DemandBillPreviewItem[]>(
            '/api/fees/demand-bill/preview',
            request
        );
        return res.data;
    },

    /**
     * Generate bills, save to DB, and download PDF.
     * Returns a Blob to trigger file download.
     */
    generatePdf: async (request: DemandBillRequest): Promise<Blob> => {
        const res = await apiClient.post('/api/fees/demand-bill/generate', request, {
            responseType: 'blob',
        });
        return res.data as Blob;
    },

    /**
     * Get bill history for a student.
     */
    getStudentHistory: async (studentId: number): Promise<DemandBillPreviewItem[]> => {
        const res = await apiClient.get<DemandBillPreviewItem[]>(
            `/api/fees/demand-bill/student/${studentId}`
        );
        return res.data;
    },
};
