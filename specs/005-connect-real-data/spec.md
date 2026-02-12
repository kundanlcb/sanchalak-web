# Feature Specification: Connect Real Data to Dashboards & Reports

**Feature Branch**: `005-connect-real-data`
**Created**: 2026-02-12
**Status**: Draft
**Input**: Wire up the Dashboard to fetch real counts (students, teachers), implement real Report Generation querying Marks DB, connect Financial Analytics to FeePayment records, and link Fee Management to real Classes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dashboard displays real-time statistics (Priority: P1)

As an administrator, I want to see accurate counts of Students, Teachers, Classes, and Revenue on the dashboard so that I can monitor the school's current status.

**Why this priority**: The dashboard is the first screen seen and must reflect reality to build trust.

**Independent Test**: Add a new student via the Admission Form and verify the dashboard count increments by 1.

**Acceptance Scenarios**:
1. **Given** 830 active students in the system, **When** I load the dashboard, **Then** the "Total Students" widget displays "830".
2. **Given** I add a new teacher profile, **When** I return to the dashboard, **Then** the "Total Teachers" widget increments by 1.
3. **Given** fee payments have been recorded for the current month, **When** I load the dashboard, **Then** the "Monthly Earnings" widget shows the exact sum of these payments.

### User Story 2 - Fee Structures linked to actual Classes (Priority: P2)

As an administrator, I want to assign fee structures to existing classes (e.g., "Class 1", "Class 10") instead of selecting from a hardcoded list so that fees are correctly mapped to the school's actual academic structure.

**Why this priority**: Essential for correct billing and ensures fee rules apply to real students.

**Independent Test**: Create a new Class in "Academic Settings", then go to "Fee Management" and verify it appears in the class selection dropdown when creating a fee structure.

**Acceptance Scenarios**:
1. **Given** a list of active classes in the system, **When** I open the "Add Fee Structure" form, **Then** the class selection dropdown lists all these classes dynamically.
2. **Given** I select "Class 10", **When** I save the structure, **Then** it is permanently associated with that specific class.

### User Story 3 - Report Cards reflect entered marks (Priority: P3)

As a teacher, I want generated report cards to use the actual marks I entered for a student so that I can distribute accurate results to parents.

**Why this priority**: Core academic deliverable. Previously simulated, now must be real.

**Independent Test**: Enter marks for a student in "Marks Entry", then go to "Report Generation" and verify the generated PDF/View matches those specific marks.

**Acceptance Scenarios**:
1. **Given** I have entered 85/100 for Math for a specific student, **When** I generate their Report Card, **Then** the Mathematics row shows "85" and the calculated grade.
2. **Given** a student has no marks entered for a term, **When** I generate a report, **Then** it should clearly indicate "No Data" or "Absent" rather than showing placeholder numbers.
3. **Given** multiple subjects with marks, **When** the report is generated, **Then** the "Total" and "Percentage" are accurately calculated from these marks.

### User Story 4 - Financial Analytics reflect actual payments (Priority: P4)

As an administrator, I want the "Financial Reports" charts to visualize actual payment records so that I can analyze real income trends.

**Why this priority**: Provides insight into the financial health of the institution based on real transactions.

**Independent Test**: Record a new fee payment of ₹5000, then verify the "Income vs Expense" chart for the current month increases by exactly ₹5000.

**Acceptance Scenarios**:
1. **Given** payment records exist for April and May, **When** I view the "Income vs Expense" chart, **Then** the bars for those months correspond to the total sum of payments recorded.
2. **Given** a student has unpaid fees, **When** I view the "Defaulters List", **Then** that student appears with the correct "Amount Due" calculation.

---

## Functional Requirements

### Dashboard (General)
- **FR 1.1**: The system must calculate and display the total number of active students on the dashboard.
- **FR 1.2**: The system must calculate and display the total number of active teachers on the dashboard.
- **FR 1.3**: The system must calculate and display the total number of configured classes.
- **FR 1.4**: The system must calculate "Monthly Earnings" by summing all fee payments recorded in the current calendar month.

### Fee Management (Setup)
- **FR 2.1**: The Fee Structure creation form must dynamically populate the Class selection list from the actively configured classes in the system.
- **FR 2.2**: The selection must store the unique identifier of the Class to ensure the link persists if the class name changes.

### Academic Reports
- **FR 3.1**: The Report Generation feature must allow searching for a student by Class and Exam Term.
- **FR 3.2**: The system must retrieve the specific marks recorded for the selected student and exam term from the marks repository.
- **FR 3.3**: The system must automatically calculate the Total Marks Obtained, Percentage, and Final Grade based on the retrieved marks.
- **FR 3.4**: If no marks exist for a subject or term, the report must handle the empty state gracefully (e.g., displaying "N/A").

### Financial Analytics
- **FR 4.1**: The Financial Reports module must aggregate data from the complete history of fee payments.
- **FR 4.2**: The "Income vs Expense" chart must group payment totals by month and year.
- **FR 4.3**: The "Defaulters List" must identify students whose total paid fees are less than their total applicable fees.
- **FR 4.4**: The list must display the calculated "Due Amount" (Applicable - Paid) for each defaulting student.

---

## Technical Constraints & Assumptions

- **Data Source**: All data must be sourced from the application's central data store (currently the mock database layer), not hardcoded constants.
- **Client-Side Processing**: Aggregations (sums, counts, averages) will be performed on the client side for this prototype phase.
- **Expense Data**: As there is no "Expense Entry" module yet, the "Expense" portion of financial charts will remain simulated/random for comparison purposes.
- **Grading Logic**: A standard percentage-based grading scale (e.g., >90% = A+) will be used for report card calculations.

---

## Success Criteria

1.  **Accuracy**: "Total Students" count on the dashboard matches the actual number of student records in the system.
2.  **Financial Integrity**: "Monthly Revenue" displayed matches the exact sum of fee receipts generated for the month.
3.  **Data Consistency**: A generated Report Card displays exactly the same marks as visible in the Marks Entry screen.
4.  **Integration**: The Fee Structure form lists only valid, existing classes from the academic configuration.

## Assumptions
- The Report Card format (PDF/View) layout does not need to change, only the data populating it.
- Performance of client-side data aggregation is acceptable for dataset sizes < 1000 records.
