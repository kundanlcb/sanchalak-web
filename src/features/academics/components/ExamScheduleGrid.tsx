import React, { useState } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { useExamSchedules } from '../hooks/useExamSchedules';
import { Button } from '../../../components/common/Button';
import { Loader2, Save } from 'lucide-react';

interface ExamScheduleGridProps {
    examTermId: string;
    classId: string;
}

const inputCls = "rounded-md border-gray-300 dark:border-gray-600 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-2 py-1.5 border w-full";
const thCls = "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider";
const tdCls = "px-4 py-3 whitespace-nowrap text-sm";

type LocalEdits = Record<string, Record<string, string>>;

export const ExamScheduleGrid: React.FC<ExamScheduleGridProps> = ({ examTermId, classId }) => {
    const { subjects, isLoading: loadingSubjects } = useSubjects();
    const { schedules, isLoading: loadingSchedules, saveSchedule, isSaving } = useExamSchedules({ examTermId, classId });

    const [edits, setEdits] = useState<LocalEdits>({});

    const classSubjects = subjects.filter(s => String(s.classId) === String(classId));

    const getVal = (subjectId: string, field: string, fallback: string) =>
        edits[subjectId]?.[field] ?? fallback;

    const setVal = (subjectId: string, field: string, value: string) =>
        setEdits(prev => ({
            ...prev,
            [subjectId]: { ...prev[subjectId], [field]: value },
        }));

    const handleSaveAll = async () => {
        for (const subject of classSubjects) {
            const existing = schedules.find(s => s.subjectId === subject.id);
            const e = edits[subject.id] || {};

            const examDate = e.examDate ?? existing?.examDate ?? '';
            const maxMarks = parseInt(e.maxMarks ?? String(existing?.maxMarks ?? 100), 10);
            const passingMarks = parseInt(e.passingMarks ?? String(existing?.passingMarks ?? 35), 10);
            const startTime = e.startTime ?? existing?.startTime ?? '';
            const endTime = e.endTime ?? existing?.endTime ?? '';
            const durationMinutes = parseInt(e.durationMinutes ?? String(existing?.durationMinutes ?? 60), 10);

            if (examDate) {
                await saveSchedule({
                    examTermId,
                    classId,
                    subjectId: subject.id,
                    examDate,
                    maxMarks: isNaN(maxMarks) ? 100 : maxMarks,
                    passingMarks: isNaN(passingMarks) ? 35 : passingMarks,
                    startTime: startTime || undefined,
                    endTime: endTime || undefined,
                    durationMinutes: isNaN(durationMinutes) ? undefined : durationMinutes,
                }).catch(err => console.error("Failed to save schedule for", subject.id, err));
            }
        }
    };

    const isLoading = loadingSubjects || loadingSchedules;

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
    }

    if (classSubjects.length === 0) {
        return <div className="text-gray-500 p-4 text-center">No subjects found for this class. Please assign subjects first.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className={thCls}>Subject</th>
                            <th className={thCls}>Exam Date</th>
                            <th className={`${thCls} w-20`}>Max Marks</th>
                            <th className={`${thCls} w-20`}>Pass Marks</th>
                            <th className={thCls}>Start Time</th>
                            <th className={thCls}>End Time</th>
                            <th className={`${thCls} w-20`}>Duration (min)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {classSubjects.map(subject => {
                            const existing = schedules.find(s => s.subjectId === subject.id);
                            return (
                                <tr key={subject.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className={`${tdCls} font-medium text-gray-900 dark:text-white`}>
                                        {subject.name}
                                        <div className="text-xs text-gray-400">{subject.code}</div>
                                    </td>
                                    <td className={tdCls}>
                                        <input
                                            type="date"
                                            className={inputCls}
                                            value={getVal(subject.id, 'examDate', existing?.examDate ?? '')}
                                            onChange={(e) => setVal(subject.id, 'examDate', e.target.value)}
                                        />
                                    </td>
                                    <td className={tdCls}>
                                        <input
                                            type="number" min="1"
                                            className={`${inputCls} w-20`}
                                            value={getVal(subject.id, 'maxMarks', String(existing?.maxMarks ?? 100))}
                                            onChange={(e) => setVal(subject.id, 'maxMarks', e.target.value)}
                                        />
                                    </td>
                                    <td className={tdCls}>
                                        <input
                                            type="number" min="0"
                                            className={`${inputCls} w-20`}
                                            value={getVal(subject.id, 'passingMarks', String(existing?.passingMarks ?? 35))}
                                            onChange={(e) => setVal(subject.id, 'passingMarks', e.target.value)}
                                        />
                                    </td>
                                    <td className={tdCls}>
                                        <input
                                            type="time"
                                            className={inputCls}
                                            value={getVal(subject.id, 'startTime', existing?.startTime ?? '')}
                                            onChange={(e) => setVal(subject.id, 'startTime', e.target.value)}
                                        />
                                    </td>
                                    <td className={tdCls}>
                                        <input
                                            type="time"
                                            className={inputCls}
                                            value={getVal(subject.id, 'endTime', existing?.endTime ?? '')}
                                            onChange={(e) => setVal(subject.id, 'endTime', e.target.value)}
                                        />
                                    </td>
                                    <td className={tdCls}>
                                        <input
                                            type="number" min="1"
                                            className={`${inputCls} w-20`}
                                            value={getVal(subject.id, 'durationMinutes', String(existing?.durationMinutes ?? 60))}
                                            onChange={(e) => setVal(subject.id, 'durationMinutes', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end pt-2">
                <Button onClick={handleSaveAll} disabled={isSaving} className="flex items-center gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Saving...' : 'Save All Schedules'}
                </Button>
            </div>
        </div>
    );
};
