# Implementation Plan: Core Foundation

**Branch**: `main` | **Date**: 2026-02-12 | **Spec**: [specs/001-core-foundation/spec.md](spec.md)
**Input**: Feature specification from `specs/001-core-foundation/spec.md`

## Summary

Implement the foundational layers of Sanchalan including Authentication (RBAC), Student Information System (SIS), Digital Attendance, and Notice Board. This core module provides the "Operating System" for the school management platform, establishing the user context, permission model, and master data management for all downstream academic and financial modules.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x (Vite)
**Primary Dependencies**: 
- `react-router-dom`: Routing
- `react-hook-form` + `zod`: Form management
- `lucide-react`: Iconography
- `tailwindcss` v4: Styling engine
- `axios`: API Client
- `date-fns`: Date manipulation
**Storage**: Client-side Mock Data (JSON + MSW). `localStorage` for Auth tokens.
**Testing**: Manual QA centered.
**Target Platform**: Responsive Web (Mobile First for Parents/Students, Desktop optimized for Admin).
**Performance Goals**: < 1s TTI, < 100ms interaction latency.
**Constraints**: Optimistic UI for attendance, WCAG AA accessibility (Dark Mode support).
**Scale/Scope**: 4 User Stories, ~25 screens, Core Auth & Layout infrastructure.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Sanchalak Constitution principles:

- [x] **Security**: RBAC implementation defined, JWT auth flow documented (Mocked).
- [x] **Components**: Feature broken into reusable components (`Button`, `Input`, `Select`).
- [x] **Type Safety**: TypeScript strict mode enabled.
- [x] **Backend Integration**: API contracts defined with typed request/response models.
- [x] **Performance**: Virtualization planned for Student List.
- [x] **UX/i18n**: Dark Mode fully supported. i18n infrastructure ready.
- [x] **Complexity**: Modularized by feature (Auth, Students, Notices, Attendance).

## Evolution & Decisions (Updated 2026-02-12)

1.  **Student Management**:
    -   Added `StudentForm` for Create/Edit flows (initially missing from implementation).
    -   Integrated `zod` schema validation mirroring the contracts.
    -   Added distinct routes for `/students/new` and `/students/:id/edit`.

2.  **UI/UX Refinements**:
    -   **Dark Mode**: Enforced high-contrast text colors on Inputs and Selects to fix visibility issues in dark themes (Notice Board, Student List).
    -   **Mobile Header**: Refactored page headers to stack actions on mobile for better touch targets.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-foundation/
├── plan.md              # This file
├── research.md          # Technical research
├── data-model.md        # DB Schema & Entity relationships
├── quickstart.md        # Setup guide
├── contracts/           # API Interface definitions
└── tasks.md             # Execution steps
```

### Source Code (repository root)

```text
src/
├── components/          # Shared UI (Button, Input, Modal, Layout)
├── contexts/            # React Contexts (Auth, Theme, Toast)
├── features/
│   ├── auth/            # Login, RBAC, ProtectedRoute
│   ├── students/        # Student List, Profile, Forms
│   ├── attendance/      # Attendance Marking & History
│   └── notices/         # Notice Board & Management
├── mocks/
│   ├── data/            # JSON data stores
│   └── handlers/        # MSW request handlers
├── services/            # API Client services
└── utils/               # Helpers (Dates, Permissions, Formatting)
```

