# Feature Specification: Full CRUD Operations Coverage

**Feature Branch**: `006-full-crud-ops`
**Created**: 2026-02-12
**Status**: Draft
**Input**: Implement full CRUD (Create, Read, Update, Delete) operations for all core resources: Students, School Operations (Teachers, Classes, Subjects, Routines), and Finance (Fee Structures, Categories).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Student Records (Priority: P1)

As an administrator, I want to edit student details and archive (delete) students so that the database remains accurate when mistakes are made or students leave.

**Why this priority**: Essential data management. Currently, created students cannot be edited or removed from the list view.

**Independent Test**: Identify a specific student in the "Student List", click "Edit", change their "Mobile Number", save, and verify the change persists. Then click "Delete/Archive" and verify they disappear from the active list.

**Acceptance Scenarios**:
1. **Given** a student "John Doe", **When** I click the "Edit" pencil icon in the list row, **Then** I am taken to the Student Form pre-filled with John's data.
2. **Given** I update the "Guardian Mobile" and save, **When** I view the student again, **Then** the new number is displayed.
3. **Given** a student who has left, **When** I click "Delete" (or Archive) and confirm, **Then** the student is removed from the "Active Students" list.

### User Story 2 - School Operations Management (Priority: P2)

As an administrator, I need to update Class configurations, Subject names, and Teacher profiles to reflect staffing and curriculum changes.

**Why this priority**: Schools are dynamic; static lists prevent adapting to real-world changes (e.g., a teacher getting married and changing surname, or a subject being renamed).

**Independent Test**: Go to "Academic Setup", find "Class 5", rename it to "Grade 5", and verify the change reflects in the class dropdowns elsewhere.

**Acceptance Scenarios**:
1. **Given** a list of Teachers, **When** I click "Delete" on a teacher row, **Then** that teacher is removed from the system (mock DB).
2. **Given** a configured Subject "Maths", **When** I edit it to "Mathematics", **Then** the subject list updates immediately.
3. **Given** a Class "Class 1", **When** I edit the section list for it, **Then** the new sections are available for student admission.

### User Story 3 - Finance Configuration Management (Priority: P2)

As an administrator, I want to modify Fee Structures and Categories to correct pricing errors or update yearly fees.

**Why this priority**: Fee amounts change annually. Errors in entry must be correctable without direct DB access.

**Independent Test**: Navigate to "Fee Management", select a Fee Structure, change the amount from 5000 to 5500, save, and verify it updates in the list.

**Acceptance Scenarios**:
1. **Given** a Fee Category "Tuition Fee", **When** I edit its frequency or tax setting, **Then** the changes are saved.
2. **Given** a Fee Structure has linked payments, **When** I try to delete it, **Then** the system prevents deletion and shows a warning ("Cannot delete: Active payments exist").
3. **Given** a Fee Structure is unused, **When** I delete it, **Then** it is permanently removed.

---

## Functional Requirements

### Student Management
- **FR 1.1**: The `StudentList` component must include an "Actions" column with "Edit" and "Delete" buttons for each row.
- **FR 1.2**: Clicking "Edit" must navigate to `/students/:id/edit`, reusing the `StudentForm` component in "Edit Mode".
- **FR 1.3**: The `StudentForm` must populate all fields from the mock DB for the given ID.
- **FR 1.4**: Clicking "Delete" must show a confirmation modal before calling the delete API.

### School Operations (Teachers, Classes, Subjects)
- **FR 2.1**: `TeacherListPage` must support Edit and Delete actions for each teacher via a **Modal/Dialog** interface (keeping the user on the list page).
- **FR 2.2**: The `ClassManager` component (inside Academic Setup) must allow editing existing Class names and deleting Classes.
- **FR 2.3**: The `SubjectManager` component must allow editing Subject names/codes and deleting Subjects.
- **FR 2.4**: The `RoutineManagementPage` must allow clearing (deleting) a routine slot assignment.

### Finance (Fees)
- **FR 3.1**: `FeeStructureList` must provide Edit/Delete options for each structure card/row.
- **FR 3.2**: `FeeCategoryForm` must support an "Update" mode to modify existing categories.
- **FR 3.3**: The `useFees` hook must expose `updateStructure`, `deleteStructure`, `updateCategory`, and `deleteCategory` functions connected to the mock API.

---

## Technical Constraints & Assumptions

- **Mock Implementation**: All updates and deletes must effectively modify the client-side `MSW` mock database (in-memory or IndexedDB).
- **Data Integrity**: Deleting a "Class" that has students assigned should ideally be prevented or warned (Mock constraint: simple warning is enough).
- **Form Reuse**: Existing "Create" forms (StudentForm, TeacherForm) should be refactored to support `initialValues` or an `editMode` prop to avoid code duplication.

---

## Success Criteria

1.  **Student Edit**: Can change a student's name and see it reflected in the list immediately.
2.  **Student Delete**: Can remove a student and the total count decreases by 1.
3.  **Teacher Update**: Can update a teacher's qualification and save.
4.  **Fee Structure**: Can adjust fee amounts for an existing structure without recreating it.

## Assumptions
- "Delete" for students is a "Hard Delete" for simplicity (unless specific dependencies block it, but Student dependencies are complex so we focus on Finance integrity mainly).
- **Finance Integrity**: Deletion of Fee Structures/Categories is strictly blocked if dependent data (payments/structures) exists.
- Teacher management prioritizes speed (Modal) over navigation (Page).
