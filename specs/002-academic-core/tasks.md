---
description: "Task list for Academic Core: Exams, Marks (Optimistic), Report Cards (Client PDF), Homework"
---

# Tasks: Academic Core

**Input**: Design documents from `specs/002-academic-core/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - included only where UI logic is complex (Marks Grid).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `src/features/academics/`, `src/features/homework/`
- **Mocks**: `src/mocks/`
- **Shared**: `src/components/common/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install dependencies (`@react-pdf/renderer`, `react-hook-form`, `zod`, `date-fns`, `clsx`, `tailwind-merge`)
- [x] T002 Create feature directory structure in `src/features/academics/` (components, pages, hooks, utils, types)
- [x] T003 Create feature directory structure in `src/features/homework/` (components, pages, hooks, types)
- [x] T004 [P] Copy contract interfaces to `src/features/academics/types/index.ts` (Exams, Marks)
- [x] T005 [P] Copy contract interfaces to `src/features/homework/types/index.ts` (Homework)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Mock Data & Handlers (Proxy for "Backend Setup")

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create mock data file `src/mocks/data/exams.json` with sample Exam Terms
- [x] T007 Create mock data file `src/mocks/data/subjects.json` with sample Subjects (Math, Science)
- [x] T008 Create mock data file `src/mocks/data/marks.json` with sample Marks (Class 5A students)
- [x] T009 Create mock data file `src/mocks/data/homework.json` with sample Homework entries
- [x] T010 Implement MSW handlers for Exams/Marks in `src/mocks/handlers/academics.ts` (GET, POST, PUT)
- [x] T011 Implement MSW handlers for Homework in `src/mocks/handlers/homework.ts` (GET, POST, DELETE)
- [x] T012 Register new handlers in `src/mocks/handlers/index.ts` (or main worker setup)

**Checkpoint**: Mock API is responding to requests in browser console or tests.

---

## Phase 3: User Story 1 - Exam Term & Subject Configuration (Priority: P1)

**Goal**: Admins can create Exam Terms and Subjects.

**Independent Test**: Create "Mid-Term", verify it appears in list. Add "Computer Science" subject, verify it saves.

### Implementation for User Story 1

- [x] T013 [US1] Create Zod schema for Exam Term in `src/features/academics/types/schema.ts`
- [x] T014 [US1] Create `useExamTerms` hook (query + mutation) in `src/features/academics/hooks/useExamTerms.ts`
- [x] T015 [US1] Create `ExamTermList` component (Skeleton loading) in `src/features/academics/components/ExamTermList.tsx`
- [x] T016 [US1] Create `ExamTermForm` component (modal/drawer) in `src/features/academics/components/ExamTermForm.tsx`
- [x] T017 [US1] Implement `ExamConfigPage` in `src/features/academics/pages/ExamConfigPage.tsx`
- [x] T018 [US1] Add "Subjects" management UI within Exam Config or separate tab in `src/features/academics/components/SubjectConfig.tsx`
- [x] T019 [US1] Add route for `/admin/academics/exams` in `src/routes/index.tsx` (using Phase 1 AppShell)

**Checkpoint**: Admin looks good. Can config exams.

---

## Phase 4: User Story 2 - Marks Entry Mobile Grid (Priority: P2)

**Goal**: Teachers enter marks via mobile-responsive grid with optimistic UI.

**Independent Test**: Load page as Teacher, enter marks, see proper feedback, verify validation (max marks).

### Implementation for User Story 2

- [x] T020 [US2] Create Zod schema for Marks Entry in `src/features/academics/types/schema.ts`
- [x] T021 [US2] Create `useMarks` hook with Optimistic Updates (`onMutate`) in `src/features/academics/hooks/useMarks.ts`
- [x] T022 [US2] Implement `MarksGrid` component structure (Table Header) in `src/features/academics/components/MarksGrid.tsx`
- [x] T023 [US2] Implement `MarksGridRow` with `react-hook-form` controller in `src/features/academics/components/MarksGridRow.tsx`
- [x] T024 [US2] Add Keyboard Navigation Logic (Custom Hook) for Enter/Arrow keys in `src/features/academics/hooks/useGridNavigation.ts`
- [x] T025 [US2] Style `MarksGrid` for Mobile (Sticky first column, shadow) in CSS/Tailwind
- [x] T026 [US2] Implement `MarksEntryPage` (Filters: Class -> Section -> Exam -> Subject) in `src/features/academics/pages/MarksEntryPage.tsx`
- [x] T027 [US2] Add route for `/teacher/marks` in `src/routes/index.tsx` protected by RBAC

**Checkpoint**: Responsive grid works. Marks save instantly.

---

## Phase 5: User Story 3 - Dynamic PDF Report Card Generation (Priority: P3)

**Goal**: Generate downloadable PDF using `@react-pdf/renderer` entirely client-side.

**Independent Test**: Click "Generate", wait < 3s, PDF blob downloads. Open PDF, verify correct grade calculation.

### Implementation for User Story 3

- [x] T028 [P] [US3] Create grade calculation utility (`calculateGrade(percentage)`) in `src/features/academics/utils/grading.ts`
- [x] T029 [US3] Create `ReportCardDocument` (PDF primitives: Page, View, Text) in `src/features/academics/components/reports/ReportCardDocument.tsx`
- [x] T030 [P] [US3] Create `ReportCardHeader` and `MarksTable` sub-components for PDF in `src/features/academics/components/reports/pdf-components.tsx`
- [x] T031 [US3] Create `ReportCardPreview` (Web view using `PDFViewer` option) in `src/features/academics/components/reports/ReportCardPreview.tsx`
- [x] T032 [US3] Implement `ReportGenerationPage` (Select Class -> Generate All) in `src/features/academics/pages/ReportGenerationPage.tsx`
- [x] T033 [US3] Integrate `PDFDownloadLink` for direct blob download in `ReportGenerationPage.tsx`

**Checkpoint**: PDFs generate correctly with mock data.

---

## Phase 6: User Story 4 - Homework/Digital Diary (Priority: P4)

**Goal**: Teachers post homework; generic "File Upload" simulation.

**Independent Test**: Post homework with "image", see it in list. Delete it (Confirmation Dialog).

### Implementation for User Story 4

- [x] T034 [US4] Create Zod schema for Homework in `src/features/homework/types/schema.ts`
- [x] T035 [US4] Create `useHomework` hook in `src/features/homework/hooks/useHomework.ts`
- [x] T036 [US4] Create `HomeworkForm` with Mock File Upload field in `src/features/homework/components/HomeworkForm.tsx`
- [x] T037 [US4] Create `HomeworkCard` (Subject, Title, Due Date, Attachments) in `src/features/homework/components/HomeworkCard.tsx`
- [x] T038 [US4] Implement `HomeworkPage` (List + Create Drawer) in `src/features/homework/pages/HomeworkPage.tsx`
- [x] T039 [US4] Add route for `/homework` (Shared route: Teachers write, Parents read) in `src/routes/index.tsx`

**Checkpoint**: Homework flow complete.

---

## Final Phase: Polish & Cross-Cutting

**Purpose**: Cleanup and final consistency checks

- [x] T040 Verify all forms have Zod validation errors displayed
- [x] T041 Verify Mobile View for all new screens (Exam, Marks, Homework)
- [x] T042 Ensure all "Destructive" actions use `ConfirmationDialog`
- [x] T043 Ensure all async loads use `Skeleton` (no spinners)
- [x] T044 Verify Dark Mode styles for Marks Grid (sticky columns, inputs) and PDF Preview
- [x] T045 Ensure all new UI strings use i18n keys
- [x] T046 Update Sidebar navigation to include new Academic and Homework routes
- [x] T047 Refactor UI to use shared form components (Select, Input) to ensure consistent Dark Mode support

## Maintenance & Bug Fixes (2026-02-12)

- [x] Fix: Mobile responsiveness for Exam Config, Report Generation, and Homework pages (Header layout).
- [x] Fix: Mock Data integrity (IDs mismatch in Marks/Exams/Subjects causing empty tables).
- [x] Fix: `subjects.json` syntax error.
- [x] Fix: `MarksEntryPage` filters mismatch with mock data IDs.

## Dependencies

- **US2 (Marks)** depends on **US1 (Exams)** being configurable (need mocks for exams first).
- **US3 (Reports)** depends on **US2 (Marks)** data structure being stable.
- **US4 (Homework)** is independent.

## Parallel Execution Opportunities

- T013-T019 (US1) and T034-T039 (US4) can be done in parallel by different devs.
- T029-T030 (PDF Templates) can be built in parallel with T020-T026 (Marks Grid).
