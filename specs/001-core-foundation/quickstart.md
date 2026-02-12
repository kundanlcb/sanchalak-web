# Phase 1 Developer Quickstart Guide

**Feature**: Core Foundation (001)  
**Target Audience**: Frontend developers joining Sanchalak project  
**Estimated Setup Time**: 30-45 minutes  

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: Version 2.30+ ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

**Recommended VS Code Extensions**:
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- TypeScript and JavaScript Language Features (built-in)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- i18n Ally (lokalise.i18n-ally) - for localization

---

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd sanchalan
```

### 2. Install Dependencies

```bash
npm install
```

**Expected dependencies** (from package.json):
```json
{
  "dependencies": {
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-router-dom": "^6.28.0",
    "axios": "^1.7.0",
    "react-i18next": "^16.0.0",
    "i18next": "^24.0.0",
    "tailwindcss": "^4.1.0",
    "@radix-ui/react-*": "Various (shadcn/ui components)",
    "@tanstack/react-table": "^8.20.0",
    "zod": "^3.24.0",
    "react-hook-form": "^7.53.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "typescript": "5.9.3",
    "vite": "7.2.4",
    "eslint": "9.39.1"
  }
}
```

### 3. Configure Environment Variables

Create `.env.local` file in the project root:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_API=true

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false

# S3/File Upload (for future use)
VITE_UPLOAD_MAX_SIZE_MB=5
```

**Important**: `VITE_USE_MOCK_API=true` uses local mock data from `src/mocks/`. Set to `false` when backend is available.

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5173` (Vite default port).

---

## Project Structure Overview

```
sanchalan/
├── .specify/                    # Specification files (feature specs, constitution)
├── public/                      # Static assets (favicon, robots.txt)
├── specs/                       # Feature specifications
│   └── 001-core-foundation/     # Phase 1 specification
│       ├── spec.md              # Feature requirements
│       ├── plan.md              # Implementation plan
│       ├── research.md          # Technology decisions
│       ├── data-model.md        # Entity definitions
│       ├── quickstart.md        # This file
│       └── contracts/           # API contracts
├── src/
│   ├── components/
│   │   ├── common/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   └── layout/              # Layout components
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── features/                # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/      # Login, OTPVerification, RoleGuard
│   │   │   ├── services/        # authService.ts, authContext.tsx
│   │   │   └── types/           # auth.types.ts
│   │   ├── students/
│   │   │   ├── components/      # StudentList, StudentForm, DocumentUpload
│   │   │   ├── services/        # studentService.ts
│   │   │   └── types/           # student.types.ts
│   │   ├── attendance/
│   │   │   ├── components/      # AttendanceSheet, AttendanceStats
│   │   │   ├── services/        # attendanceService.ts
│   │   │   └── types/           # attendance.types.ts
│   │   └── notices/
│   │       ├── components/      # NoticeBoard, NoticeForm
│   │       ├── services/        # noticeService.ts
│   │       └── types/           # notice.types.ts
│   ├── mocks/
│   │   ├── data/                # JSON mock data files
│   │   │   ├── users.json
│   │   │   ├── students.json
│   │   │   ├── attendance.json
│   │   │   ├── notices.json
│   │   │   └── classes.json
│   │   └── handlers/            # Mock API handlers
│   │       ├── authHandlers.ts
│   │       ├── studentHandlers.ts
│   │       └── ...
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts        # Axios instance with interceptors
│   │   │   ├── config.ts        # API configuration
│   │   │   └── endpoints.ts     # API endpoint constants
│   │   └── storage/
│   │       ├── localStorage.ts  # LocalStorage utilities
│   │       └── sessionStorage.ts
│   ├── utils/
│   │   ├── validation/          # Zod schemas
│   │   ├── permissions/         # RBAC utilities
│   │   └── i18n/                # react-i18next config
│   ├── assets/
│   │   └── sample-ui-images/    # UI design references
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── tests/                        # Test files (mirrors src/)
├── .env.local                    # Environment variables (git-ignored)
├── eslint.config.js              # ESLint configuration
├── package.json
├── tsconfig.json                 # TypeScript config (strict mode)
├── vite.config.ts                # Vite build config
└── README.md
```

---

## Development Workflow

### Adding a New Feature Component

1. **Create Component File**

```bash
# Create feature component in appropriate directory
touch src/features/students/components/StudentCard.tsx
```

2. **Write Component with TypeScript**

```tsx
// src/features/students/components/StudentCard.tsx
import { Student } from '../types/student.types';

interface StudentCardProps {
  student: Student;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        {student.profilePhoto && (
          <img
            src={student.profilePhoto}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-gray-600">{student.admissionNumber}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(student.studentID)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(student.studentID)}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
```

3. **Export Component**

```tsx
// src/features/students/components/index.ts
export { StudentCard } from './StudentCard';
export { StudentList } from './StudentList';
export { StudentForm } from './StudentForm';
```

### Adding a New API Endpoint

1. **Define Types** (if not in data-model.md)

```tsx
// src/features/students/types/student.types.ts
export interface Student {
  studentID: string;
  firstName: string;
  lastName: string;
  // ... other fields from data-model.md
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  // ...
}
```

2. **Create Mock Data** (for development without backend)

```json
// src/mocks/data/students.json
{
  "students": [
    {
      "studentID": "student-001",
      "firstName": "Aarav",
      "lastName": "Patel",
      "dateOfBirth": "2014-05-12T00:00:00Z",
      "gender": "Male",
      "classID": "class-001",
      "admissionNumber": "ADM2024001",
      "status": "Active"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 50,
    "totalPages": 25
  }
}
```

3. **Create Mock Handler**

```ts
// src/mocks/handlers/studentHandlers.ts
import { delay } from '../utils';
import studentsData from '../data/students.json';
import type { Student, StudentListResponse } from '@/features/students/types/student.types';

export const studentHandlers = {
  async getStudents(query: StudentListQuery): Promise<StudentListResponse> {
    await delay(300); // Simulate network latency
    
    // Simulate 5% error rate
    if (Math.random() < 0.05) {
      throw new Error('Failed to fetch students');
    }
    
    return studentsData;
  },
  
  async getStudent(id: string): Promise<Student> {
    await delay(200);
    const student = studentsData.students.find(s => s.studentID === id);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  },
  
  async createStudent(data: CreateStudentRequest): Promise<Student> {
    await delay(400);
    // Mock creation logic
    const newStudent: Student = {
      studentID: `student-${Date.now()}`,
      ...data,
      createdDate: new Date(),
    };
    return newStudent;
  },
};
```

4. **Create Service Layer**

```ts
// src/features/students/services/studentService.ts
import { apiClient } from '@/services/api/client';
import { studentHandlers } from '@/mocks/handlers/studentHandlers';
import type { Student, StudentListQuery, CreateStudentRequest } from '../types/student.types';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const studentService = {
  async getStudents(query: StudentListQuery) {
    if (USE_MOCK_API) {
      return studentHandlers.getStudents(query);
    }
    const response = await apiClient.get<StudentListResponse>('/students', { params: query });
    return response.data;
  },
  
  async getStudent(id: string) {
    if (USE_MOCK_API) {
      return studentHandlers.getStudent(id);
    }
    const response = await apiClient.get<Student>(`/students/${id}`);
    return response.data;
  },
  
  async createStudent(data: CreateStudentRequest) {
    if (USE_MOCK_API) {
      return studentHandlers.createStudent(data);
    }
    const response = await apiClient.post<Student>('/students', data);
    return response.data;
  },
};
```

5. **Use in Component**

```tsx
// src/features/students/components/StudentList.tsx
import { useEffect, useState } from 'react';
import { studentService } from '../services/studentService';
import type { Student } from '../types/student.types';

export const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await studentService.getStudents({ page: 1, limit: 50 });
        setStudents(data.students);
        setError(null);
      } catch (err) {
        setError('Failed to load students. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  
  return (
    <div className="grid gap-4">
      {students.map(student => (
        <StudentCard key={student.studentID} student={student} />
      ))}
    </div>
  );
};
```

### Adding Localization (i18n)

1. **Add Translation Keys**

```json
// public/locales/en/common.json
{
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "enterOTP": "Enter OTP",
    "verifyOTP": "Verify OTP"
  },
  "students": {
    "title": "Students",
    "addStudent": "Add Student",
    "firstName": "First Name",
    "lastName": "Last Name",
    "admissionNumber": "Admission Number"
  }
}
```

```json
// public/locales/hi/common.json
{
  "auth": {
    "login": "लॉगिन",
    "logout": "लॉगआउट",
    "enterOTP": "OTP दर्ज करें",
    "verifyOTP": "OTP सत्यापित करें"
  },
  "students": {
    "title": "छात्र",
    "addStudent": "छात्र जोड़ें",
    "firstName": "पहला नाम",
    "lastName": "अंतिम नाम",
    "admissionNumber": "प्रवेश संख्या"
  }
}
```

2. **Use in Component**

```tsx
import { useTranslation } from 'react-i18next';

export const StudentForm: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <form>
      <label>{t('students.firstName')}</label>
      <input type="text" />
      
      <label>{t('students.lastName')}</label>
      <input type="text" />
      
      <button type="submit">{t('students.addStudent')}</button>
    </form>
  );
};
```

### Testing Responsive Design

1. **Use Tailwind Breakpoints**

```tsx
// Mobile-first approach
<div className="
  flex flex-col         // Default (mobile): vertical stack
  md:flex-row          // Tablet (768px+): horizontal layout
  lg:gap-8             // Desktop (1024px+): larger gaps
  xl:px-12             // Extra large (1280px+): more padding
">
  <div className="w-full md:w-1/2 lg:w-1/3">...</div>
</div>
```

2. **Test at Required Breakpoints**

- **Mobile**: 375px (iPhone SE, primary for parents)
- **Tablet**: 768px (iPad Mini, primary for teachers/staff)
- **Desktop**: 1920px (Admin workstations)

**VS Code DevTools**:
- Press `F12` or `Cmd+Opt+I` to open DevTools
- Click "Toggle device toolbar" (Cmd+Shift+M)
- Test at 375px, 768px, 1024px, 1920px

3. **Ensure Touch Targets**

All interactive elements (buttons, links) MUST have **minimum 44px height/width** for touch accessibility:

```tsx
// Good - meets 44px minimum
<button className="px-4 py-3">Click Me</button>

// Bad - too small for touch
<button className="px-2 py-1">Click Me</button>
```

---

## Common Tasks

### Task 1: Add RBAC Permission Check

```tsx
// src/utils/permissions/checkPermission.ts
import type { User, Feature, Action } from '@/types';

export const checkPermission = (
  user: User,
  feature: Feature,
  action: Action
): boolean => {
  // Admin has all permissions
  if (user.role === 'Admin') return true;
  
  // Teacher permissions
  if (user.role === 'Teacher') {
    if (feature === 'Attendance' && action === 'Create') return true;
    if (feature === 'Students' && action === 'Read') return true;
    return false;
  }
  
  // Parent permissions (read-only for own children)
  if (user.role === 'Parent') {
    return feature === 'Students' && action === 'Read';
  }
  
  // Student permissions (read-only own data)
  if (user.role === 'Student') {
    return ['Attendance', 'Notices'].includes(feature) && action === 'Read';
  }
  
  return false;
};
```

**Usage in Component**:

```tsx
import { checkPermission } from '@/utils/permissions/checkPermission';
import { useAuth } from '@/features/auth/services/authContext';

export const StudentActions: React.FC = () => {
  const { user } = useAuth();
  
  const canEdit = checkPermission(user, 'Students', 'Update');
  const canDelete = checkPermission(user, 'Students', 'Delete');
  
  return (
    <div>
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </div>
  );
};
```

### Task 2: Add Route Protection

```tsx
// src/features/auth/components/RoleGuard.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import type { UserRole } from '../types/auth.types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
```

**Usage in Router**:

```tsx
// src/App.tsx
import { RoleGuard } from '@/features/auth/components/RoleGuard';

<Route 
  path="/students" 
  element={
    <RoleGuard allowedRoles={['Admin', 'Teacher', 'Staff']}>
      <StudentList />
    </RoleGuard>
  } 
/>
```

### Task 3: Switching Between Mock and Real API

**Development** (use mocks):
```bash
# .env.local
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:8080/api
```

**Production** (use backend):
```bash
# .env.production
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.sanchalak.school/api
```

Service layer automatically switches based on `VITE_USE_MOCK_API` flag.

### Task 4: Implementing Theme Support (Light/Dark Mode)

Phase 1 requires light and dark theme support (FR-041 to FR-043). Here's how to implement it:

**Step 1: Configure Tailwind for Dark Mode**

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Define semantic color tokens
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Add more as needed
      }
    }
  }
}
```

**Step 2: Prevent Flash of Unstyled Content (FOUC)**

Add to `index.html` before `</head>`:
```html
<script>
  (function() {
    const theme = localStorage.getItem('theme') || 'system';
    const resolvedTheme = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.classList.add(resolvedTheme);
  })();
</script>
```

**Step 3: Create Theme Context**

Create `src/contexts/ThemeContext.tsx`:
```typescript
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    
    const applied: 'light' | 'dark' = theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(applied);
    setResolvedTheme(applied);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

**Step 4: Create Theme Toggle Component**

Create `src/components/common/ThemeToggle.tsx`:
```typescript
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
      <button
        onClick={() => setTheme('light')}
        className={`rounded p-2 ${
          theme === 'light'
            ? 'bg-white text-blue-600 shadow'
            : 'text-gray-600 dark:text-gray-400'
        }`}
        aria-label="Light theme"
      >
        <Sun className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`rounded p-2 ${
          theme === 'dark'
            ? 'bg-white text-blue-600 shadow dark:bg-gray-700'
            : 'text-gray-600 dark:text-gray-400'
        }`}
        aria-label="Dark theme"
      >
        <Moon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`rounded p-2 ${
          theme === 'system'
            ? 'bg-white text-blue-600 shadow dark:bg-gray-700'
            : 'text-gray-600 dark:text-gray-400'
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-5 w-5" />
      </button>
    </div>
  );
}
```

**Step 5: Add Theme Support to Components**

Use `dark:` variants for all color-related classes:
```tsx
// Example: StudentCard component
export function StudentCard({ student }: { student: Student }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {student.firstName} {student.lastName}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Admission: {student.admissionNumber}
      </p>
    </div>
  );
}
```

**Step 6: Test Theme Switching**

1. Add `<ThemeToggle />` to your header/navigation
2. Toggle between light, dark, and system modes
3. Verify theme persists after page refresh
4. Test all components for contrast (WCAG AA: 4.5:1 for text)
5. Use Chrome DevTools → Lighthouse to check accessibility scores

**Best Practices**:
- Always pair light and dark variants: `bg-white dark:bg-gray-900`
- Test in both themes before marking component complete
- Use semantic color names in Tailwind config for consistency
- Ensure WCAG AA contrast ratios (4.5:1 minimum for text)

See [research.md](research.md) Section 16 for detailed implementation guide.

---

## Troubleshooting

### Problem: TypeScript Errors on Any Types

**Error**: `Type 'any' is not assignable to type 'Student'`

**Solution**: Define explicit types:
```tsx
// ❌ Bad
const data: any = await fetchData();

// ✅ Good
const data: Student = await studentService.getStudent(id);
```

### Problem: ESLint Warnings

**Error**: `React Hook useEffect has a missing dependency`

**Solution**: Add dependency or use ESLint disable comment (with justification):
```tsx
// ✅ Option 1: Add dependency
useEffect(() => {
  fetchData();
}, [fetchData]);

// ✅ Option 2: Disable with justification
useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // Only run on mount - fetchData reference changes on every render
}, []);
```

### Problem: Mock API Not Working

**Error**: `Failed to fetch students`

**Checklist**:
1. Verify `.env.local` has `VITE_USE_MOCK_API=true`
2. Check mock data file exists: `src/mocks/data/students.json`
3. Verify mock handler returns correct type
4. Restart dev server: `npm run dev` (env vars require restart)

### Problem: i18n Keys Not Translating

**Error**: Shows key instead of translation (e.g., `students.title`)

**Solution**:
1. Verify translation file exists: `public/locales/en/common.json`
2. Check namespace matches: `useTranslation('common')`
3. Ensure i18n initialized in `main.tsx`
4. Check browser console for i18n errors

---

## Code Quality Checks

Before committing code, run:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build production bundle
npm run build
```

**Pre-commit Hook** (automatically runs on `git commit`):
- ESLint checks
- TypeScript type checking
- Prettier formatting

---

## Additional Resources

- **Constitution**: `.specify/memory/constitution.md` - Project principles and standards
- **Phase 1 Spec**: `specs/001-core-foundation/spec.md` - Feature requirements
- **Data Model**: `specs/001-core-foundation/data-model.md` - Entity definitions
- **API Contracts**: `specs/001-core-foundation/contracts/` - API specifications
- **Research**: `specs/001-core-foundation/research.md` - Technology decisions

### External Documentation
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Router v6](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [react-i18next](https://react.i18next.com/)
- [Zod Validation](https://zod.dev/)

---

## Getting Help

1. **Check Constitution**: Most architectural decisions documented in `.specify/memory/constitution.md`
2. **Review Spec**: Feature requirements in `specs/001-core-foundation/spec.md`
3. **Search Codebase**: Use grep or VS Code search for similar implementations
4. **Ask Team**: Slack #sanchalan-dev channel for questions

Welcome to the Sanchalak project! 🚀
