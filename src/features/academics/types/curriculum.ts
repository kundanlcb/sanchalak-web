export interface SubjectChapter {
    id: string;
    classId: string;
    subjectId: string;
    name: string;
    description?: string;
    sequenceOrder: number;
}

export interface CreateSubjectChapterRequest {
    classId: string;
    subjectId: string;
    name: string;
    description?: string;
    sequenceOrder: number;
}

export interface ChapterContent {
    id: string;
    chapterId: string;
    classId?: number;
    subjectId?: number;
    title: string;
    textContent?: string;
    videoUrl?: string;
    pdfUrl?: string;
    linkUrl?: string;
    sequenceOrder: number;
}

export interface CreateChapterContentRequest {
    title: string;
    classId: string;
    subjectId: string;
    chapterId?: string;
    textContent?: string;
    videoUrl?: string;
    pdfUrl?: string;
    linkUrl?: string;
    sequenceOrder?: number;
}

export interface QuestionOption {
    id?: string;
    optionText: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    chapterId: string;
    questionText: string;
    questionType: 'MCQ' | 'TRUE_FALSE' | 'SUBJECTIVE';
    marks: number;
    options?: QuestionOption[];
}

export interface CreateQuestionRequest {
    questionText: string;
    questionType: 'MCQ' | 'TRUE_FALSE' | 'SUBJECTIVE';
    marks: number;
    options?: QuestionOption[];
}
