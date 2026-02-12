# Feature Specification: Phase 2 Academic Core

**Feature Branch**: `002-academic-core`  
**Created**: 2026-02-11  
**Status**: Ready for Plan  
**Input**: User description: "Phase 2 Academic Core: Implement Exam and Result Management with marks entry, dynamic PDF Report Card generation with school branding, and Homework/Digital Diary with image and PDF uploads for teachers. Build upon Phase 1 Foundation (Auth, RBAC, Student Profiles)."

## Technical Context & Learnings from Phase 1

This phase builds directly on the architecture established in `001-core-foundation`.

*   **Architecture**: Continue using the `features/` directory structure (`features/academics`, `features/homework`).
*   **Data Strategy**: Use `src/mocks/data/` for `exams.json`, `marks.json`, `homework.json`. All async operations must be mocked in `src/mocks/handlers/`.
*   **UI Patterns**:
    *   **Loading**: Use `Skeleton` component (`src/components/common/Skeleton.tsx`) instead of spinners for initial data loads (Marks Grid, Homework List).
    *   **Feedback**: Use `useToast()` (`src/components/common/ToastContext.tsx`) for all success/error notifications (e.g., "Marks saved", "Homework posted").
    *   **Safety**: Use `ConfirmationDialog` (`src/components/common/ConfirmationDialog.tsx`) for destructive actions (Deleting homework, removing exam terms).
    *   **Optimistic UI**: Implement optimistic updates for Marks Entry (update local state immediately while the API mock processes in background).
    *   **Responsive**: Ensure Marks Grid is scrollable on mobile without breaking the layout.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exam Term & Subject Configuration (Priority: P1)

School administrators need to configure exam terms (e.g., Mid-Term, Final, Quarterly) and define subjects for each grade level. Each exam term has a date range, weightage for final grades, and associated subjects. This foundation enables teachers to record marks and generate report cards.

**Why this priority**: Exam configuration is the prerequisite for all academic assessment features. Without defined exam terms and subjects, marks entry and report cards cannot function.

**Independent Test**: Can be fully tested by admins creating exam terms (e.g., "Q1 Exam 2026"), associating subjects (Math, Science, English) to grade levels, setting date ranges and weightages, without needing actual marks entry or report card generation.

**Acceptance Scenarios**:

1. **Given** admin logged into exam management module, **When** they create exam term "Q1 Exam 2026" with dates "2026-03-15 to 2026-03-22", weightage 30%, and associate subjects "Math, Science, English, Hindi, Social Studies" for Grade 5, **Then** system saves exam configuration and displays success confirmation
2. **Given** existing exam term "Q1 Exam 2026", **When** admin adds new subject "Computer Science" to Grade 5, **Then** system updates subject list and makes it available for marks entry
3. **Given** multiple exam terms configured, **When** teacher views exam list for Grade 5, **Then** system displays all active exam terms with subjects and date ranges, sorted by exam date
4. **Given** exam term with dates "2026-03-15 to 2026-03-22", **When** admin attempts to create overlapping exam for same grade on "2026-03-20", **Then** system shows warning "Exam dates overlap with Q1 Exam 2026"
5. **Given** exam term "Q1 Exam 2026" assigned to Grade 5-A, **When** admin sets maximum marks for Math as 100, **Then** marks entry will validate against this maximum

---

### User Story 2 - Marks Entry Mobile Grid (Priority: P2)

Teachers need to input exam marks for their assigned subjects through an intuitive mobile-optimized grid interface. They select exam term, class, and subject, then enter marks for all students in a scrollable table. The interface validates marks against maximum values, shows real-time save status, and handles network interruptions gracefully (Optimistic UI).

**Why this priority**: Marks entry is the core data capture activity. Mobile optimization allows entry from anywhere.

**Independent Test**: Can be fully tested by teachers logging in, selecting an exam/class/subject, entering marks, and verifying optimistic updates and mock API responses.

**Acceptance Scenarios**:

1. **Given** teacher logged in, **When** navigating to marks entry, **Then** a `Skeleton` loader is displayed while data fetches.
2. **Given** teacher selects "Q1 Exam" and "Math", **Then** system displays a responsive grid with sticky first column (Student Name) on mobile.
3. **Given** marks entry grid, **When** teacher enters "85", **Then** UI updates instantly (optimistic) with a "Saving..." indicator, followed by a Success Toast.
4. **Given** marks > 100, **When** teacher types "105", **Then** input turns red and specific error Toast "Marks cannot exceed 100" appears.
5. **Given** network failure (simulated), **When** saving marks, **Then** Error Toast appears and cell reverts or shows retry state.
6. **Given** existing marks, **When** reopened, **Then** system pre-fills values allowing corrections.

---

### User Story 3 - Dynamic PDF Report Card Generation (Priority: P3)

School administrators and teachers need to generate PDF report cards using client-side generation (e.g., `react-pdf`). Reports combine student details, marks, attendance summary, and school branding.

**Why this priority**: Primary output for parents.

**Independent Test**: Select students, generate report, verify PDF download content.

**Acceptance Scenarios**:

1. **Given** marks entered, **When** admin clicks "Generate Report", **Then** generic generic `Skeleton` or loading spinner shows, followed by Success Toast.
2. **Given** report preview, **When** viewed, **Then** it renders calculated grades (A-F), attendance percentage, and marks table.
3. **Given** multiple terms, **When** final report generated, **Then** PDF includes term-wise comparison or weighted average.
4. **Given** school profile, **When** report generated, **Then** School Logo and Address appear in header.

---

### User Story 4 - Homework/Digital Diary (Priority: P4)

Teachers post homework assignments; parents view them.

**Why this priority**: Replaces physical diaries.

**Independent Test**: Create homework, view on dashboard, delete with confirmation.

**Acceptance Scenarios**:

1. **Given** homework page, **When** loading, **Then** `Skeleton` list is displayed.
2. **Given** create form, **When** valid data submitted, **Then** Success Toast "Homework Posted" appears and list updates immediately.
3. **Given** homework item, **When** "Delete" clicked, **Then** `ConfirmationDialog` appears.
4. **Given** parent view, **When** checking dashboard, **Then** they see homework cards sorted by subject.
5. **Given** attachment upload, **When** file selected, **Then** UI shows uploading progress state.

---

### Edge Cases

- **What happens when teacher enters marks for wrong exam term?** System should allow marks deletion/correction by authorized teachers or admin with audit log recording the change
- **What happens when report card generation fails due to missing marks?** System should identify students with incomplete marks and show error "Cannot generate report card - marks missing for Science" with list of affected students
- **What happens when school logo image is 10MB?** System should reject during school profile upload with error "Logo must be under 2MB" and suggest compression
- **What happens when generating 500 report cards simultaneously for entire school?** System should queue generation jobs, process in batches of 50, and provide progress indicator (e.g., "Generated 150/500")
- **What happens when teacher uploads 50MB homework PDF?** System should reject with error "File too large - maximum 10MB allowed" and suggest splitting content
- **What happens when student has 0% attendance?** Report card should still generate showing 0% attendance with flag "Please contact school office"
- **What happens when exam term dates are changed after marks are entered?** System should allow date updates but warn "Marks already entered for 3 classes - verify exam schedule with teachers"
- **What happens when parent has no internet to view homework?** Mobile app should cache last 7 days of homework for offline viewing with "Cached" indicator
- **What happens when two teachers assigned to same subject for a class?** System should allow both to enter marks with "Last updated by: Mr. Singh on 2026-02-11" indicator

## Requirements *(mandatory)*

### Functional Requirements

**Academic Configuration:**
- **FR-001**: Admin MUST be able to create Exam Terms (start/end date, name) and Subjects.
- **FR-002**: System MUST link Subjects to Classes (e.g., Class 5-A has Math, Science).

**Marks Entry:**
- **FR-003**: Teachers MUST only see subjects/classes they are assigned to (RBAC from Phase 1).
- **FR-004**: Grid MUST support keyboard navigation (Enter to move down, Tab to move right).
- **FR-005**: System MUST validate marks against a Max Marks configuration.
- **FR-006**: System MUST auto-save marks entry with real-time feedback (Optimistic UI).

**Report Cards:**
- **FR-007**: System MUST generate a printable view or PDF with School Header, Student Info, Marks Table, Attendance Summary, and Footer.
- **FR-008**: Reports MUST calculate Total, Percentage, and Grade (A-F) based on configured scales.
- **FR-009**: Client-side generation (no backend) for Phase 2.

**Homework:**
- **FR-010**: Teachers MUST be able to create, edit, delete homework for their classes.
- **FR-011**: Parents/Students MUST have read-only access to homework for their class.
- **FR-012**: Attachments (simulated upload) MUST be supported.

### Technical Requirements

- **TR-001**: Use `src/features/academics` and `src/features/homework` for new modules.
- **TR-002**: Reuse `src/components/common/Skeleton.tsx` for all initial data fetch states.
- **TR-003**: Reuse `src/components/common/ConfirmationDialog.tsx` for all destructives (Delete Homework, Delete Exam).
- **TR-004**: Reuse `src/components/common/ToastContext.tsx` for all operation feedback.
- **TR-005**: Marks Entry Grid must be responsive (sticky first column on mobile).
- **TR-006**: Mock Data: Create `src/mocks/data/exams.json` (terms, subjects) and `marks.json`.
- **TR-007**: **Strictly no new generic UI components**. Must use existing common components.
- **TR-008**: All new types must be exported from `src/features/*/types/`.

### Key Entities

- **ExamTerm**: `{ id, name, startDate, endDate, isActive, classes: [] }`
- **Subject**: `{ id, name, code, maxMarks }` (Linked to `Class` in Phase 1)
- **MarkEntry**: `{ studentId, subjectId, examTermId, marksObtained, maxMarks, remarks }`
- **Homework**: `{ id, classId, subjectId, title, description, dueDate, attachments: [] }`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Marks entry grid renders in < 500ms using mock data.
- **SC-002**: "Optimistic Save" feedback appears in < 100ms after user input.
- **SC-003**: Report Card PDF generates client-side in < 3 seconds.
- **SC-004**: Homework creation (including mock upload) completes in < 5 seconds.
- **SC-005**: All forms use `Zod` validation matching the schema types.

## Assumptions

- Phase 1 (Auth, Student, Class) is fully functional.
- We are using Mock Service Worker (MSW) or simple JSON delays for all APIs.
- No real "Backend" is required for this phase (Client-side heavy).
- PDF generation happens entirely in the browser using `react-pdf`.

## Dependencies

- Phase 1 Components: `Layout`, `AppSidebar`, `ConfirmationDialog`, `Skeleton`, `Toast`.
- Libraries: `react-pdf` (for reports), `zod` (validation), `react-hook-form`.

## Out of Scope (for Phase 2)

- Real Backend API integration (Phase 3).
- Actual File Upload to S3 (Simulate with timeout).
- SMS/Email Notifications (Simulate with Toast).
- Complex Grade Analytics (Basic calculations only).
- Fee Payment / Payroll / Transport.
