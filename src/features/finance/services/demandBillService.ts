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
    studentId?: number | null;   // set for single-student bill generation
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
    /** Preview bill data (no PDF, no DB save). */
    preview: async (request: DemandBillRequest): Promise<DemandBillPreviewItem[]> => {
        const res = await apiClient.post<DemandBillPreviewItem[]>(
            '/api/fees/demand-bill/preview',
            request
        );
        return res.data;
    },

    /**
     * Preview as PDF in-memory (no DB save).
     * Returns a Blob for the PdfPreviewModal.
     */
    previewPdf: async (request: DemandBillRequest): Promise<Blob> => {
        const res = await apiClient.post('/api/fees/demand-bill/preview-pdf', request, {
            responseType: 'blob',
        });
        return res.data as Blob;
    },

    /**
     * Generate bills, save to DB, return PDF Blob for download.
     */
    generatePdf: async (request: DemandBillRequest): Promise<Blob> => {
        const res = await apiClient.post('/api/fees/demand-bill/generate', request, {
            responseType: 'blob',
        });
        return res.data as Blob;
    },

    /** Get bill history for a single student. */
    getStudentHistory: async (studentId: number): Promise<DemandBillPreviewItem[]> => {
        const res = await apiClient.get<DemandBillPreviewItem[]>(
            `/api/fees/demand-bill/student/${studentId}`
        );
        return res.data;
    },

    /** Get bill history for all students in a class. */
    getClassHistory: async (classId: number): Promise<DemandBillPreviewItem[]> => {
        const res = await apiClient.get<DemandBillPreviewItem[]>(
            `/api/fees/demand-bill/class/${classId}/history`
        );
        return res.data;
    },
};
