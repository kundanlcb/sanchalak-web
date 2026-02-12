# Quickstart: Financial Admin Module

**Feature**: `003-financial-admin`
**Date**: 2026-02-12

## 1. Prerequisites

Ensure Phase 2 is complete. This module relies on `@react-pdf/renderer` and `date-fns`.

### Install Dependencies
```bash
npm install recharts
# @react-pdf/renderer should already be installed from Phase 2
```

## 2. Using the Payment Sandbox

Since we do not integrate real banking APIs in this repo:
1.  Navigate to **Financial > Fee Management**.
2.  Select a Student.
3.  Click "Pay Online".
4.  The **Mock Gateway Modal** will open.
    *   **Amount**: Auto-filled.
    *   **Method**: Select UPI or Card.
    *   **Outcome**: Toggle "Force Success" or "Force Failure" to test error handling.
5.  Click "Confirm Payment".
6.  Wait 2 seconds (simulated network lag).
7.  On success, the receipt PDF will automatically download.

## 3. Data Setup (Mock)

The mock data is seeded with:
*   **3 Fee Categories**: Tuition (Monthly), Transport (Monthly), Annual Day (One-Time).
*   **Class 5**: Default fee structure assigned.
*   **Transactions**: 5 sample transactions for "Raj Kumar" (2 Paid, 1 Failed).

## 4. Testing Payroll

1.  Navigate to **Admin > Payroll**.
2.  Select "February 2026".
3.  Click "Calculate Payroll" (bulk operation).
4.  The system will simulate attendance-based calculation for all 5 mock staff members.
5.  Click "View Payslip" on any row to generate the PDF.

## 5. Troubleshooting

*   **PDF not downloading?** Ensure your browser allows pop-ups/downloads from localhost.
*   **Charts empty?** The dashboard uses aggregated data. Check if `finance.json` mock data is loaded correctly.

