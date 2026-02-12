# Research: Financial & Admin Module

**Feature**: `003-financial-admin`
**Date**: 2026-02-12

## 1. Charting Library Decision

**Problem**: Need to visualize financial health (Income/Expense/Overdue) and student demographics.

**Evaluated Options**:
1.  **Recharts** (Recommended):
    *   Pros: React-native (component-based), composable, SVG-based (crisp), good TypeScript types, light bundle.
    *   Cons: Documentation can be sparse for edge cases.
2.  **Chart.js / react-chartjs-2**:
    *   Pros: Canvas-based (better for massive datasets), very popular.
    *   Cons: Canvas scaling on retina screens can be tricky, imperative API wrapper.
3.  **Nivo**:
    *   Pros: Beautiful, highly customizable (D3 based).
    *   Cons: Heavy bundle, complexity overkill for simple admin dashboards.

**Decision**: **Recharts**.
*   **Rationale**: Matches our component-first architecture. We only need simple Bar/Pie/Line charts. SVG is preferred for crisp rendering on admin dashboards.
*   **Action**: `npm install recharts`

## 2. Payment Gateway Simulation Strategy

**Problem**: Real payment integration (Razorpay/Stripe) requires API keys and server-side secrets. We need a fully client-side transferable demo.

**Approach**: "Sandbox Modal"
*   **Component**: `PaymentGatewayMock.tsx`
*   **Behavior**:
    1.  Opens a modal mimicking a bank page.
    2.  Displays transaction summary (Amount, ID).
    3.  User selects "outcome" (Force Success / Force Failure) or random.
    4.  Spinner for 2s delay.
    5.  Returns a typed `PaymentResponse` object to the parent.
*   **Benefit**: Allows testing error handling (toast notifications) and receipt generation without external dependencies.

## 3. Fee Structure Data Model

**Problem**: Fees are complex (Tuition, Transport, etc.) and vary by Grade.

**Model Design**:
*   **FeeCategory**: Master list (Tuition, Transport, Exam).
*   **FeeStructure**: Join table (ClassID + CategoryID -> Amount, Frequency).
*   **Optimization**: Instead of assigning to every student, we assign a "Fee Group" to a Class.
*   **Overrides**: `StudentFeeAdjustment` table for scholarships/discounts.

## 4. PDF Generation (Reuse)

**Strategy**: Reuse `@react-pdf/renderer` from Phase 2.
*   **Templates needed**:
    1.  `ReceiptTemplate`: Official receipt with transaction ID.
    2.  `PayslipTemplate`: Monthly salary breakdown.
*   **Constraint**: Must generate client-side.
*   **Performance**: Use `PDFDownloadLink` to generate Blob on demand, not on render.

## 5. Mock Data Integrity

**Challenge**: Financial data must add up (Paid + Pending = Total).
**Solution**:
*   Mock generators in `mocks/data/finance.json` must be coherent.
*   We will script a small utility to generate consistent ledger entries based on student count.

