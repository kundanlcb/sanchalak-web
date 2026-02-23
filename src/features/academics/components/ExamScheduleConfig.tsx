import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '../../../components/common/Select';
import { useExamTerms } from '../hooks/useExamTerms';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { ExamScheduleGrid } from './ExamScheduleGrid';
import { Loader2 } from 'lucide-react';

export const ExamScheduleConfig: React.FC = () => {
    const { t } = useTranslation();
    const { examTerms, isLoading: loadingTerms } = useExamTerms();
    const { classes, loading: loadingClasses } = useAcademicStructure();

    const [selectedTerm, setSelectedTerm] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');

    if (loadingTerms || loadingClasses) {
        return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;
    }

    const termOptions = examTerms.map(term => ({
        value: String(term.id),
        label: term.name,
    }));

    const classOptions = classes.map((c: any) => ({
        value: String(c.id),
        label: c.className || String(c.id),
    }));

    return (
        <div className="space-y-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('academics.exams.tabSchedules') || 'Exam Schedules'}</h2>
            <p className="text-sm text-gray-500">Configure exam dates and max marks for each subject per class.</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 relative z-10">
                <div className="w-full sm:w-64">
                    <Select
                        label="Exam Term"
                        options={[{ value: '', label: 'Select Term' }, ...termOptions]}
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-64">
                    <Select
                        label="Class"
                        options={[{ value: '', label: 'Select Class' }, ...classOptions]}
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    />
                </div>
            </div>

            {selectedTerm && selectedClass ? (
                <ExamScheduleGrid examTermId={selectedTerm} classId={selectedClass} />
            ) : (
                <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    Please select an Exam Term and a Class to configure schedules.
                </div>
            )}
        </div>
    );
};
