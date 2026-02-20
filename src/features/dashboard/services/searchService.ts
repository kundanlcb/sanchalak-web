import { getStudents } from '../../students/services/studentService';
import { schoolOpsApi } from '../../school-ops/services/api';

export interface SearchResult {
  id: string;
  type: 'student' | 'teacher' | 'page';
  title: string;
  subtitle?: string;
  link: string;
}

const APP_PAGES = [
  { name: 'Dashboard', link: '/' },
  { name: 'Students', link: '/students' },
  // { name: 'Admission', link: '/students/admission' }, // Assuming route
  { name: 'Teachers', link: '/school-ops/teachers' },
  { name: 'Classes', link: '/school-ops/classes' }, // Correct route from Tasks/Plan? Need to verify routing.
  { name: 'Routine', link: '/school-ops/routine' },
  { name: 'Subjects', link: '/school-ops/subjects' },
  { name: 'Fees', link: '/finance/fees' },
  { name: 'Payroll', link: '/finance/payroll' },
  { name: 'Pay Fees', link: '/finance/fees/payment' },
  { name: 'Reports', link: '/finance/reports' },
];

export const searchService = {
  globalSearch: async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();

    // 1. Search Pages
    const pageResults: SearchResult[] = APP_PAGES
      .filter(p => p.name.toLowerCase().includes(lowerQuery))
      .map(p => ({
        id: `page-${p.name}`,
        type: 'page',
        title: p.name,
        subtitle: 'Navigation',
        link: p.link
      }));

    try {
      // 2. Search Students
      // Assuming getStudents supports pagination, we ask for small limit
      const studentResponse = await getStudents({ search: query, limit: 5 });
      const studentResults: SearchResult[] = studentResponse.students.map(s => ({
        id: String(s.id),
        type: 'student',
        title: s.name,
        subtitle: `Class: ${s.classId} | ID: ${s.id}`,
        link: `/students/${s.id}`
      }));

      // 3. Search Teachers
      // schoolOpsApi.getTeachers returns all. We filter client side for now as per plan/mock limitation.
      const allTeachers = await schoolOpsApi.getTeachers();
      const teacherResults: SearchResult[] = allTeachers
        .filter(t => t.name.toLowerCase().includes(lowerQuery) || t.email.toLowerCase().includes(lowerQuery))
        .slice(0, 5)
        .map(t => ({
          id: String(t.id),
          type: 'teacher',
          title: t.name,
          subtitle: t.email,
          link: `/admin/teachers/${t.id}`
        }));

      return [...pageResults, ...studentResults, ...teacherResults];

    } catch (error) {
      console.error("Global search error", error);
      // Return at least page results if data fetch fails
      return pageResults;
    }
  }
};
