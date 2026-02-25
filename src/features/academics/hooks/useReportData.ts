import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { useMarks } from './useMarks';
import { usePayment } from '../../finance/hooks/usePayment';
import { type Student } from '../../students/types/student.types';

export type ReportCategory = 'Academic' | 'Finance' | 'Certificates';

export interface UseReportDataProps {
    category: ReportCategory;
    reportType: string;
    studentId?: string;
    examTermId?: string;
}

export const useReportData = ({ category, reportType, studentId, examTermId }: UseReportDataProps) => {
    // 1. Fetch Student Profile (Always needed for certificates and personalization)
    const { data: student, isLoading: loadingStudent } = useQuery<Student>({
        queryKey: ['student', studentId],
        queryFn: async () => {
            if (!studentId) throw new Error('Student ID is required');
            const res = await apiClient.get<any>(`/api/academics/students/${studentId}`);
            return res.data;
        },
        enabled: !!studentId,
    });

    // 2. Academic Data
    const { marks, isLoading: loadingMarks } = useMarks({
        studentId: studentId || '',
        examTermId: examTermId || '',
    });

    // 3. Finance Data
    const { ledger, transactions, fetchLedger, fetchTransactions, isProcessing: loadingFinance } = usePayment();

    // Unified Loading State
    const isLoading = useMemo(() => {
        if (category === 'Academic') return loadingStudent || loadingMarks;
        if (category === 'Finance') return loadingStudent || loadingFinance;
        if (category === 'Certificates') return loadingStudent;
        return false;
    }, [category, loadingStudent, loadingMarks, loadingFinance]);

    return {
        student,
        academic: {
            marks,
        },
        finance: {
            ledger,
            transactions,
            fetchLedger,
            fetchTransactions,
        },
        isLoading,
    };
};
