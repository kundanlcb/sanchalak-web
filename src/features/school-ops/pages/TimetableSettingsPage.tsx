import React, { useState, useEffect } from 'react';
import { useTimetableSlots } from '../hooks/useTimetableSlots';
import { Save, Plus, Trash2, Clock, Info } from 'lucide-react';
import type { TimetableSlot } from '../types';

export const TimetableSettingsPage: React.FC = () => {
    const { slots, loading, error, updateSlots } = useTimetableSlots();
    const [localSlots, setLocalSlots] = useState<TimetableSlot[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (slots) {
            setLocalSlots([...slots]);
        }
    }, [slots]);

    const handleAddSlot = () => {
        setLocalSlots([
            ...localSlots,
            { name: '', startTime: '08:00:00', endTime: '08:40:00', isBreak: false, orderIndex: localSlots.length + 1 }
        ]);
    };

    const handleRemoveSlot = (index: number) => {
        const newSlots = localSlots.filter((_, i) => i !== index).map((slot, i) => ({
            ...slot,
            orderIndex: i + 1
        }));
        setLocalSlots(newSlots);
    };

    const handleChange = (index: number, field: keyof TimetableSlot, value: any) => {
        const newSlots = [...localSlots];
        // Ensure HH:mm:ss formatting
        let parsedValue = value;
        if ((field === 'startTime' || field === 'endTime') && value.length === 5) {
            parsedValue = `${value}:00`;
        }

        newSlots[index] = { ...newSlots[index], [field]: parsedValue };
        setLocalSlots(newSlots);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSuccessMsg('');
            // Ensure proper indexing before save
            const payload = localSlots.map((s, i) => ({ ...s, orderIndex: i + 1 }));
            await updateSlots(payload);
            setSuccessMsg('Timetable configuration saved successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (e) {
            // Error handling is managed by hook
        } finally {
            setIsSaving(false);
        }
    };

    const formatTimeForInput = (time: string) => {
        if (!time) return '';
        const parts = time.split(':');
        return `${parts[0]}:${parts[1]}`; // Return only HH:mm
    };

    if (loading && localSlots.length === 0) {
        return <div className="p-8 text-center text-gray-500">Loading timetable configuration...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-8 h-8 text-blue-600" />
                        Timetable Configuration
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Define school periods, breaks, and their specific timings. These slots will be used globally across all classes.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    {successMsg}
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Daily Bell Schedule</h3>
                    <button
                        onClick={handleAddSlot}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Slot
                    </button>
                </div>

                <div className="p-4">
                    {localSlots.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No bell schedule configured. Click "Add Slot" to begin.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                <div className="col-span-1">Order</div>
                                <div className="col-span-4">Slot Name</div>
                                <div className="col-span-2">Start Time</div>
                                <div className="col-span-2">End Time</div>
                                <div className="col-span-2 flex justify-center">Is Break?</div>
                                <div className="col-span-1"></div>
                            </div>

                            {localSlots.map((slot, index) => (
                                <div key={index} className={`grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 rounded-lg border transition-colors ${slot.isBreak ? 'bg-orange-50/50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/30' : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'}`}>
                                    <div className="col-span-1 flex items-center gap-2 lg:justify-center font-semibold text-gray-400">
                                        <span className="lg:hidden">Order:</span> {index + 1}
                                    </div>
                                    <div className="col-span-4">
                                        <input
                                            type="text"
                                            value={slot.name}
                                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                                            placeholder="e.g. Period 1, Lunch Break"
                                            className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <span className="lg:hidden text-gray-500 text-sm">Start:</span>
                                        <input
                                            type="time"
                                            value={formatTimeForInput(slot.startTime)}
                                            onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                                            className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <span className="lg:hidden text-gray-500 text-sm">End:</span>
                                        <input
                                            type="time"
                                            value={formatTimeForInput(slot.endTime)}
                                            onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                                            className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-between lg:justify-center items-center">
                                        <span className="lg:hidden text-gray-500 text-sm">Is Break?</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={slot.isBreak}
                                                onChange={(e) => handleChange(index, 'isBreak', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                        </label>
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <button
                                            onClick={() => handleRemoveSlot(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Remove Slot"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3 text-blue-800 dark:text-blue-300">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                    <strong>Note:</strong> Changes made here will update the global bell schedule for all classes in the school. Ensure there are no overlapping time periods, and that breaks are correctly marked.
                </div>
            </div>
        </div>
    );
};
