import React, { useState } from 'react';
import { useAcademicStructure } from '../hooks/useAcademicStructure';
import { useRoutine } from '../hooks/useRoutine';
import { useTeachers } from '../hooks/useTeachers';
import { RoutineGrid } from '../components/RoutineGrid';
import { RoutineAssignmentModal } from '../components/RoutineAssignmentModal';
import { Select } from '../../../components/common/Select';
import { Loader2, CalendarClock } from 'lucide-react';
import { type Routine } from '../types';

export const RoutineManagementPage: React.FC = () => {
    const { classes, subjects, loading: academicLoading } = useAcademicStructure();
    const { teachers, loading: teachersLoading } = useTeachers();
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

    // Derived state for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCell, setEditingCell] = useState<{ day: string, period: string, routine?: Routine } | null>(null);

    // Fetch routines for selected class
    const { routines, loading: routineLoading, addRoutine, removeRoutine, error } = useRoutine(
        selectedClassId ? { classId: selectedClassId } : undefined
    );

    // TanStack Query auto-refetches when selectedClassId changes via queryKey

    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClassId(e.target.value ? Number(e.target.value) : null);
    };

    const handleCellClick = (day: string, period: string, currentRoutine?: Routine) => {
        setEditingCell({ day, period, routine: currentRoutine });
        setIsModalOpen(true);
    };

    const handleSaveAssignment = async (data: { subjectId: number; teacherId: number }) => {
        if (!selectedClassId || !editingCell) return;

        // If updating existing, likely we delete old and create new (simplest for now)
        // Or if API supported PUT. Our handlers support POST (create) and DELETE.
        // Assuming purely Add for now, or if ID exists we might need to delete first?
        // Let's assume Add overwrites or fails. 
        // Actually, if a routine exists in that slot, we should delete it first or update it.
        // Our mocking logic checks for conflicts.

        try {
            if (editingCell.routine) {
                // Delete existing if replacing
                await removeRoutine(editingCell.routine.id);
            }

            const newRoutine: any = { // Partial<Routine> but ID is generated
                classId: selectedClassId,
                day: editingCell.day as any,
                period: editingCell.period as any,
                subjectId: data.subjectId,
                teacherId: data.teacherId
            };

            await addRoutine(newRoutine);
        } catch (e) {
            // Error handling is managed by the hook (sets error state)
            console.error(e);
            throw e; // Propagate to modal to stop closing? Modal handles it via promise
        }
    };

    const handleDeleteAssignment = async () => {
        if (editingCell?.routine) {
            await removeRoutine(editingCell.routine.id);
        }
    };

    const selectedClass = classes.find(c => c.id === selectedClassId);

    const classOptions = classes.map(c => ({
        value: String(c.id),
        label: `${c.className || `Grade ${c.grade}-${c.section}`}`
    }));

    const isLoading = academicLoading || teachersLoading;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarClock className="w-8 h-8 text-blue-600" />
                        Timetable Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage weekly routines and teacher assignments
                    </p>
                </div>

                <div className="w-full md:w-64">
                    <Select
                        value={selectedClassId ?? ''}
                        onChange={handleClassChange}
                        options={[{ value: '', label: 'Select Class' }, ...classOptions]}
                        disabled={isLoading}
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {isLoading && !selectedClassId ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <>
                    {!selectedClassId ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500">Please select a class to view/edit its routine</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {routineLoading && (
                                <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                            )}
                            <RoutineGrid
                                routines={routines}
                                subjects={subjects}
                                teachers={teachers}
                                editable={true}
                                onCellClick={handleCellClick}
                            />
                        </div>
                    )}
                </>
            )}

            {editingCell && (
                <RoutineAssignmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    day={editingCell.day}
                    period={editingCell.period}
                    classNameStr={selectedClass?.className || (selectedClass ? `Grade ${selectedClass.grade}-${selectedClass.section}` : 'Selected Class')}
                    currentRoutine={editingCell.routine}
                    subjects={subjects}
                    teachers={teachers}
                    onSave={handleSaveAssignment}
                    onDelete={handleDeleteAssignment}
                />
            )}
        </div>
    );
};
