# Checklist: Financial & Admin Requirements Quality
**Domain**: 003-financial-admin  
**Type**: Requirements Quality (Design Review)  
**Status**: Generated  

## Purpose
This checklist acts as a unit test suite for the financial requirements specification. It validates that the requirements for fees, payments, and payroll are complete, clear, consistent, and cover critical failure scenarios before implementation begins.

## 1. Fee Configuration & Structure [Completeness]
- [ ] CHK001 Are all fee category attributes (Tax Rate, Frequency, Mandatory/Optional) explicitly defined? [Spec §FR-001]
- [ ] CHK002 Is the handling of "Fee Structure Versioning" (mid-year changes) clearly specified? [Edge Case, Spec §FR-009]
- [ ] CHK003 Are the rules for "Late Fee" calculation (Fixed vs Percentage, Grace Period) unambiguous? [Clarity, Spec §FR-004]
- [ ] CHK004 Is the precedence order defined for multiple applicable discounts (e.g., Sibling + Merit)? [Ambiguity, Gap]
- [ ] CHK005 Are requirements defined for "Pro-rated Fees" for mid-term admissions? [Gap]
- [ ] CHK006 Is the behavior specified when a fee category is deleted while having active transactions? [Consistency]

## 2. Payment Gateway & Transactions [Robustness]
- [ ] CHK007 Are "Partial Payment" rules defined (Minimum amount, Priority of allocation)? [Spec §FR-016]
- [ ] CHK008 Is the "Idempotency" mechanism (preventing duplicate charges) technically specified? [Spec §FR-015]
- [ ] CHK009 Are "Network Timeout" recovery flows (Webhooks, Polling) explicitly defined? [Edge Case, Spec §FR-017]
- [ ] CHK010 Is the "Refund Workflow" (Initiation, Approval, Ledger Update) specified? [Gap]
- [ ] CHK011 Are requirements defined for handling "Chargebacks" or disputed transactions? [Gap]
- [ ] CHK012 Is the specific "Data Retention Policy" for transaction logs defined? [Compliance, Gap]

## 3. Digital Receipts & Ledger [Traceability]
- [ ] CHK013 Is the "Receipt Numbering Logic" (Format, Sequence handling) explicitly defined? [Spec §FR-022]
- [ ] CHK014 Are the requirements for "Offline/Cash Payment" receipt generation consistent with online flows? [Consistency, Spec §FR-024]
- [ ] CHK015 Is the content of the receipt (Legal Entity Name, Tax ID, Breakdown) fully specified? [Completeness, Spec §FR-021]
- [ ] CHK016 Are requirements defined for correcting/voiding an erroneous receipt? [Exception Flow, Gap]
- [ ] CHK017 Is the definition of "Legally Valid Receipt" (Digital Signature requirements) addressed? [Compliance]

## 4. Payroll & Salary [Calculations]
- [ ] CHK018 Is the formula for "Pro-rated Salary" (Working Days vs Calendar Days) unambiguously defined? [Clarity, Spec §FR-030]
- [ ] CHK019 Are "Statutory Deduction" rules (PF, TDS) flexible enough for regulatory changes? [Maintainability, Spec §FR-032]
- [ ] CHK020 Is the logic for "Loan/Advance Recovery" (Max % deduction per month) specified? [Completeness, Spec §FR-037]
- [ ] CHK021 Are requirements defined for "Loss of Pay" (LOP) calculation linked to Attendance? [Integration, Spec §FR-030]
- [ ] CHK022 Is the workflow for "Salary Hold/Release" defined for disciplinary cases? [Edge Case, Gap]
- [ ] CHK023 Are "Negative Salary" scenarios (Deductions > Earnings) handled in the spec? [Edge Case]

## 5. Security & Access Control [Compliance]
- [ ] CHK024 Are RBAC requirements defined for "Sensitive Financial Actions" (Refunds, Salary Config)? [Security]
- [ ] CHK025 Is the "Audit Trail" requirement specific about *what* is logged (User IP, Old Value/New Value)? [Traceability, Spec §FR-036]
- [ ] CHK026 Are data visibility rules defined for "Class Teachers" vs "Finance Staff" (e.g., Can teachers see fee dues)? [Privacy]
- [ ] CHK027 Are requirements defined for "Export Limits" (preventing bulk data theft)? [Security, Gap]

## 6. Dashboards & Reporting [Measurability]
- [ ] CHK028 Are "Real-time" refresh requirements quantified (latency limits)? [Perf, Spec §FR-041]
- [ ] CHK029 Are the specific formulas for metrics like "Collection Rate" (Accrual vs Cash basis) defined? [Ambiguity]
- [ ] CHK030 Are requirements defined for "Historical Data" visualization (Year-over-Year comparison)? [Completeness]
- [ ] CHK031 Is the "Date Range" behavior defined for "Future/Predicted" cash flow? [Gap]

## 7. NFRs (Non-Functional)
- [ ] CHK032 Are "Concurrency" requirements (Peak volume during fee week) specified? [Scale, Spec §SC-003]
- [ ] CHK033 Are "Encryption" requirements defined for storing sensitive bank details/UPI IDs? [Security, Spec §SC-018]
- [ ] CHK034 Is "Accessibility" (WCAG) required for the Parent Payment portal? [UX, Spec §FR-046]
