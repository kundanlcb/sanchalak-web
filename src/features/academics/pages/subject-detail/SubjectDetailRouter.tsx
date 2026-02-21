import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAcademicStructure } from '../../../school-ops/hooks/useAcademicStructure';
import { useSubjects } from '../../hooks/useSubjects';
import { useChapters } from '../../hooks/curriculum/useChapters';
import { Loader2, Plus, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/common/Button';
import { Modal } from '../../../../components/common/Modal';
import { Input } from '../../../../components/common/Input';
import { useForm } from 'react-hook-form';

export const SubjectDetailRouter: React.FC = () => {
    const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
    const navigate = useNavigate();

    const { classes, loading: classLoading } = useAcademicStructure();
    const { subjects, isLoading: subjectLoading } = useSubjects();
    const { chapters, isLoading: chaptersLoading, createChapter, deleteChapter } = useChapters(classId, subjectId);

    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { name: '', description: '', sequenceOrder: 1 }
    });

    const schoolClass = classes.find(c => String(c.id) === classId);
    const subject = subjects.find(s => String(s.id) === subjectId);

    const isLoading = classLoading || subjectLoading || chaptersLoading;

    if (isLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    }

    if (!schoolClass || !subject) {
        return <div className="p-8 text-center text-red-500">Class or Subject not found</div>;
    }

    const onAddChapter = async (data: any) => {
        try {
            await createChapter({
                classId: classId!,
                subjectId: subjectId!,
                name: data.name,
                description: data.description,
                sequenceOrder: Number(data.sequenceOrder)
            });
            setIsChapterModalOpen(false);
            reset();
        } catch (error) {
            console.error("Failed to add chapter", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Subject Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-2 text-emerald-100 text-sm mb-2">
                                <span className="hover:underline cursor-pointer" onClick={() => navigate('/admin/academics/setup')}>Classes</span>
                                <span>/</span>
                                <span className="hover:underline cursor-pointer" onClick={() => navigate(`/admin/academics/classes/${classId}`)}>{schoolClass.className || `${schoolClass.grade} ${schoolClass.section}`}</span>
                                <span>/</span>
                                <span className="text-white font-medium">{subject.name}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white">{subject.name} Curriculum</h1>
                            <p className="text-emerald-100 mt-2">Manage syllabus, chapters, and content materials.</p>
                        </div>
                        <button
                            onClick={() => navigate(`/admin/academics/classes/${classId}`)}
                            className="text-sm bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
                        >
                            Back to Class Header
                        </button>
                    </div>
                </div>
            </div>

            {/* Chapters Pipeline */}
            <div className="flex justify-between items-center mt-8 mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chapters Map</h2>
                <Button onClick={() => setIsChapterModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Chapter
                </Button>
            </div>

            <div className="space-y-4">
                {chapters.length === 0 ? (
                    <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500">No chapters have been added to this subject yet.</p>
                    </div>
                ) : (
                    chapters.map((chapter) => (
                        <div key={chapter.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow group flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <div className="flex items-start gap-4">
                                <div className="p-2 cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                                            CH {chapter.sequenceOrder}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{chapter.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{chapter.description || 'No description provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 dark:border-gray-700 md:border-t-0">
                                <button
                                    onClick={() => navigate(`/admin/academics/classes/${classId}/subjects/${subjectId}/chapters/${chapter.id}`)}
                                    className="flex-1 md:flex-none text-center px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium text-sm rounded-lg transition-colors"
                                >
                                    Manage Content & Questions
                                </button>
                                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit Chapter">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deleteChapter(chapter.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete Chapter"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modals */}
            <Modal isOpen={isChapterModalOpen} onClose={() => setIsChapterModalOpen(false)} title="Add New Chapter">
                <form onSubmit={handleSubmit(onAddChapter)} className="space-y-4 pt-4">
                    <Input
                        label="Chapter Name"
                        placeholder="e.g. Thermodynamics, Algebra Fundamentals"
                        {...register('name', { required: "Chapter name is required" })}
                        error={errors.name?.message as string}
                    />
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            {...register('description')}
                            className="w-full px-3 py-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Brief description of the chapter topics..."
                        />
                    </div>
                    <Input
                        label="Sequence Number"
                        type="number"
                        {...register('sequenceOrder', {
                            required: "Sequence is required",
                            valueAsNumber: true
                        })}
                        error={errors.sequenceOrder?.message as string}
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsChapterModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Chapter
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
