# Tasks: Financial Admin

**Feature**: 003-financial-admin
**Input**: Design documents from `/specs/003-financial-admin/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Install dependencies: `recharts` for Dashboards in `package.json`
- [x] T002 Verify `@react-pdf/renderer` and `date-fns` are present in `package.json`
- [x] T003 Create directory structure: `src/features/finance/` (components, pages, hooks, types, utils)
- [x] T004 Create directory structure: `src/features/payroll/` (components, pages, hooks, types)
- [x] T005 [P] Copy Fee/Finance contracts to `src/features/finance/types/index.ts`
- [x] T006 [P] Copy Payroll contracts to `src/features/payroll/types/index.ts`

## Phase 2: Foundational (Mock Data)

- [x] T007 [P] Create mock Fee Categories (Tuition, Transport) in `src/mocks/data/fees.json`
- [x] T008 [P] Create mock Fee Structures (Grade 1-12) in `src/mocks/data/feeStructures.json`
- [x] T009 [P] Create mock Transactions (Success, Failed, Pending) in `src/mocks/data/transactions.json`
- [x] T010 [P] Create mock Payroll data (Staff salaries, Feb records) in `src/mocks/data/payroll.json`
- [x] T011 Implement MSW handlers for Fees (GET/POST) in `src/mocks/handlers/finance.ts`
- [x] T012 Implement MSW handlers for Transactions (Create, Refund) in `src/mocks/handlers/finance.ts`
- [x] T013 Implement MSW handlers for Payroll (Calculate, List) in `src/mocks/handlers/payroll.ts`
- [x] T014 Register new handlers in `src/mocks/handlers/index.ts`

## Phase 3: Fee Management (US1)

- [x] T015 [US1] Create validation schema for Fee Category in `src/features/finance/types/schema.ts`
- [x] T016 [US1] Implement `FeeCategoryForm` modal in `src/features/finance/components/FeeCategoryForm.tsx`
- [x] T017 [US1] Create `FeeStructureForm` (Amount, Frequency, Late Fee Config) in `src/features/finance/components/FeeStructureForm.tsx`
- [x] T018 [US1] Implement `FeeStructureList` (Grouped by Class) in `src/features/finance/components/FeeStructureList.tsx`
- [x] T019 [US1] Create `useFees` hook (React Query mutations) in `src/features/finance/hooks/useFees.ts`
- [x] T020 [US1] Build `FeeManagementPage` (Tabs: Structures, Categories) in `src/features/finance/pages/FeeManagementPage.tsx`
- [x] T021 [US1] Add Route `/admin/finance/fees` in `src/routes/index.tsx` (or App.tsx)

## Phase 4: Online Payments & Ledger (US2)

- [x] T022 [US2] Implement comprehensive Fee Logic (Discounts, Late Fees, Partial Payments) in `src/features/finance/utils/feeUtils.ts`
- [x] T023 [US2] Create `StudentFeeLedger` component (Summary Cards + Transaction List) in `src/features/finance/components/StudentFeeLedger.tsx`
- [x] T024 [P] [US2] Create `PaymentGatewayMock` modal (Simulate UPI/Card, Success/Fail) in `src/features/finance/components/PaymentGatewayMock.tsx`
- [x] T025 [US2] Implement `usePayment` hook (handleTransaction, idempotency mock) in `src/features/finance/hooks/usePayment.ts`
- [x] T026 [US2] Create `FeePaymentPage` for Parents in `src/features/finance/pages/FeePaymentPage.tsx`
- [x] T027 [US2] Add Route `/finance/pay` in `src/routes/index.tsx`
- [x] T050 [US2] Implement `DiscountCalculator` logic (Sibling, Merit) within `feeUtils.ts`
- [x] T051 [US2] Implement `LateFeeJob` simulation (Time-based penalty calculation) within `feeUtils.ts`
- [x] T052 [US2] Simulate Webhook Reconciliation (Gateway callback handling) in `usePayment.ts`



## Phase 5: Digital Receipts (US3)

- [x] T028 [P] [US3] Create `ReceiptDocument` PDF template in `src/features/finance/components/receipts/ReceiptDocument.tsx`
- [x] T029 [P] [US3] Create `ReceiptDownloadButton` (Blob generation) in `src/features/finance/components/receipts/ReceiptDownloadButton.tsx`
- [x] T030 [US3] Integrate Download Button into `StudentFeeLedger.tsx` (Transaction History row)
- [x] T031 [US3] Integrate Download Button into `PaymentGatewayMock.tsx` (Success state)

## Phase 6: Staff Payroll (US4)

- [x] T032 [US4] Create `SalaryConfigForm` (Base Salary, HRA, DA, PF, TDS) in `src/features/payroll/components/SalaryConfigForm.tsx`
- [x] T033 [US4] Create `PayrollTable` (List of generated payrolls) in `src/features/payroll/components/PayrollTable.tsx`
- [x] T034 [US4] Create `PayrollStats` widget (Total Payout, Pending) in `src/features/payroll/components/PayrollStats.tsx`
- [x] T035 [US4] Implement `PayrollGenerator` modal (Select Month -> Bulk Calc) in `src/features/payroll/components/PayrollGenerator.tsx`
- [x] T036 [P] [US4] Create `PayslipDocument` PDF template in `src/features/payroll/components/PayslipDocument.tsx`
- [x] T037 [US4] Create `PayrollPage` (Tabs: Generator, History, Config) in `src/features/payroll/pages/PayrollPage.tsx`
- [x] T038 [US4] Add Route `/admin/finance/payroll` in `src/routes/index.tsx`

## Phase 7: Analytics Dashboards (US5)

- [x] T039 [P] [US5] Create `IncomeExpenseChart` (Bar Chart) in `src/features/analytics/components/IncomeExpenseChart.tsx`
- [x] T040 [P] [US5] Create `FeeCollectionChart` (Pie Chart) in `src/features/analytics/components/FeeCollectionChart.tsx`
- [x] T041 [US5] Create `DefaultersListWidget` in `src/features/analytics/components/DefaultersListWidget.tsx`
- [x] T042 [US5] Implement `FinancialReportsPage` (Grid of widgets) in `src/features/analytics/pages/FinancialReportsPage.tsx`
- [x] T043 [US5] Add Route `/admin/finance/reports` in `src/routes/index.tsx`

## Phase 8: Polish & QA

- [x] T044 Verify Currency Formatting for INR (₹) across all screens
- [x] T045 Verify Dark Mode support for Recharts (Tooltip custom style)
- [x] T046 Test Mobile Layout for Payment Modal (iframe/modal behavior)
- [x] T047 Verify PDF generation works offline (no external fonts blocked)
- [x] T048 Verify "Late Fee" application logic in Fee Ledger
- [x] T049 Verify "Partial Payment" scenario in Ledger updates

## Phase 9: Post-Implementation Stabilization

- [x] T053 Fix `Uncaught SyntaxError` (ambiguous exports) by enforcing `import type` across Finance/Payroll modules
- [x] T054 Fix `SalaryConfigForm` prop mismatch (`isLoading` -> `disabled`)
- [x] T055 Fix `PayrollPage` schema validation errors (`initialValues` -> `initialData`, Type casting)
- [x] T056 Fix `StudentForm` schema validation errors (`rollNumber` string/number mismatch)
- [x] T057 Fix Recharts `formatter` type compatibility in Analytics charts
- [x] T058 Verify production build (`npm run build`) passes with zero errors

