# Quickstart: Academic Core Implementation

**Goal**: Enable development of Exam configs, Marks entry, and Homework with Mock Data.

## Prerequisites
*   Node.js 18+
*   `npm install` completed

## 1. Install Dependencies
```bash
npm install @react-pdf/renderer react-hook-form zod date-fns
```

## 2. Setup Mock Data
1.  Create `src/mocks/data/exams.json` (See `data-model.md`).
2.  Create `src/mocks/data/marks.json`.
3.  Register handlers in `src/mocks/handlers/academics.ts`.

## 3. Component Development Order
1.  **Exam Terms**: `ExamConfigPage` -> `ExamTermList` -> `ExamTermForm`.
2.  **Marks Entry**: `MarksEntryPage` -> `MarksGrid` (Test keyboard nav here).
3.  **Reports**: `ReportCardPage` -> `ReportCardDocument` (Simulate print).
4.  **Homework**: `HomeworkPage` -> `HomeworkForm` (Mock upload).

## 4. Key Implementation Details
*   **Marks Grid**: Use `useFieldArray` for the list of students. Use `onBlur` or a debounce to trigger the Optimistic Update.
*   **PDF**: Import `Document, Page, Text, View` from `@react-pdf/renderer`. Do NOT use standard HTML tags inside the PDF Document.
*   **Keyboard Nav**: Implement a custom hook `useGridNavigation(rowCount, colCount)` that listens for `KeyDown` and moves focus.

## 5. Verification
*   Run `npm run test` to verify logic.
*   Manual test: Open `/admin/marks`, disconnect network (Offline mode in DevTools), try to save -> Expect Error Toast.
