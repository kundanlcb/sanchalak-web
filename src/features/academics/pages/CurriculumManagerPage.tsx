/**
 * CurriculumManagerPage — Unified content & question manager
 * Shows all curriculum content across classes with filterable tabs
 */
import React, { useState, useMemo, useRef } from 'react';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useSubjects } from '../hooks/useSubjects';
import { useChapters } from '../hooks/curriculum/useChapters';
import { useAllContent } from '../hooks/curriculum/useAllContent';
import type { ChapterContent } from '../types/curriculum';
import { useAllQuestions } from '../hooks/curriculum/useAllQuestions';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import {
    FileText, Video, HelpCircle, Plus, Loader2, Trash2, Filter,
    ChevronLeft, ChevronRight, Upload, Link as LinkIcon
} from 'lucide-react';

type ContentTab = 'content' | 'questions';

export const CurriculumManagerPage: React.FC = () => {
    // ─── Filters ───
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedChapterId, setSelectedChapterId] = useState('');
    const [activeTab, setActiveTab] = useState<ContentTab>('content');
    const [contentPage, setContentPage] = useState(1);
    const [questionsPage, setQuestionsPage] = useState(1);

    // ─── Add Modal ───
    const [showAddModal, setShowAddModal] = useState(false);
    const [addTitle, setAddTitle] = useState('');
    const [addTextContent, setAddTextContent] = useState('');
    const [addVideoUrl, setAddVideoUrl] = useState('');
    const [addPdfUrl, setAddPdfUrl] = useState('');
    const [addLinkUrl, setAddLinkUrl] = useState('');
    const [addChapterId, setAddChapterId] = useState('');
    const [addClassId, setAddClassId] = useState('');
    const [addSubjectId, setAddSubjectId] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    // No separate tab filtering needed — multi-type content all shows together
    const allContents = contents;

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
        if (!addClassId || !addSubjectId) return;
        try {
            let pdfUrl = addPdfUrl;
            // For file uploads, read as base64 data URL
            if (selectedFile) {
                pdfUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(selectedFile);
                });
                if (!addTitle) setAddTitle(selectedFile.name);
            }
            await createContent({
                classId: addClassId,
                subjectId: addSubjectId,
                chapterId: addChapterId || undefined,
                title: addTitle || 'Untitled',
                textContent: addTextContent || undefined,
                videoUrl: addVideoUrl || undefined,
                pdfUrl: pdfUrl || undefined,
                linkUrl: addLinkUrl || undefined,
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
        setAddTextContent('');
        setAddVideoUrl('');
        setAddPdfUrl('');
        setAddLinkUrl('');
        setAddChapterId('');
        setAddClassId('');
        setAddSubjectId('');
        setSelectedFile(null);
        setAddQuestionText('');
        setAddQuestionType('MCQ');
        setAddQuestionMarks('1');
    };

    const addFilteredSubjects = useMemo(() => {
        if (!addClassId) return subjects;
        return subjects.filter(s => String(s.classId) === addClassId);
    }, [subjects, addClassId]);

    // ─── Tab Config ───
    const tabs: { key: ContentTab; label: string; icon: React.ElementType; count: number }[] = [
        { key: 'content', label: 'Content', icon: FileText, count: contentTotalElements },
        { key: 'questions', label: 'Questions', icon: HelpCircle, count: questionTotalElements },
    ];

    // content is shown in a single unified list

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
                    )) : (
                    /* Content */
                    allContents.length === 0 ? (
                        <EmptyState label="No content found" onAdd={() => setShowAddModal(true)} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {allContents.map((c: ChapterContent) => (
                                <div
                                    key={c.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {c.textContent && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"><FileText className="w-3 h-3" />Text</span>}
                                            {c.videoUrl && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"><Video className="w-3 h-3" />Video</span>}
                                            {c.pdfUrl && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"><FileText className="w-3 h-3" />PDF</span>}
                                            {c.linkUrl && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"><LinkIcon className="w-3 h-3" />Link</span>}
                                        </div>
                                        <button
                                            onClick={() => deleteContent({ chapterId: c.chapterId, contentId: c.id })}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{c.title}</h4>
                                    {c.textContent && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1">{c.textContent}</p>}
                                    {c.linkUrl && <a href={c.linkUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block">{c.linkUrl}</a>}
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
                    {/* Class + Subject required, Chapter optional */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Select
                            label="Class *"
                            value={addClassId}
                            onChange={(e) => { setAddClassId(e.target.value); setAddSubjectId(''); setAddChapterId(''); }}
                            options={[{ label: 'Select Class', value: '' }, ...classes.map(c => ({ label: c.className || `Grade ${c.grade}-${c.section}`, value: String(c.id) }))]}
                        />
                        <Select
                            label="Subject *"
                            value={addSubjectId}
                            onChange={(e) => { setAddSubjectId(e.target.value); setAddChapterId(''); }}
                            options={[{ label: 'Select Subject', value: '' }, ...addFilteredSubjects.map(s => ({ label: s.name, value: String(s.id) }))]}
                        />
                        <Select
                            label="Chapter (optional)"
                            value={addChapterId}
                            onChange={e => setAddChapterId(e.target.value)}
                            options={[{ label: 'No Chapter', value: '' }, ...chapters.map(ch => ({ label: ch.name, value: ch.id }))]}
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
                            <Input label="Title *" value={addTitle} onChange={e => setAddTitle(e.target.value)} placeholder="Content title" />

                            {/* Text Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <span className="inline-flex items-center gap-1.5"><FileText className="w-4 h-4 text-blue-500" /> Text Content</span>
                                </label>
                                <textarea
                                    value={addTextContent}
                                    onChange={e => setAddTextContent(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter content text (optional)..."
                                />
                            </div>

                            {/* Video URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <span className="inline-flex items-center gap-1.5"><Video className="w-4 h-4 text-purple-500" /> Video URL</span>
                                </label>
                                <input
                                    type="url"
                                    value={addVideoUrl}
                                    onChange={e => setAddVideoUrl(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://youtube.com/watch?v=... or video URL (optional)"
                                />
                            </div>

                            {/* PDF Upload / URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <span className="inline-flex items-center gap-1.5"><Upload className="w-4 h-4 text-red-500" /> PDF</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setSelectedFile(file);
                                                setAddPdfUrl('');
                                                if (!addTitle) setAddTitle(file.name);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        <Upload className="w-4 h-4" />
                                        {selectedFile ? selectedFile.name : 'Upload PDF'}
                                    </button>
                                    <span className="text-xs text-gray-400 self-center">or</span>
                                    <input
                                        type="url"
                                        value={addPdfUrl}
                                        onChange={e => { setAddPdfUrl(e.target.value); setSelectedFile(null); }}
                                        disabled={!!selectedFile}
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                        placeholder="PDF URL (optional)"
                                    />
                                </div>
                            </div>

                            {/* Link URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <span className="inline-flex items-center gap-1.5"><LinkIcon className="w-4 h-4 text-green-500" /> External Link</span>
                                </label>
                                <input
                                    type="url"
                                    value={addLinkUrl}
                                    onChange={e => setAddLinkUrl(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com/resource (optional)"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={resetAddForm}>Cancel</Button>
                        <Button
                            onClick={activeTab === 'questions' ? handleAddQuestion : handleAddContent}
                            disabled={activeTab === 'questions' ? !addChapterId : (!addClassId || !addSubjectId)}
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
