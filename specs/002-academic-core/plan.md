# Implementation Plan: Academic Core

**Branch**: `002-academic-core` | **Date**: 2026-02-11 | **Spec**: [specs/002-academic-core/spec.md](spec.md)
**Input**: Feature specification from `specs/002-academic-core/spec.md`

## Summary

Implement the Academic Core module focusing on Exam Configuration, Marks Entry, Report Card Generation, and Homework Diary. Phase 2 extends the Phase 1 foundation by adding complex data entry grids, client-side PDF generation, and teacher-specific workflows using a "No Backend" strategy with MSW/JSON mocks.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x
**Primary Dependencies**: `react-pdf` (Report Cards), `react-hook-form` + `zod` (Forms), `lucide-react` (Icons), `clsx/tailwind-merge` (Styles), `date-fns`.
**Storage**: Client-side Mock Data (JSON + MSW). LocalStorage for temporary persistence during dev.
**Testing**: Vitest, React Testing Library.
**Target Platform**: Web Admin Portal (Responsive, Mobile-First for Marks Entry).
**Performance Goals**: Marks Grid render < 500ms, PDF Generation < 3s.
**Constraints**: strictly client-side PDF generation (no backend service in Phase 2), offline-tolerant optimistic UI for marks.
**Scale/Scope**: ~4 new complex screens, 3 mock data entities, ~10 reusable domain components.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Sanchalak Constitution principles:

- [ ] **Security**: RBAC checks implemented for Teacher vs Admin routes.
- [ ] **Components**: Reusing `Skeleton`, `Toast`, `ConfirmationDialog` from Phase 1.
- [ ] **Type Safety**: strict TS, Zod schemas for all forms.
- [ ] **Backend Integration**: Mock-first development with defined interfaces in `src/types`.
- [ ] **Performance**: Virtualized grid for marks entry (if > 50 students).
- [ ] **UX/i18n**: Responsive mobile view for marks entry confirmed.
- [ ] **Complexity**: PDF generation isolated in client-side component.

## Project Structure

### Documentation (this feature)

```text
specs/002-academic-core/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── exams.ts
│   └── marks.ts
└── tasks.md             # Phase 2 output
```

### Source Code

```text
src/
├── components/
│   └── common/            # Custom Select, Button, Skeleton
├── features/
│   ├── academics/
│   │   ├── components/    # ExamTermForm, MarksEntryGrid, ReportCardPreview
│   │   ├── hooks/         # useMarks, useExamTerms, useStudentsByClass
│   │   ├── pages/         # ExamConfigPage, MarksEntryPage, ReportGenerationPage
│   │   ├── types/         # Domain types
│   │   └── utils/         # PDF generation logic
│   └── homework/
│       ├── components/    # HomeworkCard, HomeworkForm
│       └── pages/         # HomeworkPage
├── mocks/
│   ├── data/
│   │   ├── exams.json
│   │   ├── marks.json
│   │   ├── homework.json
│   │   └── classes.json   # Added for class/section data
│   └── handlers/
│       ├── academics.ts
│       └── homework.ts
└── services/
    └── api/               # API client definitions
```

## Evolution & Decisions (Updated 2026-02-12)

1.  **UI Component Standardization**:
    -   Introduced `src/components/common/Select.tsx` to handle consistent Light/Dark mode styling and spacing issues with native selects.
    -   Adopted "Stack on Mobile, Row on Desktop" pattern for all page headers (`ExamConfig`, `Reports`, `Homework`) to ensure action buttons are accessible on small screens.

2.  **Data Logic & Composite Keys**:
    -   **Class Selection**: Uses a composite string format `CLASS_ID|SECTION` (e.g., `CLS-2026-003|A`) to allow selecting a specific section from a single dropdown map.
    -   **Mock Data**: Migrated from simple IDs (`5-A`) to robust UUIDs (`CLS-2026-xxx`) in mocks to prevent collision and realistically simulate backend data.

3.  **PDF Generation**:
    -   Fully client-side generation using `@react-pdf/renderer`.
    -   Download flow requires data generation first, then rendering the `PDFDownloadLink` to avoid performance hits on initial render.

