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
    title: string;
    contentType: 'TEXT' | 'VIDEO' | 'PDF' | 'LINK';
    contentData: string;
    sequenceOrder: number;
}

export interface CreateChapterContentRequest {
    title: string;
    contentType: 'TEXT' | 'VIDEO' | 'PDF' | 'LINK';
    contentData: string;
    sequenceOrder: number;
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
