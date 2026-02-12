import { useState, useCallback } from 'react';
import axios from 'axios';
import type { PaymentTransaction, StudentFeeRecord } from '../types';

export const usePayment = () => {
  const [ledger, setLedger] = useState<StudentFeeRecord | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLedger = useCallback(async (studentId: string) => {
    setIsProcessing(true);
    try {
      const res = await axios.get(`/api/finance/ledger/${studentId}`);
      // The mock returns { summary, records }, we just want the first record for this simple view
      if (res.data.records && res.data.records.length > 0) {
        setLedger(res.data.records[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch ledger');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (studentId: string) => {
    try {
      const res = await axios.get(`/api/finance/transactions/${studentId}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      // Non-blocking error
    }
  }, []);

  const initiatePayment = async (
    studentId: string, 
    amount: number, 
    method: 'UPI' | 'Card', 
    mockTxnId?: string // For mock gateway integration
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      // 1. Simulate API Call to Create Order (in real world)
      // 2. Mock Gateway handles the UI interaction (handled by component)
      // 3. This function is called AFTER success to record it in backend
      
      const payload: Partial<PaymentTransaction> = {
        studentId,
        amount,
        paymentMethod: method,
        paymentGatewayRefId: mockTxnId || `ref_${Date.now()}`,
        status: 'Success',
        breakdown: [{ category: 'Tuition', amount }] // Simplified for demo
      };

      const res = await axios.post('/api/finance/transactions', payload);
      
      // Update local state
      setTransactions(prev => [res.data, ...prev]);
      
      // Refresh ledger
      await fetchLedger(studentId);
      
      return res.data;
    } catch (err) {
      setError('Payment recording failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * T052: Webhook Simulation
   * In a real app, the server receives the webhook. 
   * Here we simulate checking the server for updates.
   */
  const checkPaymentStatus = async (_txnId: string) => {
    // Determine status from server
    // For mock, we assume it's settled.
    return 'Success';
  };

  return {
    ledger,
    transactions,
    isProcessing,
    error,
    fetchLedger,
    fetchTransactions,
    initiatePayment,
    checkPaymentStatus
  };
};
