# Technical Plan: Full CRUD Operations

> **Goal**: Implement Edit and Delete capabilities for Students, Staff, and Finance entities using the existing MSW + MockDB architecture.

## 1. Architecture & Design

### A. Data Layer (MSW + MockDB)
We need to extend the `db.ts` layer and MSW handlers to support `PUT` and `DELETE` verbs.

*   **Mock DB**: ensure `update` and `delete` methods are exposed for collections (`student`, `teacher`, `class`, `subject`, `feeStructure`).
*   **Handlers**:
    *   `PUT /api/students/:id`: Update student details.
    *   `DELETE /api/students/:id`: Soft delete (mark `status: 'archived'`) or hard delete. *Decision: Soft delete is safer for "Archive", but hard delete is simpler for "Mistakes". Let's stick to spec: "Delete/Archive". We will implement Hard Delete for now for simplicity in mocks, or a simple status toggle if `status` field exists.*
    *   `PUT /api/staff/:id`: Update teacher.
    *   `DELETE /api/staff/:id`: Remove teacher.
    *   `PUT /api/finance/structure/:id`: Update fee amount/breakdown.
    *   `DELETE /api/finance/structure/:id`: Remove fee structure (with dependency check logic in handler).

### B. Client State (React Query / Hooks)
Update existing custom hooks to export mutation functions.

*   `useStudents`: Export `updateStudent` (mutation), `deleteStudent` (mutation).
*   `useStaff`: Export `updateTeacher`, `deleteTeacher`.
*   `useFeeStructure`: Export `updateStructure`, `deleteStructure`.

### C. UI Components

#### 1. Student Management
*   **Target**: `src/features/students/pages/StudentListPage.tsx`
*   **Changes**:
    *   Add "Actions" column to table.
    *   "Edit": Navigates to `/students/edit/:id` OR opens the Admission Form in "Edit Mode".
    *   "Delete": Opens a Confirmation Modal.
*   **Form**: `StudentAdmissionPage.tsx` / `StudentForm` needs to support `initialValues` fetched by ID.
    *   *Refactor Strategy*: Extract the form from `StudentAdmissionPage` into `StudentForm.tsx`. `StudentAdmissionPage` uses it for Create. New `StudentEditPage` uses it for Edit.

#### 2. Staff Management
*   **Target**: `src/features/staff/pages/StaffListPage.tsx`
*   **Changes**:
    *   Add "Actions" column.
    *   "Edit": Opens `StaffForm` (needs extraction if not already generic) in Modal or Page.
    *   "Delete": Confirmation Modal.

#### 3. Finance Management
*   **Target**: `src/features/finance/pages/FeeManagementPage.tsx`
*   **Changes**:
    *   The "Fee Structure" list is likely in a tab. Add Edit/Delete actions.
    *   For "Edit", populate the `FeeStructureForm` with existing data.
    *   For "Delete", check if `db.transactions` has entries for this structure (mock validation).

## 2. File Structure Changes

No major directory changes. Mostly refactoring existing pages to extract Forms and updating handlers.

```text
src/
  features/
    students/
      components/
        StudentForm.tsx       # Extracted from AdmissionPage
      pages/
        StudentEditPage.tsx   # New route
    staff/
      components/
        StaffForm.tsx         # Reusable form
    finance/
      components/
        FeeStructureForm.tsx  # Update to accept initialData
```

## 3. Implementation Steps

1.  **Mock Layer**: Implement `PUT` / `DELETE` handlers for all 3 domains.
2.  **Hooks**: Add mutations in hook files.
3.  **Refactor**: Extract Forms to be reusable (accepting `defaultValues`).
4.  **UI Wiring**: Connect Lists to Edit/Delete actions.
5.  **Routes**: Add `/students/edit/:id` and `/staff/edit/:id` if using page-based editing (preferable for complex forms like Students).

