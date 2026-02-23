import React, { useState } from 'react';
import { useLeaveRequests } from '../hooks/useLeaveRequests';
import { ApplyLeaveModal } from '../components/ApplyLeaveModal';
import {
    CheckCircle2, XCircle, Clock, Calendar,
    User, ClipboardList, FileText,
    BadgeCheck
} from 'lucide-react';

export const LeaveApprovalPage: React.FC = () => {
    const { pendingRequests, processRequest, isLoadingPending, applyLeave } = useLeaveRequests();
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleAction = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        const comments = window.prompt(`Enter comments for ${status.toLowerCase()}:`);
        if (comments === null) return;

        try {
            setProcessingId(id);
            await processRequest({ id, action: { status, comments } });
            alert(`Request ${status.toLowerCase()} successfully.`);
        } catch (err) {
            console.error('Failed to process request', err);
            alert('Failed to process request.');
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoadingPending) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-orange-500" />
                        Leave Approvals
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Review and action pending leave applications from teachers and staff.
                    </p>
                </div>
                <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    Test Apply
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {pendingRequests.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-gray-700">
                        <BadgeCheck className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No pending leave requests found.</p>
                    </div>
                ) : (
                    pendingRequests.map((request) => (
                        <div key={request.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                                                {request.requesterName || `Teacher #${request.requesterId}`}
                                            </h3>
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                                                {request.leaveType.name}
                                            </span>
                                            {request.isHalfDay && (
                                                <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                                                    Half Day
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {request.startDate}
                                                {!request.isHalfDay && request.endDate !== request.startDate && (
                                                    <> — {request.endDate}</>
                                                )}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Applied: {request.createdAt}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 bg-gray-50 dark:bg-gray-750 p-3 rounded-lg border border-gray-100 dark:border-gray-700 italic">
                                            "{request.reason}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col justify-end gap-3 shrink-0">
                                    <button
                                        onClick={() => handleAction(request.id, 'APPROVED')}
                                        disabled={processingId === request.id}
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold shadow-sm"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(request.id, 'REJECTED')}
                                        disabled={processingId === request.id}
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors font-semibold"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ApplyLeaveModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                onApply={async (data) => {
                    try {
                        await applyLeave(data);
                        alert('Leave applied successfully for testing.');
                    } catch (err) {
                        console.error('Failed to apply leave', err);
                        alert('Failed to apply leave.');
                    }
                }}
            />
        </div>
    );
};
