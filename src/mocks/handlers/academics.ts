import { http, HttpResponse, delay } from 'msw';
import type { ExamTerm, Subject, MarkEntry } from '../../features/academics/types/index';
// @ts-ignore
import examsData from '../../mocks/data/exams.json';
// @ts-ignore
import subjectsData from '../../mocks/data/subjects.json';
// @ts-ignore
import marksData from '../../mocks/data/marks.json';

// In-memory storage for the session
let exams: ExamTerm[] = examsData as unknown as ExamTerm[];
let subjects: Subject[] = subjectsData as unknown as Subject[];
let marks: MarkEntry[] = marksData as unknown as MarkEntry[];

export const academicsHandlers = [
  // Exam Terms
  http.get('/api/academics/exam-terms', async () => {
    await delay(300);
    return HttpResponse.json(exams);
  }),

  http.post('/api/academics/exam-terms', async ({ request }) => {
    await delay(500);
    const data = await request.json() as Partial<ExamTerm>;
    const term: ExamTerm = {
      ...data,
      id: `term_${Date.now()}`,
      academicYear: '2025-2026',
      isActive: true, // Default to true for now
    } as ExamTerm;
    exams.push(term);
    return HttpResponse.json(term);
  }),

  // Subjects
  http.get('/api/academics/subjects', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const classId = url.searchParams.get('classId');
    
    if (classId) {
      return HttpResponse.json(subjects.filter((s) => s.classId === classId));
    }
    return HttpResponse.json(subjects);
  }),

  http.post('/api/academics/subjects', async ({ request }) => {
    await delay(500);
    const data = await request.json() as Partial<Subject>;
    const subject: Subject = {
      ...data,
      id: `subj_${Date.now()}`,
    } as Subject;
    subjects.push(subject);
    return HttpResponse.json(subject);
  }),

  // Marks
  http.get('/api/academics/marks', async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const examTermId = url.searchParams.get('examTermId');
    const subjectId = url.searchParams.get('subjectId');
    const studentId = url.searchParams.get('studentId');
    
    let filtered = marks;
    if (examTermId) filtered = filtered.filter(m => m.examTermId === examTermId);
    if (subjectId) filtered = filtered.filter(m => m.subjectId === subjectId);
    if (studentId) filtered = filtered.filter(m => m.studentId === studentId);
    
    return HttpResponse.json(filtered);
  }),

  http.post('/api/academics/marks', async ({ request }) => {
    await delay(300);
    // Assuming partial updates or single mark updates
    const data = await request.json() as Partial<MarkEntry>;
    
    if (!data.studentId || !data.examTermId || !data.subjectId) {
         return new HttpResponse(null, { status: 400 });
    }

    const existingIndex = marks.findIndex(
      (m) => m.studentId === data.studentId && 
             m.examTermId === data.examTermId && 
             m.subjectId === data.subjectId
    );
  
    const markEntry: MarkEntry = {
      id: existingIndex > -1 ? marks[existingIndex].id : `mark_${Date.now()}`,
      studentId: data.studentId,
      examTermId: data.examTermId,
      subjectId: data.subjectId,
      marksObtained: data.marksObtained || 0,
      remarks: data.remarks || '',
      lastUpdated: new Date().toISOString(),
    };
  
    if (existingIndex > -1) {
      marks[existingIndex] = { ...marks[existingIndex], ...markEntry };
    } else {
      marks.push(markEntry);
    }
    return HttpResponse.json(markEntry);
  })
];
