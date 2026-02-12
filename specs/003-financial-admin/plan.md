# Implementation Plan: Financial & Admin

**Branch**: `003-financial-admin` | **Date**: 2026-02-12 | **Status**: Implemented | **Spec**: [specs/003-financial-admin/spec.md](spec.md)
**Input**: Feature specification from `specs/003-financial-admin/spec.md`

## Summary

Implement the Financial Administration module to enable Fee Management, Online Payment simulation, Receipt Generation, Staff Payroll, and Executive Dashboards. This phase shifts Sanchalan from a record-keeping system to a business-critical financial platform.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x
**Primary Dependencies**:
- `recharts`: For Analytics Dashboards (Needs installation).
- `@react-pdf/renderer`: For Receipts and Pay Slips (Already installed).
- `date-fns`: Date formatting (Already installed).
- `zod` + `react-hook-form`: Form validation.
**Storage**: Client-side Mock Data (JSON + MSW).
**Testing**: Manual QA with "Payment Sandbox" mode.
**Performance Goals**: Dashboard render < 1s, PDF generation < 3s.
**Constraints**: strictly client-side mock for payment gateway (no real money processing), responsive dashboards.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Sanchalak Constitution principles:

- [x] **Security**: RBAC for financial routes (Admin only for config/payroll).
- [x] **Components**: Reuse `Card`, `Table` from previous phases.
- [x] **Type Safety**: Defined schemas for `FeeStructure`, `Transaction`, `Payroll`.
- [x] **Backend Integration**: MSW handlers for financial transactions.
- [x] **Performance**: Dashboards will use aggregated mock data to avoid heavy client-side calc.
- [x] **UX/i18n**: Multi-currency formatting (INR standard).
- [x] **Complexity**: Payment Gateway is simulated via a "Sandbox" modal.

## Project Structure

### Documentation

```text
specs/003-financial-admin/
├── plan.md              # This file
├── research.md          # Charting lib decisions
├── data-model.md        # Fee & Payment schemas
├── quickstart.md        # How to test payments
├── contracts/           # API types
│   ├── fees.ts
│   ├── finance.ts
│   └── processing.ts
└── tasks.md             # Execution steps
```

### Source Code

```text
src/
├── features/
│   ├── finance/
│   │   ├── components/    # FeeConfig, PaymentModal, ReceiptPDF
│   │   ├── pages/         # FeeManagementPage, PaymentHistoryPage
│   │   ├── hooks/         # useFees, useTransactions
│   │   ├── types/         # Domain types
│   │   └── utils/         # Currency formatting
│   ├── payroll/
│   │   ├── components/    # PayrollTable, PayslipPDF
│   │   └── pages/         # PayrollPage
│   └── analytics/
│       ├── components/    # IncomeChart, EnrollmentChart
│       └── pages/         # DashboardPage
├── mocks/
│   ├── data/
│   │   ├── fees.json
│   │   ├── transactions.json
│   │   └── payroll.json
│   └── handlers/
│       └── finance.ts
```

## Evolution & Decisions

1.  **Charting Library**: We will use `recharts` for its composability and TypeScript support.
2.  **Payment Simulation**: Instead of integrating a real provider sandbox (Razorpay/Stripe), we will build a `PaymentGatewayMock` component that simulates network latency and success/failure states to keep the repo runnable offline.
3.  **PDF Strategy**: Reuse the pattern from Phase 2 (Report Cards) for Receipts and Payslips.
4.  **Build Optimization**: Enforced `import type` usage for all interface exports to resolve Vite/Rollup bundling issues with ambiguous exports.
5.  **Sidebar Integration**: Financial modules (Fees, Pay, Payroll, Reports) added to the main navigation for seamless access.

