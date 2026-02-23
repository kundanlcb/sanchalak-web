import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveRequestApi, type LeaveActionRequest } from '../services/leaveRequestApi';

export const useLeaveRequests = () => {
    const queryClient = useQueryClient();

    const myRequestsQuery = useQuery({
        queryKey: ['myLeaveRequests'],
        queryFn: leaveRequestApi.getMyRequests,
    });

    const pendingRequestsQuery = useQuery({
        queryKey: ['pendingLeaveRequests'],
        queryFn: leaveRequestApi.getPendingRequests,
    });

    const applyMutation = useMutation({
        mutationFn: leaveRequestApi.applyLeave,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myLeaveRequests'] });
        }
    });

    const processMutation = useMutation({
        mutationFn: ({ id, action }: { id: number; action: LeaveActionRequest }) =>
            leaveRequestApi.processRequest(id, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingLeaveRequests'] });
            queryClient.invalidateQueries({ queryKey: ['myLeaveRequests'] });
            queryClient.invalidateQueries({ queryKey: ['leaveBalances'] }); // Balances change on approval
        }
    });

    const cancelMutation = useMutation({
        mutationFn: leaveRequestApi.cancelRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myLeaveRequests'] });
            queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
        }
    });

    return {
        myRequests: myRequestsQuery.data || [],
        pendingRequests: pendingRequestsQuery.data || [],
        isLoadingMy: myRequestsQuery.isLoading,
        isLoadingPending: pendingRequestsQuery.isLoading,
        applyLeave: applyMutation.mutateAsync,
        processRequest: processMutation.mutateAsync,
        cancelRequest: cancelMutation.mutateAsync,
    };
};
