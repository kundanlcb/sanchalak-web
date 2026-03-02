import React, { useState, useMemo } from 'react';
import { useExamTerms } from '../hooks/useExamTerms';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useSubjects } from '../hooks/useSubjects';
import { useExamSchedules } from '../hooks/useExamSchedules';
import { useExamQuestions } from '../hooks/useExamQuestions';
import { useChapters } from '../hooks/curriculum/useChapters';
import { useAllQuestions } from '../hooks/curriculum/useAllQuestions';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { Loader2, Plus, Trash2, FileQuestion, Check, X } from 'lucide-react';

export const ExamQuestionPaper: React.FC = () => {
    const { examTerms } = useExamTerms();
    const { classes } = useAcademicStructure();
    const { subjects } = useSubjects();

    const [selectedTerm, setSelectedTerm] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedChapter, setSelectedChapter] = useState<string>('');

    // New Question Form State
    const [showNewForm, setShowNewForm] = useState(false);
    const [newText, setNewText] = useState('');
    const [newType, setNewType] = useState<'MCQ' | 'TRUE_FALSE' | 'SUBJECTIVE'>('SUBJECTIVE');
    const [newMarks, setNewMarks] = useState(5);

    // Mocks / hooks for schedules & papers
    const { schedules } = useExamSchedules({
        examTermId: selectedTerm || undefined,
        classId: selectedClass || undefined,
    });

    const selectedSchedule = useMemo(() =>
        schedules.find(s => s.subjectId === selectedSubject),
        [schedules, selectedSubject]
    );

    const {
        examQuestions, totalMarks, isLoading: loadingQuestions,
        addQuestion, removeQuestion, isAdding
    } = useExamQuestions(selectedSchedule?.id);

    // Fetch Chapters
    const { chapters } = useChapters(selectedClass || undefined, selectedSubject || undefined);

    // Fetch question bank for the selected class + subject + (optional) chapter
    const { questions: questionBank, isLoading: loadingBank, createQuestion, isCreating } = useAllQuestions({
        classId: selectedClass || undefined,
        subjectId: selectedSubject || undefined,
        chapterId: selectedChapter || undefined,
        size: 100,
    });

    // Filter out questions already added to this exam
    const addedQuestionIds = new Set(examQuestions.map(eq => String(eq.question.id)));
    const availableQuestions = questionBank.filter(q => !addedQuestionIds.has(q.id));

    const handleAdd = async (questionId: string, marks: number) => {
        await addQuestion({
            questionId,
            marks,
            sequenceOrder: examQuestions.length + 1,
        });
    };

    const handleCreateNewQuestion = async () => {
        if (!selectedChapter || !newText.trim()) return;

        try {
            const created = await createQuestion({
                chapterId: selectedChapter,
                questionText: newText,
                questionType: newType,
                marks: newMarks,
            });
            // Automatically add the newly created question to the exam paper
            if (created && created.id) {
                await handleAdd(String(created.id), created.marks);
                setShowNewForm(false);
                setNewText('');
            }
        } catch (error) {
            console.error("Failed to create question", error);
        }
    };

    const termOptions = examTerms.map(t => ({ value: String(t.id), label: t.name }));
    const classOptions = classes.map((c: any) => ({ value: String(c.id), label: c.name || c.className }));
    const subjectOptions = subjects
        .filter(s => String(s.classId) === selectedClass)
        .map(s => ({ value: s.id, label: s.name }));
    const chapterOptions = chapters.map(c => ({ value: c.id, label: c.name }));

    const isReady = selectedTerm && selectedClass && selectedSubject && selectedSchedule;

    return (
        <div className="space-y-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Question Paper Builder</h2>
            <p className="text-sm text-gray-500">Select an exam, class, and subject to build the question paper from the curriculum question bank.</p>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-56">
                    <Select
                        label="Exam Term"
                        options={[{ value: '', label: 'Select Term' }, ...termOptions]}
                        value={selectedTerm}
                        onChange={(e) => { setSelectedTerm(e.target.value); setSelectedSubject(''); }}
                    />
                </div>
                <div className="w-full sm:w-56">
                    <Select
                        label="Class"
                        options={[{ value: '', label: 'Select Class' }, ...classOptions]}
                        value={selectedClass}
                        onChange={(e) => { setSelectedClass(e.target.value); setSelectedSubject(''); }}
                    />
                </div>
                <div className="w-full sm:w-56">
                    <Select
                        label="Subject"
                        options={[{ value: '', label: 'Select Subject' }, ...subjectOptions]}
                        value={selectedSubject}
                        onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter(''); }}
                    />
                </div>
                {selectedSubject && (
                    <div className="w-full sm:w-56">
                        <Select
                            label="Chapter (Optional Filter)"
                            options={[{ value: '', label: 'All Chapters' }, ...chapterOptions]}
                            value={selectedChapter}
                            onChange={(e) => setSelectedChapter(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {!isReady && (
                <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <FileQuestion className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    {!selectedSchedule && selectedSubject
                        ? 'No exam schedule found for this combination. Please configure the schedule first.'
                        : 'Select Exam Term, Class, and Subject to build a question paper.'}
                </div>
            )}

            {isReady && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Selected Questions */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Question Paper
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({totalMarks} / {selectedSchedule.maxMarks} marks)
                                </span>
                            </h3>
                            {totalMarks === selectedSchedule.maxMarks && (
                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                    <Check className="w-4 h-4" /> Marks match
                                </span>
                            )}
                            {totalMarks > selectedSchedule.maxMarks && (
                                <span className="text-red-500 text-sm font-medium">
                                    ⚠ Exceeds max marks by {totalMarks - selectedSchedule.maxMarks}
                                </span>
                            )}
                        </div>

                        {loadingQuestions ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                        ) : examQuestions.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                No questions added yet. Pick from the question bank →
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {examQuestions.map((eq, idx) => (
                                    <div key={eq.id} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg group">
                                        <span className="text-xs font-bold text-gray-400 mt-1 min-w-[1.5rem]">Q{idx + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">{eq.question.questionText}</p>
                                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                                <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">{eq.question.questionType}</span>
                                                <span>{eq.marks} marks</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeQuestion(eq.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Question Bank */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Question Bank
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({availableQuestions.length} available)
                                </span>
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowNewForm(!showNewForm)}
                                className="flex items-center gap-1 text-xs"
                            >
                                {showNewForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                {showNewForm ? 'Cancel' : 'Create New'}
                            </Button>
                        </div>

                        {showNewForm && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3 mb-4">
                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Create New Question</h4>
                                {!selectedChapter ? (
                                    <p className="text-xs text-red-500">Please select a Chapter from the top filter to create a question.</p>
                                ) : (
                                    <>
                                        <textarea
                                            className="w-full rounded-md border-gray-300 dark:border-gray-600 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-2 py-1.5 border"
                                            rows={2}
                                            placeholder="Enter question text..."
                                            value={newText}
                                            onChange={(e) => setNewText(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <select
                                                className="rounded-md border-gray-300 dark:border-gray-600 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-2 py-1.5 border w-1/2"
                                                value={newType}
                                                onChange={(e) => setNewType(e.target.value as any)}
                                            >
                                                <option value="SUBJECTIVE">Subjective</option>
                                                <option value="MCQ">Multiple Choice</option>
                                                <option value="TRUE_FALSE">True / False</option>
                                            </select>
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Marks"
                                                className="rounded-md border-gray-300 dark:border-gray-600 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-2 py-1.5 border w-1/4"
                                                value={newMarks}
                                                onChange={(e) => setNewMarks(parseInt(e.target.value) || 1)}
                                            />
                                            <Button
                                                onClick={handleCreateNewQuestion}
                                                disabled={isCreating || !newText.trim()}
                                                className="w-1/4 text-xs"
                                            >
                                                {isCreating ? 'Saving...' : 'Save & Add'}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {loadingBank ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                        ) : availableQuestions.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                {questionBank.length === 0 ? 'No questions in the curriculum for this subject.' : 'All questions already added!'}
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                                {availableQuestions.map(q => (
                                    <div key={q.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">{q.questionText}</p>
                                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                                <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">{q.questionType}</span>
                                                <span>{q.marks} marks</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleAdd(q.id, q.marks)}
                                            disabled={isAdding}
                                            className="shrink-0 flex items-center gap-1 text-xs px-2 py-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
