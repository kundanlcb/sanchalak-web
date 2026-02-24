import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Select } from '../../../components/common/Select';
import type { Holiday, CreateHolidayRequest, HolidayType } from '../types/holiday';

interface HolidayModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateHolidayRequest) => Promise<void>;
    holidayToEdit?: Holiday;
}

export const HolidayModal: React.FC<HolidayModalProps> = ({
    isOpen,
    onClose,
    onSave,
    holidayToEdit
}) => {
    const [formData, setFormData] = useState<CreateHolidayRequest>({
        name: '',
        startDate: '',
        endDate: '',
        type: 'INSTITUTIONAL',
        applicableToStudents: true,
        applicableToStaff: true,
        academicYear: '2024-2025' // Defaulting for simple integration
    });

    useEffect(() => {
        if (holidayToEdit) {
            setFormData({
                name: holidayToEdit.name,
                startDate: holidayToEdit.startDate,
                endDate: holidayToEdit.endDate,
                type: holidayToEdit.type,
                applicableToStudents: holidayToEdit.applicableToStudents,
                applicableToStaff: holidayToEdit.applicableToStaff,
                academicYear: holidayToEdit.academicYear
            });
        } else {
            setFormData({
                name: '',
                startDate: '',
                endDate: '',
                type: 'INSTITUTIONAL',
                applicableToStudents: true,
                applicableToStaff: true,
                academicYear: '2024-2025'
            });
        }
    }, [holidayToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mb-20 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {holidayToEdit ? 'Edit Holiday' : 'Add New Holiday'}
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
                            Holiday Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none"
                            placeholder="e.g., Summer Vacation"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    </div>

                    <Select
                        label="Holiday Type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as HolidayType })}
                    >
                        <option value="INSTITUTIONAL">Institutional</option>
                        <option value="NATIONAL">National</option>
                        <option value="REGIONAL">Regional</option>
                    </Select>

                    <div className="flex gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.applicableToStudents}
                                onChange={(e) => setFormData({ ...formData, applicableToStudents: e.target.checked })}
                                className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Applies to Students</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.applicableToStaff}
                                onChange={(e) => setFormData({ ...formData, applicableToStaff: e.target.checked })}
                                className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Applies to Staff</span>
                        </label>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
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
                            Save Holiday
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
