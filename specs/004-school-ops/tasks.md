# Implementation Tasks: School Operations & Dashboard

**Feature**: School Operations (Teacher, Academics) & Dashboard UI
**Status**: Pending
**Context**: [Spec](spec.md) | [Plan](plan.md)

## Phase 1: Foundation & Data Layer
- [x] **TASK-001**: Define Zod schemas and TypeScript interfaces for new domains.
    - `Teacher` (id, name, email, specializedSubjects, joiningDate)
    - `Class` (id, level, section, room)
    - `Subject` (id, name, code, type)
    - `Routine` (id, classId, day, period, subjectId, teacherId)
- [x] **TASK-002**: Create mock data JSON files (`teachers.json`, `subjects.json`, `classes.json`, `routines.json`) with realistic seed data.
- [x] **TASK-003**: Implement MSW handlers for CRUD operations on new entities.
    - `handlers/academic.ts` (Teachers, Classes, Subjects, Routines)
- [x] **TASK-004**: Create Data Service/Hooks layer.
    - `useTeachers`, `useAcademicStructure` (fetches classes/subjects), `useRoutine`.

## Phase 2: Dashboard & Navigation
- [x] **TASK-005**: Implement `GlobalSearch` component in Header.
    - Filters: Students, Teachers, Pages.
    - Debounced input.
    - Dropdown Results list.
- [x] **TASK-006**: Create Dashboard Widget: `StatsCard`.
    - Update styling to match new visual requirements (colors/icons).
    - Create variants for Students, Teachers, Earnings.
- [x] **TASK-007**: Create Dashboard Widget: `ExamResultChart`.
    - Use `recharts` BarChart.
    - Data: Mock Comparison (Teacher Avg vs Student Avg).
- [x] **TASK-008**: Create Dashboard Widget: `GenderDonutChart`.
    - Use `recharts` Pie/Donut.
- [x] **TASK-009**: Create Dashboard Widget: `StarStudentTable`.
    - Simple specific table for top performers.
- [x] **TASK-010**: Assemble `DashboardHome` Layout.
    - Grid layout for widgets.
    - Integrate "Recent Activity" mock feed.
    - Loading skeletons for all widgets.

## Phase 3: Teacher & Academic Modules
- [x] **TASK-011**: Implement `SubjectManager` (Modal/Inline).
    - CRUD for Subjects.
- [x] **TASK-012**: Implement `ClassManager` (Simple List/Add).
    - Define Classes (e.g., Class 1 - A).
- [x] **TASK-013**: Implement `TeacherList` Page.
    - Grid/List view of teachers.
    - Search/Filter by Subject.
- [x] **TASK-014**: Implement `TeacherForm`.
    - Add/Edit Teacher details.
    - Multi-select for generic Subject mapping.

## Phase 4: Routine Management (Complex)
- [x] **TASK-015**: Create `RoutineGrid` Component.
    - Columns: Global Periods (1-8).
    - Rows: Days (Mon-Sat).
    - Cell: Displays Subject + Teacher.
- [x] **TASK-016**: Implement `RoutineEditor` (Interactive Cell).
    - Click cell to Assign.
    - Dropdowns: Select Subject -> Select qualified Teacher.
- [x] **TASK-017**: Implement Validation Logic.
    - Prevent double-booking (Is Teacher busy in Period X on Day Y?).
    - Error feedback in UI.
