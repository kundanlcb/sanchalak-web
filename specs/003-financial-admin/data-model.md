# Data Model: Financial & Admin Module

**Feature**: `003-financial-admin`
**Date**: 2026-02-12

## Entities

### 1. Fee Management

#### FeeCategory (Master)
*Defines types of fees collected (Tuition, Transport, etc.)*

| Field | Type | Description |
|---|---|---|
| id | string (UUID) | Unique ID |
| name | string | "Tuition Fee", "Transport Fee" |
| description | string | Optional details |
| type | string | 'Tuition' \| 'Transport' \| 'Exam' \| 'Other' |
| frequency | string | 'Monthly' \| 'Quarterly' \| 'Annual' \| 'OneTime' |
| isMandatory | boolean | True by default |
| taxRate | number | Percentage (0 for education exempt) |

#### FeeStructure (Config)
*Maps amounts to Classes for an Academic Year*

| Field | Type | Description |
|---|---|---|
| id | string (UUID) | Unique ID |
| academicYear | string | "2025-2026" |
| classId | string (FK) | Applies to Grade 5, etc. |
| categoryId | string (FK) | Reference to FeeCategory |
| amount | number | Base amount (e.g., 5000) |
| dueDateDay | number | Day of month (e.g., 10th) |
| lateFeeRule | object | `{ gracePeriod: 7, penaltyType: 'Fixed', amount: 500 }` |

#### StudentFeeRecord (Ledger)
*Individual student's financial standing*

| Field | Type | Description |
|---|---|---|
| id | string (UUID) | Unique ID |
| studentId | string (FK) | Reference to Student |
| feeStructureId | string (FK) | Reference to Structure |
| totalAmount | number | Calculated (Structure amount - Discount + Late Fee) |
| paidAmount | number | Sum of transactions |
| pendingAmount | number | Total - Paid |
| status | string | 'Paid' \| 'Partial' \| 'Overdue' \| 'Pending' |
| transactions | string[] (FK) | List of Transaction IDs |

### 2. Payments & Receipts

#### Transaction
*Financial event log*

| Field | Type | Description |
|---|---|---|
| id | string (UUID) | Unique ID (TRX-...) |
| studentId | string (FK) | Payer |
| amount | number | 5000.00 |
| paymentMethod | string | 'UPI' \| 'Card' \| 'Cash' \| 'Cheque' |
| status | string | 'Pending' \| 'Success' \| 'Failed' |
| transactionDate | ISO Date | Timestamp |
| gatewayRefId | string | External ID (rza_pay_...) |
| receiptId | string (FK) | Reference to Receipt |

#### Receipt
*Generated proof of payment*

| Field | Type | Description |
|---|---|---|
| id | string (UUID) | Unique ID (RCP-2026-...) |
| transactionId | string (FK) | Reference to Transaction |
| receiptNumber | string | Human-readable sequential ID |
| issuedDate | ISO Date | Timestamp |
| pdfUrl | string | S3 URL or Blob reference |

### 3. Payroll Management

#### StaffSalaryStructure
*Employee base compensation configuration*

| Field | Type | Description |
|---|---|---|
| id | string (UUID) | Unique ID |
| staffId | string (FK) | Reference to Staff User |
| baseSalary | number | Monthly base |
| allowances | object | `{ HRA: 5000, Travel: 2000 }` |
| deductions | object | `{ PF: 1800, Tax: 2000 }` |
| paymentFrequency | string | 'Monthly' |

#### PayrollRecord
*Monthly salary calculation execution*

| Field | Type | Description |
|---|---|---|
| id | string (UUID) | Unique ID (PAY-FEB-2026-...) |
| staffId | string (FK) | Reference to Staff |
| month | string | "February 2026" |
| workingDays | number | 28 |
| presentDays | number | 26 |
| totalEarnings | number | Base + Allowances |
| totalDeductions | number | PF + Tax + Absences |
| netPayable | number | Earnings - Deductions |
| status | string | 'Draft' \| 'Approved' \| 'Paid' |
| paymentDate | ISO Date | When simulated payment happened |

## Relationships

*   **One-to-Many**: `FeeCategory` -> `FeeStructure`
*   **One-to-Many**: `FeeStructure` -> `StudentFeeRecord`
*   **One-to-Many**: `Student` -> `Transaction`
*   **One-to-One**: `Transaction` -> `Receipt`
*   **One-to-Many**: `Staff` -> `PayrollRecord`

