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
  { name: 'Teachers', link: '/school-ops/teachers' },
  { name: 'Classes', link: '/school-ops/classes' },
  { name: 'Routine', link: '/school-ops/routine' },
  { name: 'Subjects', link: '/school-ops/subjects' },
  { name: 'Fees', link: '/finance/fees' },
  { name: 'Payroll', link: '/finance/payroll' },
  { name: 'Pay Fees', link: '/finance/fees/payment' },
  { name: 'Reports', link: '/finance/reports' },
];

export const searchService = {
  /** Search students only — used by the header search bar. */
  searchStudents: async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];
    try {
      const studentResponse = await getStudents({ search: query, limit: 8 });
      return studentResponse.students.map(s => ({
        id: String(s.id),
        type: 'student' as const,
        title: s.name,
        subtitle: [
          s.className ? `Class: ${s.className}` : (s.classId ? `Class: ${s.classId}` : null),
          s.rollNumber ? `Roll: ${s.rollNumber}` : null,
        ].filter(Boolean).join('  •  '),
        link: `/students/${s.id}`
      }));
    } catch (error) {
      console.error('Student search error', error);
      return [];
    }
  },

  /** Full search across students, teachers, and pages — kept for future use. */
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
      const studentResponse = await getStudents({ search: query, limit: 5 });
      const studentResults: SearchResult[] = studentResponse.students.map(s => ({
        id: String(s.id),
        type: 'student' as const,
        title: s.name,
        subtitle: `Class: ${s.classId} | ID: ${s.id}`,
        link: `/students/${s.id}`
      }));

      // 3. Search Teachers
      const allTeachers = await schoolOpsApi.getTeachers();
      const teacherResults: SearchResult[] = allTeachers
        .filter(t => t.name.toLowerCase().includes(lowerQuery) || t.email.toLowerCase().includes(lowerQuery))
        .slice(0, 5)
        .map(t => ({
          id: String(t.id),
          type: 'teacher' as const,
          title: t.name,
          subtitle: t.email,
          link: `/admin/teachers/${t.id}`
        }));

      return [...pageResults, ...studentResults, ...teacherResults];

    } catch (error) {
      console.error("Global search error", error);
      return pageResults;
    }
  }
};

