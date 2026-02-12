# Feature Specification: School Operations & Dashboard Overhaul

**Feature Branch**: `004-school-ops`
**Created**: 2026-02-12
**Status**: Draft
**Input**: Analyze UI image and implement missing operational sections and UI improvements.

## User Scenarios & Testing

### User Story 1 - Dashboard Visualization (P1)

As an Admin, I want to see a comprehensive dashboard with graphical insights and top performers so that I can quickly assess the school's operational status.

**Why this priority**: Visual feedback is central to the user experience shown in the reference design.
**Independent Test**: Dashboard loads with all charts and widgets rendering mock data correctly.

**Acceptance Scenarios**:

1. **Given** the Admin is on the home page, **When** the page loads, **Then** a "Students vs Teachers" Exam Result Bar Chart is displayed.
2. **Given** the Admin is on the home page, **When** the page loads, **Then** a "Student Gender Distribution" Donut Chart is displayed.
3. **Given** the Admin is on the home page, **When** the page loads, **Then** a "Star Students" list showing ID, Marks, and Percentage is visible.
4. **Given** the Admin is on the home page, **When** scrolling, **Then** a "Recent Activity" or "Exam Results" feed is visible on the right.

### User Story 2 - Teacher Management (P1)

As an Admin, I want to manage Teacher profiles so that I can assign them to classes and subjects.

**Why this priority**: Teachers are a core entity required for Routine and Subject assignment.
**Independent Test**: Can create, list, and view a teacher profile.

**Acceptance Scenarios**:

1. **Given** the Admin is on the Teachers page, **When** they click "Add Teacher", **Then** a form appears to capture Name, ID, Email, and Subject specialization.
2. **Given** a list of teachers, **When** clicking a teacher, **Then** their detailed profile is shown.

### User Story 3 - Academic Structure & Routine (P2)

As an Admin, I want to configure Classes, Subjects, and Weekly Routines so that the school schedule is digitized.

**Why this priority**: Connects Students, Teachers, and Time.
**Independent Test**: Can create a Class, add Subjects, and view a populated Timetable.

**Acceptance Scenarios**:

1. **Given** the Academic Setup page, **When** creating a Class (e.g., "Class 10"), **Then** it is saved.
2. **Given** a Class, **When** assigning Subjects, **Then** specific subjects are linked to that class.
3. **Given** a Class and Day, **When** adding a Routine entry (Time, Subject, Teacher), **Then** it appears in the Weekly Timetable view.

### User Story 4 - Global Navigation & Search (P3)

As an Admin, I want to search for students or pages from the header and access new modules via the Sidebar.

**Why this priority**: Improves usability and navigation efficiency.
**Independent Test**: Typing in the search bar filters results.

**Acceptance Scenarios**:

1. **Given** the Header, **When** typing "Student Name", **Then** a dropdown shows matching results.
2. **Given** the Sidebar, **When** viewing the menu, **Then** "Teachers", "Class", "Subject", and "Routine" links are visible.

## Clarifications

### Session 2026-02-12
- Q: How are time slots defined for the Weekly Routine/Timetable? → A: Fixed Global Periods (e.g., Period 1, Period 2) defined once for the school.
- Q: How should a Teacher's "Subject Specialization" be stored and validated? → A: Linked Multi-select from existing Subjects.
- Q: Should the Routine Manager prevent Teacher double-booking (scheduling limits)? → A: Strict Blocking (Error on save).
- Q: Does the Global Search in the header include application navigation (pages) results? → A: Entities + Pages (Students, Teachers, Routes).
- Q: How should the system handle deletion of a Teacher who is assigned to a Class Routine? → A: Block Deletion if assigned.
- Q: What is the metric for "Teacher Performance" in the Dashboard Chart? → A: Average marks of all classes taught by the respective teacher.
- Q: What content should appear in the "Recent Activity" feed? → A: Mocked stream of system events (e.g., "Student X paid fees", "Teacher Y added attendance").
- Q: How should the dashboard handle loading or empty states? → A: Display skeleton loaders during fetch; Show "Welcome to Sanchalan" empty state if no data exists.

## Functional Requirements

### Dashboard UI
1.  **Global Search**: Input field in Header to search Students/Teachers and App Pages.
    - Limits: Show max 5 results per category.
    - No Results: Display "No results found" text.
2.  **Exam Result Chart**: Grouped Bar Chart showing Student vs Teacher performance (Mock data).
    - Metric: Teacher bar = Average class grade; Student bar = School wide average.
    - Range: Last 6 months.
3.  **Gender Chart**: Donut Chart showing Male/Female ratio.
4.  **Star Students**: Table widget showing top 3-5 students by marks.
    - Fields: Name, ID, Marks, Percentage.
5.  **Recent Activity**: Feed of latest 5 system events (Mock Data).
6.  **Stats Cards**: Updated visual style with icons and specific colors (Purple, Blue, Orange, Green).
7.  **UX States**:
    - Loading: Skeleton loader for charts and widgets.
    - Zero State: "No Data Available" placeholder for new schools.

### Teacher Module
1.  **List View**: Grid/List of teachers with avatar, name, and subject.
2.  **Profile**: Details view with contact info.
3.  **Add/Edit**: Form with validation. Include "Subjects" field (Multi-select) derived from Subject Manager.
4.  **Deletion**: Block deletion if the Teacher is assigned to any active Routine.

### Academic Module
1.  **Class Manager**: Simple CRUD for Classes.
2.  **Subject Manager**: CRUD for Subjects, linked to Classes.
3.  **Routine Manager**: Matrix view (Days x Global Periods) to assign Subject+Teacher. Functionality relies on pre-defined Period mapping. Validation must block Teacher double-booking.

## Success Criteria

*   **Visual Fidelity**: Dashboard matches the reference design layout and color palette (approximate).
*   **Performance**: Dashboard renders in < 1s with mock data.
*   **Completeness**: All 4 new navigation items (Teachers, Class, Subject, Routine) are functional.
*   **Usability**: Global search returns relevant results within 500ms.

## Assumptions

*   Data is mocked (JSON/MSW) similar to previous phases.
*   "Exam Result" chart data will be mocked as aggregate monthly data.
*   "Transport" and "Hostel" are out of scope for this phase.
*   "Library" is out of scope for this phase.
*   Design will match the reference image's aesthetics using current utility classes.
