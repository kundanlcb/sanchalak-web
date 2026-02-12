# Phase 0: Research & Architecture Decisions

**Feature**: Academic Core (Phase 2)
**Date**: 2026-02-11

## 1. PDF Generation Strategy

**Problem**: Need to generate Report Cards (A4 size, multi-page, styling) strictly on the client-side without a backend render service.

**Options Evaluated**:
1.  **Browser Print (`window.print()`)**:
    *   *Pros*: Simplest, reuses HTML/CSS.
    *   *Cons*: inconsistent page breaks, headers/footers hard to control, no file download.
2.  **`jspdf` + `html2canvas`**:
    *   *Pros*: Converts DOM to Image to PDF.
    *   *Cons*: Blurry text, non-selectable text, large file size, layout limitations.
3.  **`@react-pdf/renderer`**:
    *   *Pros*: Declarative component API (`<Document>`, `<Page>`, `<View>`), generates real vector PDFs, supports direct download blob.
    *   *Cons*: Limited CSS subset (Flexbox only), custom components required.

**Decision**: Use **`@react-pdf/renderer`**.
*   **Rationale**: It provides the highest quality output (vector text) and allows creating a downloadable PDF Blob directly in the browser, satisfying "FR-009" and "SC-003".
*   **Implementation**: Create a dedicated `src/features/academics/components/reports/ReportCardDocument.tsx` that uses `@react-pdf` primitives.

## 2. Marks Entry Grid Architecture

**Problem**: Need a performant, keyboard-navigable grid for entering marks (Enter=Down, Tab=Right) with optimistic updates.

**Options Evaluated**:
1.  **Pure `<table>` with `react-hook-form`**:
    *   *Pros*: Lightweight, full control.
    *   *Cons*: Handling keyboard nav (focus management) manually is tedious.
2.  **`tanstack-table` (Headless)**:
    *   *Pros*: Handles sorting, filtering, virtualization.
    *   *Cons*: Overkill for a simple specific input grid? Maybe not.
3.  **`ag-grid` / `handsontable`**:
    *   *Pros*: Built-in Excel features.
    *   *Cons*: Large bundle size, commercial licensing complexities.

**Decision**: **Custom Table with `react-hook-form` + `useFieldArray`**.
*   **Rationale**: The data structure is hierarchical (Class -> Student -> Mark). `useFieldArray` effectively manages this list. We can implement a custom `useGridNavigation` hook for the "Enter key moves focus down" behavior using Data Attributes (`data-row-index`, `data-col-index`) and DOM focus manipulation.
*   **Optimistic UI**: Use `useMutation` (TanStack Query) with `onMutate` to update the cache instantly before the Mock API responds.

## 3. Mock Data & Relationships

**Problem**: Need to simulate "Grade Calculation" without a backend.

**Strategy**:
*   The `marks.json` will store raw marks.
*   The Front-end `useReportCard` hook will be responsible for mapping `Marks` -> `Subject.MaxMarks` -> `Percentage` -> `Grade` based on the scheme.
*   **Implication**: Business logic for grading will live in a Utility function (`calculateGrade.ts`) on the client for Phase 2. This logic will move to Backend in Phase 3.

## 4. Mobile Responsiveness (Sticky Columns)

**Problem**: Tables on mobile are hard to read.

**Decision**:
*   Use CSS `position: sticky; left: 0` for the first column (Student Name).
*   Add a visual shadow separator when scrolling horizontally.
*   Ensure the "Save" status indicator is visible without scrolling (e.g., in the sticky header or toast).
