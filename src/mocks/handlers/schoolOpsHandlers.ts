import { http, HttpResponse, delay } from 'msw';
import type { Teacher, Class, Routine } from '../../features/school-ops/types';
import { db } from '../db';

export const schoolOpsHandlers = [
  // --- Teachers ---
  http.get('/api/school-ops/teachers', async () => {
    await delay(300);
    return HttpResponse.json(db.teachers);
  }),

  http.get('/api/school-ops/teachers/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const teacher = db.teachers.find((t) => t.id === id);
    if (!teacher) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(teacher);
  }),

  http.post('/api/school-ops/teachers', async ({ request }) => {
    await delay(500);
    const data = await request.json() as Partial<Teacher>;
    const newTeacher: Teacher = {
      ...data,
      id: `TCH-${Date.now()}`, // Simple ID generation
      isActive: true,
      joiningDate: data.joiningDate || new Date().toISOString(),
      specializedSubjects: data.specializedSubjects || []
    } as Teacher;
    db.teachers.push(newTeacher);
    return HttpResponse.json(newTeacher);
  }),

  http.put('/api/school-ops/teachers/:id', async ({ request, params }) => {
    await delay(400);
    const { id } = params;
    const data = await request.json() as Partial<Teacher>;
    const index = db.teachers.findIndex((t) => t.id === id);
    
    if (index === -1) return new HttpResponse(null, { status: 404 });
    
    db.teachers[index] = { ...db.teachers[index], ...data };
    return HttpResponse.json(db.teachers[index]);
  }),

  http.delete('/api/school-ops/teachers/:id', async ({ params }) => {
    await delay(400);
    const { id } = params;
    // Validation: Check if assigned to routine
    const isAssigned = db.routines.some(r => r.teacherId === id);
    if (isAssigned) {
      return HttpResponse.json(
        { message: "Cannot delete teacher assigned to active routines." }, 
        { status: 400 }
      );
    }
    
    const index = db.teachers.findIndex((t) => t.id === id);
    if (index !== -1) {
        db.teachers.splice(index, 1);
        return HttpResponse.json({ success: true, id });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // --- Classes ---
  http.get('/api/school-ops/classes', async () => {
    await delay(200);
    return HttpResponse.json(db.classes);
  }),

  http.post('/api/school-ops/classes', async ({ request }) => {
    await delay(400);
    const data = await request.json() as Partial<Class>;
    const newClass: Class = {
        ...data,
        classID: `CLS-${Date.now()}`,
    } as Class;
    db.classes.push(newClass);
    return HttpResponse.json(newClass);
  }),
  
  // --- Routines ---
  http.get('/api/school-ops/routines', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const classId = url.searchParams.get('classId');
    const teacherId = url.searchParams.get('teacherId');

    let result = db.routines;
    if (classId) result = result.filter(r => r.classId === classId);
    if (teacherId) result = result.filter(r => r.teacherId === teacherId);

    return HttpResponse.json(result);
  }),

  http.post('/api/school-ops/routines', async ({ request }) => {
    await delay(400);
    const data = await request.json() as Routine;
    
    // Strict Blocking Validation: Double Booking
    const isDoubleBooked = db.routines.some(r => 
        r.day === data.day && 
        r.period === data.period && 
        r.teacherId === data.teacherId
    );

    if (isDoubleBooked) {
        return HttpResponse.json(
            { message: "Teacher is already assigned to another class during this period." },
            { status: 409 } // Conflict
        );
    }

    const newRoutine: Routine = {
        ...data,
        id: `RTN-${Date.now()}`
    };
    db.routines.push(newRoutine);
    return HttpResponse.json(newRoutine);
  }),
  
  http.delete('/api/school-ops/routines/:id', async ({ params }) => {
      await delay(200);
      const { id } = params;
      const index = db.routines.findIndex(r => r.id === id);
      if (index !== -1) {
          db.routines.splice(index, 1);
          return HttpResponse.json({ success: true, id });
      }
      return new HttpResponse(null, { status: 404 });
  })
];
