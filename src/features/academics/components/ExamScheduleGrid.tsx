import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubjects } from '../hooks/useSubjects';
import { useExamSchedules } from '../hooks/useExamSchedules';
import { Button } from '../../../components/common/Button';
import { Loader2 } from 'lucide-react';

interface ExamScheduleGridProps {
    examTermId: string;
    classId: string;
}

export const ExamScheduleGrid: React.FC<ExamScheduleGridProps> = ({ examTermId, classId }) => {
    const { t } = useTranslation();
    const { subjects, isLoading: loadingSubjects } = useSubjects();
    const { schedules, isLoading: loadingSchedules, saveSchedule, isSaving } = useExamSchedules({ examTermId, classId });

    // Local state for edits
    const [localDates, setLocalDates] = useState<Record<string, string>>({});
    const [localMaxMarks, setLocalMaxMarks] = useState<Record<string, string>>({});

    // Filter subjects for the selected class (or all if not mapped strictly)
    const classSubjects = subjects.filter(s => String(s.classId) === String(classId));

    const handleSaveAll = async () => {
        for (const subject of classSubjects) {
            const existingSchedule = schedules.find(s => s.subjectId === subject.id);

            const newDate = localDates[subject.id] || existingSchedule?.examDate || '';
            const maxMarksStr = localMaxMarks[subject.id] || String(existingSchedule?.maxMarks || subject.maxMarks || 100);
            const newMaxMarks = parseInt(maxMarksStr, 10);

            // Basic validation: if date is populated, we can save it. If not, maybe skip.
            if (newDate) {
                await saveSchedule({
                    examTermId,
                    classId,
                    subjectId: subject.id,
                    examDate: newDate,
                    maxMarks: isNaN(newMaxMarks) ? 100 : newMaxMarks
                }).catch(err => console.error("Failed to save schedule for subject", subject.id, err));
            }
        }
        // optionally show toast
    };

    const isLoading = loadingSubjects || loadingSchedules;

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
    }

    if (classSubjects.length === 0) {
        return <div className="text-gray-500 p-4">No subjects found for this class. Please assign subjects first.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exam Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max Marks</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {classSubjects.map(subject => {
                            const existingSchedule = schedules.find(s => s.subjectId === subject.id);
                            const dateVal = localDates[subject.id] ?? existingSchedule?.examDate ?? '';
                            const maxMarksVal = localMaxMarks[subject.id] ?? String(existingSchedule?.maxMarks ?? subject.maxMarks ?? 100);

                            return (
                                <tr key={subject.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {subject.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <input
                                            type="date"
                                            className="rounded-md border-gray-300 dark:border-gray-600 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-1.5 border"
                                            value={dateVal}
                                            onChange={(e) => setLocalDates(prev => ({ ...prev, [subject.id]: e.target.value }))}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-24 rounded-md border-gray-300 dark:border-gray-600 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-1.5 border"
                                            value={maxMarksVal}
                                            onChange={(e) => setLocalMaxMarks(prev => ({ ...prev, [subject.id]: e.target.value }))}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end pt-2">
                <Button onClick={handleSaveAll} disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Schedule'}
                </Button>
            </div>
        </div>
    );
};
