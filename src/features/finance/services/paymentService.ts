import { apiClient } from '../../../services/api/client';

export interface PaymentRequest {
    studentId: number;
    amount: number;
    paymentMethod: string;
    transactionReference?: string;
    categoryId?: number;
    monthLabel?: string;
}

export interface PaymentTransactionResponse {
    id: number;
    studentId: number;
    schoolId: string;
    receiptNo: string;
    amountPaid: number;
    paymentMethod: string;
    transactionReference: string;
    paymentDate: string;  // ISO string
}

export const paymentService = {
    /** Record a new payment transaction */
    recordPayment: async (request: PaymentRequest): Promise<PaymentTransactionResponse> => {
        const response = await apiClient.post<PaymentTransactionResponse>('/api/finance/transactions', request);
        return response.data;
    },

    /** Download a receipt PDF */
    downloadReceipt: async (receiptNo: string): Promise<Blob> => {
        const response = await apiClient.get(`/api/finance/receipts/${receiptNo}`, {
            responseType: 'blob'
        });
        return response.data as Blob;
    }
};
