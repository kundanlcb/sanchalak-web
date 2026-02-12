# Tasks: Spec 006 - Full CRUD Operations

## Phase 1: Mock Layer & API Infrastructure
- [x] **T001**: Review `src/mocks/db.ts` to ensure `update` and `delete` operations are supported for all collections.
- [x] **T002**: Update `src/mocks/handlers/studentHandlers.ts` with `PUT /api/students/:id` and `DELETE /api/students/:id`.
- [x] **T003**: Update `src/mocks/handlers/schoolOpsHandlers.ts` (Staff) with `PUT /api/staff/:id` and `DELETE /api/staff/:id`.
- [x] **T004**: Update `src/mocks/handlers/financeHandlers.ts` with `PUT /api/finance/structure/:id` and `DELETE /api/finance/structure/:id`.
- [x] **T005**: Update `src/hooks/useStudents.ts` and `src/hooks/useStaff.ts` to include `update` and `delete` mutation functions.
- [x] **T006**: Update `src/hooks/useFinance.ts` (or equivalent) to support Fee Structure updates/deletes.

## Phase 2: Student Management CRUD
- [x] **T007**: Refactor `StudentAdmissionPage.tsx`: Extract the form logic into `src/features/students/components/StudentForm.tsx`.
- [x] **T008**: Create `src/features/students/pages/StudentEditPage.tsx` using `StudentForm` and fetching data by ID.
- [x] **T009**: Update `App.tsx` routes to include `/students/edit/:id`.
- [x] **T010**: Update `StudentListPage.tsx`: Add "Actions" column with Edit (Link) and Delete (Dialog) buttons.
- [x] **T011**: Implement Delete confirmation logic in `StudentListPage`.

## Phase 3: Staff Management CRUD
- [x] **T012**: Refactor `StaffDirectoryPage.tsx`: Ensure Add/Edit uses a reusable `StaffForm` component.
- [x] **T013**: Update `StaffListPage.tsx`: Add "Actions" column (Edit/Delete).
- [x] **T014**: Wiring: Connect "Edit" to populate the form modal/drawer, and "Delete" to remove from DB.

## Phase 4: Finance Management CRUD
- [x] **T015**: Update `FeeStructureForm.tsx`: Accept `initialValues` prop and support "Update" mode.
- [x] **T016**: Update `FeeManagementPage.tsx`: Add Edit/Delete buttons to the fee structure list items.
- [x] **T017**: Wiring: Clicking "Edit" opens the form with data; "Delete" removes the structure.

## Phase 5: Verification & Polish
- [x] **T018**: Verify Student Edit: Change name/class -> Save -> Check List.
- [x] **T019**: Verify Student Delete: Delete -> Check List -> Check Dashboard count.
- [x] **T020**: Verify Staff Edit/Delete operations.
- [x] **T021**: Verify Finance CRUD operations.
- [x] **T022**: Run manual "Check Prerequisites" to ensure no linting/build errors.

## Phase 6: UI Refinements (Post-Implementation Feedback)
- [x] **T023**: Redesign Report Generation Page: Implement split-pane layout with persistent sidebar filters and preview area.
