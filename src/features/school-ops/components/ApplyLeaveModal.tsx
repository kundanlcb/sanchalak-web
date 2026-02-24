import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { Select } from '../../../components/common/Select';
import { useLeavePolicies } from '../hooks/useLeavePolicies';
import type { LeaveRequest } from '../services/leaveRequestApi';

interface ApplyLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (data: Partial<LeaveRequest>) => Promise<void>;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
    isOpen,
    onClose,
    onApply
}) => {
    const { leaveTypes } = useLeavePolicies();
    const [formData, setFormData] = useState({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        isHalfDay: false,
        reason: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onApply({
            leaveType: { id: parseInt(formData.leaveTypeId, 10) },
            startDate: formData.startDate,
            endDate: formData.endDate,
            isHalfDay: formData.isHalfDay,
            reason: formData.reason,
            requesterId: 1 // Default/Placeholder for testing; normally from auth
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mb-20">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Apply for Leave
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Select
                        label="Leave Type"
                        required
                        value={formData.leaveTypeId}
                        onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
                    >
                        <option value="">Select Type</option>
                        {leaveTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </Select>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                            <input
                                type="date"
                                required={!formData.isHalfDay}
                                disabled={formData.isHalfDay}
                                value={formData.isHalfDay ? formData.startDate : formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            checked={formData.isHalfDay}
                            onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked, endDate: e.target.checked ? formData.startDate : formData.endDate })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Half Day?</span>
                    </label>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Briefly explain the reason for leave..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
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
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
