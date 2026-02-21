import { http, HttpResponse, delay } from 'msw';
import { type Homework } from '../../features/homework/types/index';
// @ts-ignore
import homeworkData from '../../mocks/data/homework.json';

// In-memory storage for the session
let homeworkList: Homework[] = homeworkData as unknown as Homework[];

export const homeworkHandlers = [
  // List all homework or filter by class/subject
  http.get('/api/homework', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const classId = url.searchParams.get('classId');
    const subjectId = url.searchParams.get('subjectId');

    if (classId && subjectId) {
      return HttpResponse.json(
        homeworkList.filter((h) => String(h.classId) === classId && String(h.subjectId) === subjectId)
      );
    }

    if (classId) {
      return HttpResponse.json(homeworkList.filter((h) => String(h.classId) === classId));
    }

    return HttpResponse.json(homeworkList);
  }),

  // Get specific homework
  http.get('/api/homework/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const homework = homeworkList.find((h) => h.id === id);
    if (!homework) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(homework);
  }),

  // Create homework
  http.post('/api/homework', async ({ request }) => {
    await delay(500);
    const data = await request.json() as Partial<Homework>;

    const newHomework: Homework = {
      ...data,
      id: `hw_${Date.now()}`,
      createdAt: new Date().toISOString(),
      attachments: [] // Attachments logic often handled via separate upload mock
    } as Homework;

    homeworkList.push(newHomework);
    return HttpResponse.json(newHomework, { status: 201 });
  }),

  // Delete homework
  http.delete('/api/homework/:id', async ({ params }) => {
    await delay(300);
    const { id } = params;
    homeworkList = homeworkList.filter((h) => h.id !== id);
    return new HttpResponse(null, { status: 204 });
  })
];
