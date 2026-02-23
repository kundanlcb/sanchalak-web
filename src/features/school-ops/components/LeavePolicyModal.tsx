import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { LeaveType, CreateLeaveTypeRequest } from '../types/leavePolicy';

interface LeavePolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateLeaveTypeRequest) => Promise<void>;
    policyToEdit?: LeaveType;
}

export const LeavePolicyModal: React.FC<LeavePolicyModalProps> = ({
    isOpen,
    onClose,
    onSave,
    policyToEdit
}) => {
    const [formData, setFormData] = useState<CreateLeaveTypeRequest>({
        name: '',
        isPaid: true,
        defaultAnnualQuota: 0,
        applicableRoles: ['Teacher'],
        requiresDocumentUpload: false
    });

    useEffect(() => {
        if (policyToEdit) {
            setFormData({
                name: policyToEdit.name,
                isPaid: policyToEdit.isPaid,
                defaultAnnualQuota: policyToEdit.defaultAnnualQuota,
                applicableRoles: policyToEdit.applicableRoles,
                requiresDocumentUpload: policyToEdit.requiresDocumentUpload
            });
        } else {
            setFormData({
                name: '',
                isPaid: true,
                defaultAnnualQuota: 0,
                applicableRoles: ['Teacher'],
                requiresDocumentUpload: false
            });
        }
    }, [policyToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
        onClose();
    };

    const handleRoleToggle = (role: string) => {
        setFormData(prev => ({
            ...prev,
            applicableRoles: prev.applicableRoles.includes(role)
                ? prev.applicableRoles.filter(r => r !== role)
                : [...prev.applicableRoles, role]
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mb-20 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {policyToEdit ? 'Edit Leave Policy' : 'Create Leave Policy'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Policy Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
                            placeholder="e.g., Casual Leave"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Annual Quota (Days)
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.defaultAnnualQuota}
                            onChange={(e) => setFormData({ ...formData, defaultAnnualQuota: parseInt(e.target.value, 10) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
                        />
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isPaid}
                                onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Paid Leave?</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.requiresDocumentUpload}
                                onChange={(e) => setFormData({ ...formData, requiresDocumentUpload: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Requires Document Upload (e.g., Medical Certificate)</span>
                        </label>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-4">
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Applicable Roles</span>
                        <div className="flex gap-4">
                            {['Teacher', 'Staff', 'Admin'].map(role => (
                                <label key={role} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.applicableRoles.includes(role)}
                                        onChange={() => handleRoleToggle(role)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{role}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium shadow-sm"
                        >
                            Save Policy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
