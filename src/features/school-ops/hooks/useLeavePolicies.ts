import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leavePolicyApi } from '../services/leavePolicyApi';
import type { CreateLeaveTypeRequest } from '../types/leavePolicy';

export const useLeavePolicies = () => {
    const queryClient = useQueryClient();

    const { data: leaveTypes = [], isLoading, error } = useQuery({
        queryKey: ['leaveTypes'],
        queryFn: leavePolicyApi.getLeaveTypes,
    });

    const createMutation = useMutation({
        mutationFn: leavePolicyApi.createLeaveType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreateLeaveTypeRequest }) =>
            leavePolicyApi.updateLeaveType(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: leavePolicyApi.deleteLeaveType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
        }
    });

    const initializeMutation = useMutation({
        mutationFn: leavePolicyApi.initializeBalances,
        onSuccess: () => {
            // Could invalidate active leave balances, but typically called from Admin settings.
        }
    });

    return {
        leaveTypes,
        isLoading,
        error,
        createLeaveType: createMutation.mutateAsync,
        updateLeaveType: updateMutation.mutateAsync,
        deleteLeaveType: deleteMutation.mutateAsync,
        initializeBalances: initializeMutation.mutateAsync,
    };
};

export const useLeaveBalances = (userId: number, academicYear: string = '2024-2025') => {
    const { data: balances = [], isLoading, error } = useQuery({
        queryKey: ['leaveBalances', userId, academicYear],
        queryFn: () => leavePolicyApi.getLeaveBalances(userId, academicYear),
        enabled: !!userId,
    });

    return { balances, isLoading, error };
};
