import { useState, useEffect } from 'react';
import axios from 'axios';
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
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [defaulters, setDefaulters] = useState<Defaulter[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                const [txnRes, defRes] = await Promise.all([
                    axios.get<PaymentTransaction[]>('/api/finance/transactions'),
                    axios.get<Defaulter[]>('/api/finance/defaulters')
                ]);
                
                setTransactions(txnRes.data);
                setDefaulters(defRes.data);
            } catch (error) {
                console.error("Failed to fetch financial reports", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, []);

    return { transactions, defaulters, isLoading };
};
