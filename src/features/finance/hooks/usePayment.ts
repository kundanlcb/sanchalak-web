/**
 * Payment Hook — TanStack Query powered
 * Fetches student ledger/transactions and processes payments.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import type { PaymentTransaction, StudentFeeRecord } from '../types';

export const usePayment = () => {
  const queryClient = useQueryClient();

  // --- Fetch ledger for a student ---
  const fetchLedgerMutation = useMutation({
    mutationKey: ['payment', 'fetchLedger'],
    mutationFn: async (studentId: string) => {
      const res = await apiClient.get<StudentFeeRecord>(`/api/finance/ledger/${studentId}`);
      if (res.data.records && res.data.records.length > 0) {
        return res.data.records[0] as StudentFeeRecord;
      }
      return null;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['payment', 'ledger'], data);
    },
  });

  // --- Fetch transactions for a student ---
  const fetchTransactionsMutation = useMutation({
    mutationKey: ['payment', 'fetchTransactions'],
    mutationFn: async (studentId: string) => {
      const res = await apiClient.get<PaymentTransaction[]>(`/api/finance/transactions/${studentId}`);
      return res.data as PaymentTransaction[];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['payment', 'transactions'], data);
    },
  });

  // --- Initiate payment ---
  const paymentMutation = useMutation({
    mutationKey: ['payment', 'process'],
    mutationFn: async ({
      studentId,
      amount,
      method,
      mockTxnId,
    }: {
      studentId: string;
      amount: number;
      method: 'UPI' | 'Card';
      mockTxnId?: string;
    }) => {
      const payload: Partial<PaymentTransaction> = {
        studentId,
        amount,
        paymentMethod: method,
        paymentGatewayRefId: mockTxnId || `ref_${Date.now()}`,
        status: 'Success',
        breakdown: [{ category: 'Tuition', amount }],
      };
      const res = await apiClient.post<PaymentTransaction>('/api/finance/transactions', payload);
      return res.data as PaymentTransaction;
    },
    onSuccess: (newTxn) => {
      queryClient.setQueryData<PaymentTransaction[]>(['payment', 'transactions'], (old) =>
        [newTxn, ...(old ?? [])],
      );
      queryClient.invalidateQueries({ queryKey: ['payment', 'ledger'] });
      queryClient.invalidateQueries({ queryKey: ['finance'] });
    },
  });

  const checkPaymentStatus = async (_txnId: string) => 'Success';

  return {
    ledger: (queryClient.getQueryData(['payment', 'ledger']) as StudentFeeRecord | null) ?? null,
    transactions: (queryClient.getQueryData(['payment', 'transactions']) as PaymentTransaction[]) ?? [],
    isProcessing: fetchLedgerMutation.isPending || paymentMutation.isPending,
    error: fetchLedgerMutation.error?.message ?? paymentMutation.error?.message ?? null,
    fetchLedger: fetchLedgerMutation.mutateAsync,
    fetchTransactions: fetchTransactionsMutation.mutateAsync,
    initiatePayment: (studentId: string, amount: number, method: 'UPI' | 'Card', mockTxnId?: string) =>
      paymentMutation.mutateAsync({ studentId, amount, method, mockTxnId }),
    checkPaymentStatus,
  };
};
