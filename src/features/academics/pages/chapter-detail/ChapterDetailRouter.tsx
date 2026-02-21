import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAcademicStructure } from '../../../school-ops/hooks/useAcademicStructure';
import { useSubjects } from '../../hooks/useSubjects';
import { useChapters } from '../../hooks/curriculum/useChapters';
import { useContent } from '../../hooks/curriculum/useContent';
import { useQuestions } from '../../hooks/curriculum/useQuestions';
import { Loader2, Plus, FileText, Video, Link as LinkIcon, Trash2, HelpCircle } from 'lucide-react';
import { Button } from '../../../../components/common/Button';
import { Modal } from '../../../../components/common/Modal';
import { Input } from '../../../../components/common/Input';
import { Select } from '../../../../components/common/Select';
import { useForm } from 'react-hook-form';

export const ChapterDetailRouter: React.FC = () => {
    const { classId, subjectId, chapterId } = useParams<{ classId: string; subjectId: string; chapterId: string }>();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'content' | 'questions'>('content');

    // Core structure hooks
    const { classes, loading: classLoading } = useAcademicStructure();
    const { subjects, isLoading: subjectLoading } = useSubjects();
    const { chapters, isLoading: chaptersLoading } = useChapters(classId, subjectId);

    // Chapter specific hooks
    const { contents, isLoading: contentLoading, addContent, deleteContent } = useContent(chapterId);
    const { questions, isLoading: questionLoading, addQuestion, deleteQuestion } = useQuestions(chapterId);

    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

    // Form setups
    const contentForm = useForm({
        defaultValues: { title: '', contentType: 'TEXT', contentData: '', sequenceOrder: 1 }
    });

    const questionForm = useForm({
        defaultValues: {
            questionText: '',
            questionType: 'MCQ',
            marks: 1,
            options: [
                { optionText: '', isCorrect: false },
                { optionText: '', isCorrect: false },
                { optionText: '', isCorrect: false },
                { optionText: '', isCorrect: false }
            ]
        }
    });

    // Lookup entities
    const schoolClass = classes.find(c => String(c.id) === classId);
    const subject = subjects.find(s => String(s.id) === subjectId);
    const chapter = chapters.find(c => String(c.id) === chapterId);

    const isLoading = classLoading || subjectLoading || chaptersLoading || contentLoading || questionLoading;

    if (isLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    }

    if (!schoolClass || !subject || !chapter) {
        return <div className="p-8 text-center text-red-500">Resource not found</div>;
    }

    // Submit Handlers
    const onAddContentSubmit = async (data: any) => {
        try {
            await addContent({
                title: data.title,
                contentType: data.contentType,
                contentData: data.contentData,
                sequenceOrder: Number(data.sequenceOrder)
            });
            setIsContentModalOpen(false);
            contentForm.reset();
        } catch (e) {
            console.error(e);
        }
    };

    const onAddQuestionSubmit = async (data: any) => {
        try {
            await addQuestion({
                questionText: data.questionText,
                questionType: data.questionType,
                marks: Number(data.marks),
                options: data.questionType === 'MCQ' ? data.options : []
            });
            setIsQuestionModalOpen(false);
            questionForm.reset();
        } catch (e) {
            console.error(e);
        }
    };

    const getContentIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video className="w-5 h-5 text-purple-500" />;
            case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
            case 'LINK': return <LinkIcon className="w-5 h-5 text-blue-500" />;
            default: return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-2 text-indigo-100 text-sm mb-2">
                                <span className="hover:underline cursor-pointer" onClick={() => navigate(`/admin/academics/classes/${classId}`)}>{schoolClass.className || `${schoolClass.grade} ${schoolClass.section}`}</span>
                                <span>/</span>
                                <span className="hover:underline cursor-pointer" onClick={() => navigate(`/admin/academics/classes/${classId}/subjects/${subjectId}`)}>{subject.name}</span>
                                <span>/</span>
                                <span className="text-white font-medium">CH {chapter.sequenceOrder}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white">{chapter.name}</h1>
                            <p className="text-indigo-100 mt-2">{chapter.description || 'No description provided'}</p>
                        </div>
                        <button
                            onClick={() => navigate(`/admin/academics/classes/${classId}/subjects/${subjectId}`)}
                            className="text-sm bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
                        >
                            Back to Chapters
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mt-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                            ${activeTab === 'content'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
                    >
                        <FileText className={`w-5 h-5 mr-2 ${activeTab === 'content' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        Study Materials & Content
                    </button>
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                            ${activeTab === 'questions'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
                    >
                        <HelpCircle className={`w-5 h-5 mr-2 ${activeTab === 'questions' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        Question Bank
                    </button>
                </nav>
            </div>

            {/* Tab Panes */}
            <div className="mt-6">
                {activeTab === 'content' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content Library</h2>
                            <Button onClick={() => setIsContentModalOpen(true)} className="flex items-center gap-2" variant="outline">
                                <Plus className="w-4 h-4" /> Add Material
                            </Button>
                        </div>
                        {contents.length === 0 ? (
                            <div className="text-center p-12 border border-dashed rounded-xl border-gray-300 dark:border-gray-700 text-gray-500">
                                No content mapped to this chapter.
                            </div>
                        ) : (
                            contents.map(c => (
                                <div key={c.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                                            {getContentIcon(c.contentType)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{c.title}</h4>
                                            <a href={c.contentData} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline line-clamp-1">{c.contentData}</a>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteContent(c.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Questions Bank</h2>
                            <Button onClick={() => setIsQuestionModalOpen(true)} className="flex items-center gap-2" variant="outline">
                                <Plus className="w-4 h-4" /> Add Question
                            </Button>
                        </div>
                        {questions.length === 0 ? (
                            <div className="text-center p-12 border border-dashed rounded-xl border-gray-300 dark:border-gray-700 text-gray-500">
                                No questions mapped to this chapter.
                            </div>
                        ) : (
                            questions.map((q, idx) => (
                                <div key={q.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <span className="font-bold text-indigo-500">Q{idx + 1}.</span>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{q.questionText}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{q.questionType}</span>
                                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded">{q.marks} Marks</span>
                                                </div>

                                                {q.options && q.options.length > 0 && (
                                                    <div className="mt-4 space-y-2">
                                                        {q.options.map((opt, oIdx) => (
                                                            <div key={opt.id} className={`p-2 rounded border text-sm flex items-center gap-2 ${opt.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                                                <span className="font-medium mr-1">{String.fromCharCode(65 + oIdx)}.</span> {opt.optionText}
                                                                {opt.isCorrect && <span className="ml-auto text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">Correct</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => deleteQuestion(q.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Content Add Modal */}
            <Modal isOpen={isContentModalOpen} onClose={() => setIsContentModalOpen(false)} title="Upload Study Material">
                <form onSubmit={contentForm.handleSubmit(onAddContentSubmit)} className="space-y-4 pt-4">
                    <Input
                        label="Material Title"
                        placeholder="e.g. Intro Lecture Slide"
                        {...contentForm.register('title', { required: true })}
                    />
                    <Select
                        label="Content Type"
                        options={[
                            { value: 'PDF', label: 'PDF Document' },
                            { value: 'VIDEO', label: 'Video URL' },
                            { value: 'LINK', label: 'External Resource Link' },
                            { value: 'TEXT', label: 'Rich Text' }
                        ]}
                        {...contentForm.register('contentType')}
                    />
                    <Input
                        label="Content Data / External URL"
                        placeholder="https://..."
                        {...contentForm.register('contentData', { required: true })}
                    />
                    <Input
                        label="Sequence Number"
                        type="number"
                        {...contentForm.register('sequenceOrder', { required: true, valueAsNumber: true })}
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsContentModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Upload Material</Button>
                    </div>
                </form>
            </Modal>

            {/* Question Add Modal */}
            <Modal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} title="Add Bank Question">
                {/* Note: In a real environment, we would use a dynamic field array layout for React Hook Form. Simplified structure included. */}
                <form onSubmit={questionForm.handleSubmit(onAddQuestionSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question Text</label>
                        <textarea
                            {...questionForm.register('questionText', { required: true })}
                            className="w-full px-3 py-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            rows={3}
                            placeholder="Type the question..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Question Type"
                            options={[
                                { value: 'MCQ', label: 'Multiple Choice' },
                                { value: 'TRUE_FALSE', label: 'True / False' },
                                { value: 'SUBJECTIVE', label: 'Subjective / Essay' }
                            ]}
                            {...questionForm.register('questionType')}
                        />
                        <Input
                            label="Assigned Marks"
                            type="number"
                            {...questionForm.register('marks', { required: true, valueAsNumber: true })}
                        />
                    </div>

                    {questionForm.watch('questionType') === 'MCQ' && (
                        <div className="space-y-3 mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">MCQ Options</h4>
                            {[0, 1, 2, 3].map(idx => (
                                <div key={idx} className="flex items-center gap-3">
                                    <Input
                                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                        {...questionForm.register(`options.${idx}.optionText` as const)}
                                        className="mb-0"
                                    />
                                    <div className="flex items-center gap-2 mt-2 shrink-0">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                            {...questionForm.register(`options.${idx}.isCorrect` as const)}
                                        />
                                        <span className="text-xs text-gray-600">Correct?</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsQuestionModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Question</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
