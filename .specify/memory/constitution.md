<!--
SYNC IMPACT REPORT
==================
Version Change: 1.1.0 → 1.2.0
Date: 2026-02-11 (Second Amendment)
Type: Minor Amendment - Theme Support Enhancement

Principles Enhanced:
  VI. User Experience & Accessibility - Added light/dark theme support requirements

New Requirements Added:
  - Light and dark theme modes with manual toggle
  - Theme preference persistence in localStorage
  - WCAG AA contrast ratios in both themes (4.5:1 for text)
  - Theme toggle accessible from main navigation
  - Dark mode implementation via Tailwind `dark:` variants or MUI theme switching
  - Testing requirement: all components in both themes before feature completion

Rationale:
  - Reduces eye strain during extended usage (teachers marking attendance, admin data entry)
  - Saves battery on mobile OLED displays (60%+ of parent users on mobile)
  - Modern UX expectation - 70% of users prefer dark mode availability
  - Accessibility benefit for light-sensitive users

Templates Requiring Updates:
  ✅ Phase 1 Spec: Added FR-041 to FR-043 (theme toggle, persistence, contrast ratios)
  ✅ research.md: Added Section 16 on dark mode implementation
  ✅ data-model.md: Added themePreference field to User entity
  ✅ plan.md: Updated Technical Context with theme support details
  ✅ quickstart.md: Added Task 4 for implementing theme support

Follow-up Actions:
  - Install lucide-react icons for theme toggle (Sun, Moon, Monitor)
  - Configure Tailwind darkMode: 'class' strategy
  - Create ThemeContext and ThemeProvider in src/contexts/
  - Add theme initialization script to index.html to prevent FOUC

Previous Versions:
  Version: 1.1.0 | Amended: 2026-02-11 (responsive design, mock data)
  Version: 1.0.0 | Ratified: 2026-02-10 (original constitution)
-->

# Sanchalak Web Admin Portal Constitution

## Core Principles

### I. Role-Based Security First

**MUST** implement comprehensive Role-Based Access Control (RBAC) for all features. Every component, route, and API call MUST validate user permissions before rendering or executing. Authentication MUST use JWT tokens provided by the Spring Boot backend with proper token refresh mechanisms.

**Rationale**: The system manages sensitive academic and financial data for multiple user types (Admin, Teacher, Staff, Student, Parent). Unauthorized access could lead to data breaches, privacy violations, and regulatory non-compliance.

**Enforcement**:
- All protected routes MUST include permission guards
- Components MUST conditionally render based on user roles
- API calls MUST include authentication headers
- Permission checks MUST fail closed (deny by default)

### II. Component-Driven Architecture

**MUST** build features using reusable, self-contained React components following atomic design principles. Components MUST be organized by function (not by type), with clear props interfaces and documented usage patterns. Each component MUST have a single responsibility. **Components MUST be modular and reusable across features to maintain consistency.**

**Rationale**: Sanchalak has multiple complex modules (SIS, Attendance, Exams, Fees, Payroll). Reusable components reduce duplication, ensure consistency, and accelerate development of new features. **Modular architecture enables parallel development and easier testing.**

**Enforcement**:
- Components MUST accept typed props (TypeScript interfaces)
- Components MUST NOT directly access global state (use props/context)
- Shared UI components (buttons, forms, modals) MUST live in `src/components/common/`
- Feature components MUST be co-located with their feature logic in `src/features/<feature-name>/`
- **Component directory structure**: `src/components/common/` (shared), `src/features/<feature>/components/` (feature-specific)
- Avoid prop drilling beyond 2 levels (use Context API or state management)
- **Reuse Phase 1 components in Phase 2 & 3 - do not duplicate**

### III. Type Safety & Code Quality

**MUST** use TypeScript in strict mode for all source files. Zero tolerance for `any` types without explicit justification in code comments. ESLint MUST pass without warnings before any commit. Code MUST follow consistent formatting via automated tools.

**Rationale**: The admin portal handles complex data structures (student records, fee schedules, exam results). Type safety prevents runtime errors, improves refactoring confidence, and serves as live documentation.

**Enforcement**:
- `tsconfig.json` MUST have `strict: true`
- Linter MUST block `any` types (exception: external APIs without types, with comment)
- Pre-commit hooks MUST run ESLint and type checking
- Pull requests failing type checks MUST be rejected

### IV. Backend Integration Standards

**MUST** define clear API contracts for all backend endpoints with typed request/response models. All API calls MUST handle loading states, error states, and success states explicitly. Network errors MUST be user-friendly and actionable. API service modules MUST be separate from UI components. **During development before backend availability, MUST use JSON mock data files that mirror planned API structures.**

**Rationale**: The React app depends on the Spring Boot backend for production. Clear contracts prevent integration bugs. Mock data enables parallel frontend/backend development without blocking. Graceful error handling ensures users aren't blocked by network issues.

**Enforcement**:
- API client functions MUST live in `src/services/api/`
- Mock data MUST be stored in `src/mocks/` directory organized by feature (e.g., `students.json`, `attendance.json`)
- Mock service layer MUST simulate realistic API delays (200-500ms) and error scenarios (5% failure rate)
- Each endpoint MUST have TypeScript interfaces for request/response shared between mocks and real APIs
- Components MUST show loading spinners during API calls
- Error messages MUST be localized and user-friendly
- Retry logic MUST be implemented for transient failures
- API responses MUST be validated before use
- Mock data MUST be replaced with real API calls via configuration flag (e.g., `USE_MOCK_API` env variable)

### V. Performance & Scalability

**MUST** optimize for concurrent usage by 500+ users during peak hours (morning attendance). List views MUST implement pagination or virtualization for datasets >100 items. Bundle size MUST remain under 500KB (gzipped). API calls MUST be debounced/throttled where appropriate. Unnecessary re-renders MUST be prevented via memoization.

**Rationale**: Morning attendance marking generates peak load. Poor performance frustrates users and reduces adoption. Large bundles harm mobile users on slow networks.

**Enforcement**:
- Use React.memo, useMemo, useCallback for expensive operations
- Implement virtual scrolling for attendance rosters and student lists
- Lazy load routes using React.lazy and Suspense
- Monitor bundle size in build output (fail builds over 500KB)
- Conduct load testing for critical paths (attendance, fee payments)

### VI. User Experience & Accessibility

**MUST** support localization for Hindi and English (extensible to regional languages). UI text MUST use i18n keys (no hardcoded strings). Interface MUST be professional, consistent, and **fully responsive for mobile (320px+), tablet (768px+), and desktop (1920x1080) displays**. **MUST support light and dark theme modes with user preference persistence**. Form validation MUST provide clear, real-time feedback. Critical actions (deletions, financial transactions) MUST require confirmation. **Mobile-first design approach with touch-optimized controls (44px minimum touch targets).**

**Rationale**: Schools in rural areas need Hindi/regional language support. Professional UX increases trust and adoption. **Admin staff use tablets for mobility, teachers mark attendance on mobile/tablets, parents access via mobile primarily**. **Dark theme reduces eye strain during extended usage and saves battery on OLED displays**. Clear errors reduce support burden. Responsive design ensures accessibility across all devices.

**Enforcement**:
- All user-facing strings MUST use i18n library (e.g., react-i18next)
- Forms MUST validate on blur and show inline errors
- Modal confirmations MUST be used for destructive actions
- UI components MUST follow Material UI or Tailwind design system consistently
- **Application MUST be tested at 3 breakpoints: mobile (375px), tablet (768px), desktop (1920px)**
- **Touch targets MUST be minimum 44x44px for interactive elements**
- **Layouts MUST use responsive units (rem, %, vw/vh) not fixed pixels**
- **Reference UI designs in `src/assets/sample-ui-images/` for styling consistency**
- **Theme toggle MUST be accessible from main navigation in all views**
- **Theme preference MUST persist in localStorage and apply on subsequent sessions**
- **All UI components MUST maintain WCAG AA contrast ratios (4.5:1 for text) in both light and dark themes**
- **Dark mode MUST use `dark:` Tailwind variants (if Tailwind chosen) or MUI theme switching (if MUI chosen)**
- Test all flows in both Hindi and English before release
- **Test all components in both light and dark themes before marking feature complete**

## Technology Standards

**Stack Requirements**:
- **Frontend Framework**: React 19.x with React DOM
- **Build Tool**: Vite (current version: 7.x)
- **Language**: TypeScript 5.9.x in strict mode
- **UI Library**: Material UI (MUI) or Tailwind CSS for consistent design
- **State Management**: Context API for simple cases; consider Zustand/Redux for complex state
- **Routing**: React Router v6+ with protected route wrappers
- **API Client**: Axios with interceptors for auth and error handling
- **Internationalization**: react-i18next or similar
- **Form Handling**: React Hook Form with Zod or Yup for validation
- **Testing**: Vitest + React Testing Library (when tests requested)

**Storage & Integration**:
- **Backend API**: RESTful endpoints from Java Spring Boot server
- **Authentication**: JWT tokens stored in secure httpOnly cookies or sessionStorage
- **File Uploads**: Direct to S3 with pre-signed URLs (for document uploads)
- **Real-time (future)**: WebSocket or Server-Sent Events for live notifications

## Development Workflow

**Feature Branch Model**:
- Each feature MUST be developed in a branch named `###-feature-name`
- Branch MUST be created from latest `main` or `develop`
- No direct commits to `main` or `develop`

**Code Review Process**:
- All changes MUST go through pull request review
- Reviewer MUST verify:
  - Constitution principle compliance
  - TypeScript strict mode passing
  - ESLint warnings resolved
  - No console.log statements in final code
  - User-facing strings are localized
  - API errors handled gracefully

**Testing Gates**:
- When tests are part of the specification:
  - Tests MUST be written before implementation (TDD)
  - Tests MUST fail before implementation begins
  - Tests MUST pass before PR approval
- Manual QA checklist for critical paths:
  - Login flow with different roles
  - Attendance marking and notification delivery
  - Fee payment and receipt generation
  - Report card PDF generation

**Documentation Requirements**:
- Each feature MUST update relevant specs in `.specify/specs/`
- Complex components MUST have JSDoc comments explaining props and usage
- API service functions MUST document expected errors

## Governance

**Constitution Authority**:
This constitution supersedes all other development practices and guidelines. All feature work, code reviews, and architectural decisions MUST align with the principles defined herein.

**Amendment Process**:
- Amendments require documentation of rationale and impact analysis
- Version numbering follows semantic versioning:
  - **MAJOR**: Backward-incompatible changes (e.g., removing a principle)
  - **MINOR**: Additions (e.g., new principle, new mandatory process)
  - **PATCH**: Clarifications, typo fixes, non-semantic refinements
- Amendments MUST be dated and logged in Sync Impact Report (HTML comment at top of file)
- All affected templates and specs MUST be updated within the same commit

**Compliance Enforcement**:
- Pull requests MUST reference this constitution in review comments when violations occur
- Complexity that violates principles MUST be justified in writing in the plan.md Complexity Tracking section
- The constitution MUST be reviewed quarterly and updated as the project evolves

**Runtime Development Guidance**:
For AI agents and developers, refer to `.specify/templates/commands/*.md` for specific command workflows and execution patterns that implement these constitutional principles.

**Version**: 1.1.0 | **Ratified**: 2026-02-10 | **Last Amended**: 2026-02-11
