import React, { useState } from 'react';
import { useLeavePolicies } from '../hooks/useLeavePolicies';
import { LeavePolicyModal } from '../components/LeavePolicyModal';
import type { LeaveType, CreateLeaveTypeRequest } from '../types/leavePolicy';
import { FileUser, Plus, Trash2, Edit2, AlertCircle, RefreshCw } from 'lucide-react';

export const LeavePolicyPage: React.FC = () => {
    const {
        leaveTypes, isLoading, error,
        createLeaveType, updateLeaveType, deleteLeaveType, initializeBalances
    } = useLeavePolicies();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<LeaveType | undefined>();
    const [isInitializing, setIsInitializing] = useState(false);

    const handleAdd = () => {
        setEditingPolicy(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (policy: LeaveType) => {
        setEditingPolicy(policy);
        setIsModalOpen(true);
    };

    const handleSave = async (data: CreateLeaveTypeRequest) => {
        try {
            if (editingPolicy) {
                await updateLeaveType({ id: editingPolicy.id, data });
            } else {
                await createLeaveType(data);
            }
        } catch (err) {
            console.error('Failed to save policy', err);
            alert('Failed to save leave policy. Please try again.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this leave policy? Balances tied to this may be affected.')) {
            try {
                await deleteLeaveType(id);
            } catch (err) {
                console.error('Failed to delete policy', err);
                alert('Failed to delete leave policy.');
            }
        }
    };

    const handleInitialize = async () => {
        if (window.confirm('This will initialize default leave balances for all active teachers for the current academic year. Proceed?')) {
            try {
                setIsInitializing(true);
                await initializeBalances('2024-2025');
                alert('Balances initialized successfully.');
            } catch (err) {
                console.error('Failed to initialize balances', err);
                alert('Failed to initialize balances.');
            } finally {
                setIsInitializing(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 border border-red-100 dark:border-red-800/30">
                <AlertCircle className="w-5 h-5" />
                Failed to load leave policies. Please try again later.
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <FileUser className="w-6 h-6 text-blue-500" />
                        Leave Policies
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Define annual leave quotas and rules for teachers and staff.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleInitialize}
                        disabled={isInitializing}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm font-medium disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`} />
                        Init Balances
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Policy
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Policy Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quota (Days)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applicable To</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {leaveTypes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No leave policies defined. Click 'Add Policy' to create one.
                                    </td>
                                </tr>
                            ) : (
                                leaveTypes.map((policy) => (
                                    <tr key={policy.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                {policy.name}
                                                {policy.requiresDocumentUpload && <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300" title="Requires Document">DOC</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {policy.defaultAnnualQuota}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${policy.isPaid ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {policy.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-1">
                                                {policy.applicableRoles.map(role => (
                                                    <span key={role} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(policy)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                    title="Edit Policy"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(policy.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                    title="Delete Policy"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <LeavePolicyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                policyToEdit={editingPolicy}
            />
        </div>
    );
};
