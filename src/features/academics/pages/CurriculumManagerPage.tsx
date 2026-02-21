/**
 * CurriculumManagerPage — Unified content & question manager
 * Shows all curriculum content across classes with filterable tabs
 */
import React, { useState, useMemo } from 'react';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useSubjects } from '../hooks/useSubjects';
import { useChapters } from '../hooks/curriculum/useChapters';
import { useAllContent } from '../hooks/curriculum/useAllContent';
import { useAllQuestions } from '../hooks/curriculum/useAllQuestions';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import {
    FileText, Video, Image, HelpCircle, Plus, Loader2, Trash2, Filter,
    ChevronLeft, ChevronRight
} from 'lucide-react';

type ContentTab = 'text' | 'video' | 'image' | 'questions';

export const CurriculumManagerPage: React.FC = () => {
    // ─── Filters ───
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedChapterId, setSelectedChapterId] = useState('');
    const [activeTab, setActiveTab] = useState<ContentTab>('text');
    const [contentPage, setContentPage] = useState(1);
    const [questionsPage, setQuestionsPage] = useState(1);

    // ─── Add Modal ───
    const [showAddModal, setShowAddModal] = useState(false);
    const [addTitle, setAddTitle] = useState('');
    const [addContentData, setAddContentData] = useState('');
    const [addContentType, setAddContentType] = useState<'TEXT' | 'VIDEO' | 'PDF' | 'LINK'>('TEXT');
    const [addChapterId, setAddChapterId] = useState('');
    // Question fields
    const [addQuestionText, setAddQuestionText] = useState('');
    const [addQuestionType, setAddQuestionType] = useState<'MCQ' | 'TRUE_FALSE' | 'SUBJECTIVE'>('MCQ');
    const [addQuestionMarks, setAddQuestionMarks] = useState('1');

    // ─── Data ───
    const { classes, loading: classesLoading } = useAcademicStructure();
    const { subjects, isLoading: subjectsLoading } = useSubjects();
    const { chapters } = useChapters(
        selectedClassId || undefined,
        selectedSubjectId || undefined
    );

    const contentFilters = useMemo(() => ({
        classId: selectedClassId || undefined,
        subjectId: selectedSubjectId || undefined,
        chapterId: selectedChapterId || undefined,
        page: contentPage,
        size: 20,
    }), [selectedClassId, selectedSubjectId, selectedChapterId, contentPage]);

    const { contents, isLoading: contentLoading, createContent, deleteContent, totalPages: contentTotalPages, totalElements: contentTotalElements, currentPage: contentCurrentPage } = useAllContent(contentFilters);

    const questionFilters = useMemo(() => ({
        classId: selectedClassId || undefined,
        subjectId: selectedSubjectId || undefined,
        chapterId: selectedChapterId || undefined,
        page: questionsPage,
        size: 20,
    }), [selectedClassId, selectedSubjectId, selectedChapterId, questionsPage]);

    const { questions, isLoading: questionsLoading, createQuestion, deleteQuestion, totalPages: questionTotalPages, totalElements: questionTotalElements, currentPage: questionCurrentPage } = useAllQuestions(questionFilters);

    // ─── Derived ───
    const filteredSubjects = useMemo(() => {
        if (!selectedClassId) return subjects;
        return subjects.filter(s => String(s.classId) === selectedClassId || s.classId === 'all');
    }, [subjects, selectedClassId]);

    const textContents = useMemo(() => contents.filter(c => c.contentType === 'TEXT' || c.contentType === 'PDF'), [contents]);
    const videoContents = useMemo(() => contents.filter(c => c.contentType === 'VIDEO' || c.contentType === 'LINK'), [contents]);
    const imageContents = useMemo(() => contents.filter(c => c.contentType !== 'TEXT' && c.contentType !== 'PDF' && c.contentType !== 'VIDEO' && c.contentType !== 'LINK'), [contents]);

    const isLoading = classesLoading || subjectsLoading || contentLoading || questionsLoading;

    // ─── Handlers ───
    const handleClassChange = (v: string) => {
        setSelectedClassId(v);
        setSelectedSubjectId('');
        setSelectedChapterId('');
        setContentPage(1);
        setQuestionsPage(1);
    };

    const handleSubjectChange = (v: string) => {
        setSelectedSubjectId(v);
        setSelectedChapterId('');
        setContentPage(1);
        setQuestionsPage(1);
    };

    const handleAddContent = async () => {
        if (!addChapterId) return;
        try {
            await createContent({
                chapterId: addChapterId,
                title: addTitle,
                contentType: addContentType,
                contentData: addContentData,
                sequenceOrder: contents.length + 1,
            });
            resetAddForm();
        } catch (e) {
            console.error('Failed to create content:', e);
        }
    };

    const handleAddQuestion = async () => {
        if (!addChapterId) return;
        try {
            await createQuestion({
                chapterId: addChapterId,
                questionText: addQuestionText,
                questionType: addQuestionType,
                marks: Number(addQuestionMarks),
            });
            resetAddForm();
        } catch (e) {
            console.error('Failed to create question:', e);
        }
    };

    const resetAddForm = () => {
        setShowAddModal(false);
        setAddTitle('');
        setAddContentData('');
        setAddContentType('TEXT');
        setAddChapterId('');
        setAddQuestionText('');
        setAddQuestionType('MCQ');
        setAddQuestionMarks('1');
    };

    // ─── Tab Config ───
    const tabs: { key: ContentTab; label: string; icon: React.ElementType; count: number }[] = [
        { key: 'text', label: 'Text / PDF', icon: FileText, count: activeTab === 'text' ? contentTotalElements : textContents.length },
        { key: 'video', label: 'Video', icon: Video, count: activeTab === 'video' ? contentTotalElements : videoContents.length },
        { key: 'image', label: 'Image', icon: Image, count: activeTab === 'image' ? contentTotalElements : imageContents.length },
        { key: 'questions', label: 'Questions', icon: HelpCircle, count: questionTotalElements },
    ];

    const currentContents = activeTab === 'text' ? textContents : activeTab === 'video' ? videoContents : imageContents;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Curriculum Manager</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage all content and questions across classes, subjects, and chapters.
                    </p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filters</span>
                    {(selectedClassId || selectedSubjectId || selectedChapterId) && (
                        <button
                            onClick={() => { setSelectedClassId(''); setSelectedSubjectId(''); setSelectedChapterId(''); }}
                            className="text-xs text-blue-500 hover:text-blue-600 ml-auto"
                        >
                            Clear all
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                        label="Class"
                        value={selectedClassId}
                        onChange={e => handleClassChange(e.target.value)}
                        options={[
                            { label: 'All Classes', value: '' },
                            ...classes.map(c => ({
                                label: c.className || `Grade ${c.grade} - ${c.section}`,
                                value: String(c.id),
                            })),
                        ]}
                    />
                    <Select
                        label="Subject"
                        value={selectedSubjectId}
                        onChange={e => handleSubjectChange(e.target.value)}
                        options={[
                            { label: 'All Subjects', value: '' },
                            ...filteredSubjects.map(s => ({
                                label: s.name,
                                value: String(s.id),
                            })),
                        ]}
                    />
                    <Select
                        label="Chapter"
                        value={selectedChapterId}
                        onChange={e => setSelectedChapterId(e.target.value)}
                        options={[
                            { label: 'All Chapters', value: '' },
                            ...chapters.map(ch => ({
                                label: ch.name,
                                value: ch.id,
                            })),
                        ]}
                    />
                </div>
            </div>

            {/* Content Type Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap inline-flex items-center gap-2 text-sm
                                ${activeTab === tab.key
                                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : activeTab === 'questions' ? (
                    /* Questions Tab */
                    questions.length === 0 ? (
                        <EmptyState label="No questions found" onAdd={() => setShowAddModal(true)} />
                    ) : (
                        <div className="space-y-3">
                            {questions.map(q => (
                                <div
                                    key={q.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex justify-between items-start gap-4"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.questionType === 'MCQ' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                : q.questionType === 'TRUE_FALSE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                }`}>
                                                {q.questionType}
                                            </span>
                                            <span className="text-xs text-gray-400">{q.marks} marks</span>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-white">{q.questionText}</p>
                                        {q.options && q.options.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {q.options.map((opt, i) => (
                                                    <div key={i} className={`text-xs px-2 py-1 rounded ${opt.isCorrect ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {String.fromCharCode(65 + i)}. {opt.optionText} {opt.isCorrect && '✓'}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteQuestion({ chapterId: q.chapterId, questionId: q.id })}
                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    /* Content Tabs (Text/PDF, Video, Image) */
                    currentContents.length === 0 ? (
                        <EmptyState label={`No ${activeTab} content found`} onAdd={() => setShowAddModal(true)} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {currentContents.map(c => (
                                <div
                                    key={c.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <ContentIcon type={c.contentType} />
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-medium">
                                                {c.contentType}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteContent({ chapterId: c.chapterId, contentId: c.id })}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{c.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{c.contentData}</p>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* Pagination Controls */}
            {!isLoading && (
                <PaginationControls
                    currentPage={activeTab === 'questions' ? questionCurrentPage : contentCurrentPage}
                    totalPages={activeTab === 'questions' ? questionTotalPages : contentTotalPages}
                    totalElements={activeTab === 'questions' ? questionTotalElements : contentTotalElements}
                    onPageChange={(p: number) => activeTab === 'questions' ? setQuestionsPage(p) : setContentPage(p)}
                />
            )}

            {/* Add New Modal */}
            <Modal isOpen={showAddModal} onClose={resetAddForm} title={activeTab === 'questions' ? 'Add New Question' : 'Add New Content'}>
                <div className="space-y-4 pt-4">
                    {/* Chapter selector — required for both content and questions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Select
                            label="Class"
                            value={addChapterId ? '' : selectedClassId}
                            onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSubjectId(''); setAddChapterId(''); }}
                            options={[{ label: 'Select Class', value: '' }, ...classes.map(c => ({ label: c.className || `Grade ${c.grade}-${c.section}`, value: String(c.id) }))]}
                        />
                        <Select
                            label="Subject"
                            value={selectedSubjectId}
                            onChange={(e) => { setSelectedSubjectId(e.target.value); setAddChapterId(''); }}
                            options={[{ label: 'Select Subject', value: '' }, ...filteredSubjects.map(s => ({ label: s.name, value: String(s.id) }))]}
                        />
                        <Select
                            label="Chapter"
                            value={addChapterId}
                            onChange={e => setAddChapterId(e.target.value)}
                            options={[{ label: 'Select Chapter', value: '' }, ...chapters.map(ch => ({ label: ch.name, value: ch.id }))]}
                        />
                    </div>

                    {activeTab === 'questions' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question</label>
                                <textarea
                                    value={addQuestionText}
                                    onChange={e => setAddQuestionText(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your question..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Select
                                    label="Type"
                                    value={addQuestionType}
                                    onChange={e => setAddQuestionType(e.target.value as 'MCQ' | 'TRUE_FALSE' | 'SUBJECTIVE')}
                                    options={[
                                        { label: 'MCQ', value: 'MCQ' },
                                        { label: 'True/False', value: 'TRUE_FALSE' },
                                        { label: 'Subjective', value: 'SUBJECTIVE' },
                                    ]}
                                />
                                <Input label="Marks" type="number" value={addQuestionMarks} onChange={e => setAddQuestionMarks(e.target.value)} />
                            </div>
                        </>
                    ) : (
                        <>
                            <Input label="Title" value={addTitle} onChange={e => setAddTitle(e.target.value)} placeholder="Content title" />
                            <Select
                                label="Content Type"
                                value={addContentType}
                                onChange={e => setAddContentType(e.target.value as 'TEXT' | 'VIDEO' | 'PDF' | 'LINK')}
                                options={[
                                    { label: 'Text', value: 'TEXT' },
                                    { label: 'PDF', value: 'PDF' },
                                    { label: 'Video', value: 'VIDEO' },
                                    { label: 'Link', value: 'LINK' },
                                ]}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content / URL</label>
                                <textarea
                                    value={addContentData}
                                    onChange={e => setAddContentData(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter content text, paste a URL, or describe the material..."
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={resetAddForm}>Cancel</Button>
                        <Button
                            onClick={activeTab === 'questions' ? handleAddQuestion : handleAddContent}
                            disabled={!addChapterId}
                        >
                            {activeTab === 'questions' ? 'Add Question' : 'Add Content'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

/* ─── Helper Components ─── */

const EmptyState: React.FC<{ label: string; onAdd: () => void }> = ({ label, onAdd }) => (
    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400 mb-4">{label}</p>
        <Button variant="outline" onClick={onAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New
        </Button>
    </div>
);

const ContentIcon: React.FC<{ type: string }> = ({ type }) => {
    const iconClass = "w-4 h-4";
    switch (type) {
        case 'TEXT': return <FileText className={`${iconClass} text-blue-500`} />;
        case 'PDF': return <FileText className={`${iconClass} text-red-500`} />;
        case 'VIDEO': return <Video className={`${iconClass} text-purple-500`} />;
        case 'LINK': return <Video className={`${iconClass} text-indigo-500`} />;
        default: return <Image className={`${iconClass} text-green-500`} />;
    }
};

const PaginationControls: React.FC<{
    currentPage: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, totalElements, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages} ({totalElements} total)
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[2rem] text-center">
                    {currentPage}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
