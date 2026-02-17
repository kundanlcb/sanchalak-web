/**
 * Financial Reports Hook — TanStack Query powered
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import type { PaymentTransaction } from '../../finance/types';

export interface Defaulter {
    id: string;
    studentName: string;
    studentId: string;
    grade: string;
    amountDue: number;
    daysOverdue: number;
}

export const useFinancialReports = () => {
    const transactionsQuery = useQuery<PaymentTransaction[]>({
        queryKey: ['finance', 'transactions'],
        queryFn: async () => {
            const res = await apiClient.get<PaymentTransaction[]>('/api/finance/transactions');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const defaultersQuery = useQuery<Defaulter[]>({
        queryKey: ['finance', 'defaulters'],
        queryFn: async () => {
            const res = await apiClient.get<Defaulter[]>('/api/finance/defaulters');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    return {
        transactions: transactionsQuery.data ?? [],
        defaulters: defaultersQuery.data ?? [],
        isLoading: transactionsQuery.isLoading || defaultersQuery.isLoading,
    };
};
