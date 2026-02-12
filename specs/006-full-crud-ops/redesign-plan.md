# Report Generation UI Redesign Plan

The user is unsatisfied with the current "Report Tab" design. The current implementation (found in `src/features/academics/pages/ReportGenerationPage.tsx`) has a few design issues:

1.  **Empty State Dominance**: The page defaults to a large "No Report Generated" placeholder with the selection form embedded inside it. This feels constrictive.
2.  **Workflow Separation**: The selection filters are hidden inside the empty state. Once a report is generated, the filters disappear, making it hard to switch students without closing the preview.
3.  **Lack of Batch Context**: It feels very "single student" focused. In a real school, teachers often want to see a list of students in a class and generate reports for one or many.

## Proposed Design: Split-Pane "Classroom View"

We will move to a more dashboard-like layout with two distinct sections:

### 1. Left Sidebar: Filter & Student List
*   **Top Section**: sticky filters for "Exam Term" and "Class/Section".
*   **List Area**: A scrollable list of students in the selected class.
*   **Status Indicators**: Each student row shows status (e.g., "Marks Entered", "Generated").
*   **Batch Actions**: "Select All", "Generate All Reports".

### 2. Main Content Area: Report Preview
*   **Empty State**: "Select a student to view report card".
*   **Preview Mode**: Shows the `ReportCardPreview` for the selected student.
*   **Action Bar**: Floating or sticky header with "Download PDF", "Print", "Send to Parent".

## Technical Changes

1.  **Refactor `ReportGenerationPage.tsx`**:
    *   Change layout to `grid grid-cols-12`.
    *   Left col (cols-4): Filters + Student List.
    *   Right col (cols-8): Preview Area.
2.  **Enhance `useStudentsByClass`**: ensure we are fetching enough info.
3.  **State Management**:
    *   `selectedStudent`: Controls what's shown in the right pane.
    *   `filters`: Controls the list in the left pane.

## Tasks
1.  **Refactor Layout**: Create the split-screen structure.
2.  **Implement Sidebar**: Build the student list with search/filter.
3.  **Implement Preview Area**: Embed the existing `ReportCardPreview`.
4.  **Connect State**: Clicking a student on the left updates the right.
5.  **Clean up**: Remove the old "centered box" design.

This design is much more professional and scalable for 30-40 students per class.
