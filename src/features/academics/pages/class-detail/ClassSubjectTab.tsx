import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubjects } from '../../hooks/useSubjects';
import { BookOpen, Loader2, Plus } from 'lucide-react';
import { Button } from '../../../../components/common/Button';
import { Modal } from '../../../../components/common/Modal';
import { Input } from '../../../../components/common/Input';
import { useForm } from 'react-hook-form';

interface ClassSubjectTabProps {
    classId: string;
}

export const ClassSubjectTab: React.FC<ClassSubjectTabProps> = ({ classId }) => {
    const { subjects, isLoading, createSubject } = useSubjects();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const form = useForm({
        defaultValues: { name: '', code: '' }
    });

    if (isLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    }

    // Filter subjects strictly assigned to this class or globally 'all'
    const classSubjects = subjects.filter(s => String(s.classId) === classId || s.classId === 'all');

    const onSubmit = async (data: { name: string; code: string }) => {
        try {
            await createSubject({
                name: data.name,
                code: data.code,
                classId: classId,
            });
            setIsModalOpen(false);
            form.reset();
        } catch (e) {
            console.error('Failed to create subject:', e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Curriculum Subjects</h3>
                    <p className="text-sm text-gray-500">Select a subject to build out chapters and content.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2" variant="outline">
                    <Plus className="w-4 h-4" /> Add Subject
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classSubjects.map(subject => (
                    <div
                        key={subject.id}
                        onClick={() => navigate(`/admin/academics/classes/${classId}/subjects/${subject.id}`)}
                        className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{subject.name}</h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Code: {subject.code}</div>
                        </div>
                    </div>
                ))}
                {classSubjects.length === 0 && (
                    <div className="col-span-full p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        No subjects are allocated for this class yet. Click "Add Subject" to get started.
                    </div>
                )}
            </div>

            {/* Add Subject Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Subject">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <Input
                        label="Subject Name"
                        placeholder="e.g. Mathematics"
                        {...form.register('name', { required: true })}
                    />
                    <Input
                        label="Subject Code"
                        placeholder="e.g. MATH"
                        {...form.register('code', { required: true })}
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Subject</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
