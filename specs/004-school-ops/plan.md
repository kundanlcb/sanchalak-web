# Implementation Plan: School Operations & Dashboard Overhaul

**Branch**: `004-school-ops` | **Date**: 2026-02-12 | **Spec**: [specs/004-school-ops/spec.md](spec.md)
**Input**: Feature specification from `specs/004-school-ops/spec.md`

## Summary

Enhance the application with a visually rich **Dashboard**, add comprehensive **Global Search**, and implement core **School Operations** modules: **Teacher Management** and **Academic Structure** (Classes, Subjects, Routines).

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x
**Primary Dependencies**:
- `recharts`: For Analytics Dashboards (Already installed).
- `lucide-react`: For icons (Already installed).
- `zod` + `react-hook-form`: Form validation.
- `date-fns`: Date/Time manipulation.
**Storage**: Client-side Mock Data (JSON + MSW).
**Performance Goals**: Dashboard render < 1s, Global Search < 500ms.
**Constraints**: Mock data must simulate complex relationships (Teachers -> Subjects -> Classes -> Routine).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Sanchalak Constitution principles:

- [x] **Security**: RBAC for Teacher/Academic (Admin only).
- [x] **Components**: Reuse `Card`, `Table`, `Modal`, `Button` from previous phases.
- [x] **Type Safety**: Defined schemas for `Teacher`, `Routine`, `Subject`.
- [x] **Backend Integration**: MSW handlers for new domains.
- [x] **Performance**: Dashboards use aggregated mock data; Search triggers on debounce.
- [x] **UX/Accessibility**: Tailwind `dark:` variants for new widgets; Keyboard nav for search.

## Project Structure

### Documentation

```text
specs/004-school-ops/
├── plan.md              # This file
├── research.md          # Implementation decisions (e.g., Routine Grid)
├── data-model.md        # Teacher/Routine schemas
├── quickstart.md        # How to test new ops
├── contracts/           # API types
│   ├── teacher.ts
│   ├── academic.ts
│   └── dashboard.ts
└── tasks.md             # Execution steps
```

### Source Code

```text
src/
├── features/
│   ├── school-ops/      # NEW MODULE
│   │   ├── components/  # TeacherList, RoutineGrid, SubjectForm
│   │   ├── pages/       # TeachersPage, AcademicSetupPage
│   │   ├── hooks/       # useTeachers, useRoutine
│   │   ├── types/       # Domain types
│   │   └── services/    # Data fetching
│   └── dashboard/       # SHARED (Enhancement)
│       └── components/  # GlobalSearch, StatWidgets, ExamChart
├── mocks/
│   ├── data/
│   │   ├── teachers.json
│   │   ├── subjects.json
│   │   ├── classes.json
│   │   └── routines.json
│   └── handlers/
│       └── academic.ts
```

## Evolution & Decisions

1.  **Routine Matrix**: We will use a CSS Grid solution for the Time x Day matrix instead of a heavy calendar library, as the requirements are for a fixed weekly schedule, not a full event calendar.
2.  **Global Search**: Implemented as a client-side filtered list for this phase (performance constraint handled by small dataset).
3.  **Entity Links**: Teachers will be multi-selected from a predefined list of Subjects to ensure referential integrity in the Routine builder.
