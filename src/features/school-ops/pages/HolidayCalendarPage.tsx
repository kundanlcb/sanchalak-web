import React, { useState } from 'react';
import { useHolidays } from '../hooks/useHolidays';
import { HolidayModal } from '../components/HolidayModal';
import type { Holiday, CreateHolidayRequest } from '../types/holiday';
import { Calendar, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const HolidayCalendarPage: React.FC = () => {
    const { holidays, isLoading, error, createHoliday, updateHoliday, deleteHoliday } = useHolidays();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState<Holiday | undefined>();

    const handleAdd = () => {
        setEditingHoliday(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (holiday: Holiday) => {
        setEditingHoliday(holiday);
        setIsModalOpen(true);
    };

    const handleSave = async (data: CreateHolidayRequest) => {
        try {
            if (editingHoliday) {
                await updateHoliday({ id: editingHoliday.id, data });
            } else {
                await createHoliday(data);
            }
        } catch (err) {
            console.error('Failed to save holiday', err);
            alert('Failed to save holiday. Please try again.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this holiday?')) {
            try {
                await deleteHoliday(id);
            } catch (err) {
                console.error('Failed to delete holiday', err);
                alert('Failed to delete holiday.');
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
            <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Failed to load holidays. Please try again later.
            </div>
        );
    }

    // Sort holidays by start date
    const sortedHolidays = [...holidays].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-blue-500" />
                        Holiday Calendar
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage public holidays and school breaks for the academic year.
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Holiday
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Holiday Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date/Duration</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applies To</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {sortedHolidays.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No holidays defined yet. Click 'Add Holiday' to start.
                                    </td>
                                </tr>
                            ) : (
                                sortedHolidays.map((holiday) => (
                                    <tr key={holiday.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{holiday.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                {holiday.startDate === holiday.endDate ? (
                                                    format(new Date(holiday.startDate), 'MMM dd, yyyy')
                                                ) : (
                                                    <>{format(new Date(holiday.startDate), 'MMM dd')} - {format(new Date(holiday.endDate), 'MMM dd, yyyy')}</>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${holiday.type === 'NATIONAL' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                holiday.type === 'REGIONAL' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {holiday.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                {holiday.applicableToStudents && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded">Students</span>
                                                )}
                                                {holiday.applicableToStaff && (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium rounded">Staff</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(holiday)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                    title="Edit Holiday"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(holiday.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                    title="Delete Holiday"
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

            <HolidayModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                holidayToEdit={editingHoliday}
            />
        </div>
    );
};
