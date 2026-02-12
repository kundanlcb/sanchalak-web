# Feature Specification: Phase 3 Financial & Admin

**Feature Branch**: `003-financial-admin`  
**Created**: 2026-02-11  
**Status**: Draft  
**Input**: User description: "Phase 3 Financial & Admin: Implement Fee Structure Definition with flexible fee categories, Online Payment Gateway integration for UPI and Card payments, Digital Receipt generation and delivery, Staff Payroll calculation with attendance tracking, and Advanced Admin Analytics Dashboards for financial health and operational insights. Complete Sanchalak financial management."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fee Structure Configuration (Priority: P1)

School administrators need to define flexible fee structures for different grade levels and categories including tuition, transport, examination, laboratory, library, and optional fees. Each fee structure has an academic year, payment schedule (monthly, quarterly, annual), due dates, late fee penalties, and applicable discounts. This foundation enables fee collection and payment tracking.

**Why this priority**: Fee structure is the prerequisite for all financial operations. Without defined fee categories and amounts, payment processing and financial reporting cannot function. This is the cornerstone of school revenue management.

**Independent Test**: Can be fully tested by admins creating fee structures for different grades (e.g., Grade 1-5: ₹5000/month tuition, Grade 6-10: ₹7000/month), setting payment schedules, defining late fees, without requiring actual payment processing.

**Acceptance Scenarios**:

1. **Given** admin logged into fee management module, **When** they create fee structure for "Grade 5 - Academic Year 2026-27" with tuition ₹60,000 (annual), transport ₹18,000 (annual), exam ₹6,000 (annual), and monthly payment schedule, **Then** system calculates monthly installments (₹7,000/month) and saves fee structure
2. **Given** fee structure with annual amount ₹84,000, **When** admin sets quarterly payment schedule, **Then** system automatically calculates quarterly installments (Q1: ₹21,000, Q2: ₹21,000, Q3: ₹21,000, Q4: ₹21,000) with due dates
3. **Given** fee structure for Grade 8, **When** admin adds late fee penalty "₹500 per month after due date", **Then** system saves penalty rule and applies automatically to overdue payments
4. **Given** multiple fee categories configured, **When** admin assigns fee structure to student "Raj Kumar" in Grade 5-A with optional transport fee excluded, **Then** student's fee ledger shows tuition + exam fees only (₹66,000 annual)
5. **Given** sibling students in same school, **When** admin applies "10% sibling discount" to second child, **Then** system recalculates fee structure reducing total by 10%

---

### User Story 2 - Online Payment Gateway Integration (Priority: P2)

Parents need to pay school fees online through the mobile app using UPI (Google Pay, PhonePe, Paytm) or debit/credit cards. They select the student, view pending fees with due dates, choose payment method, complete secure payment, and receive instant confirmation. The system updates fee ledger automatically and triggers receipt generation.

**Why this priority**: Online payments are the primary revenue collection mechanism, addressing the PRD goal of reducing fee overdue cases through automation. This enables cashless, convenient payment from anywhere.

**Independent Test**: Can be fully tested by parents initiating payment for pending fees, completing payment via test gateway, verifying fee ledger update, receipt generation, without requiring payroll or analytics features.

**Acceptance Scenarios**:

1. **Given** parent "Suresh Kumar" logged into mobile app with pending fee ₹7,000 for student "Raj Kumar", **When** they click "Pay Now", select UPI, and complete payment via Google Pay, **Then** system confirms payment, updates fee ledger showing ₹0 pending, and generates digital receipt
2. **Given** parent selecting payment via credit card, **When** they enter card details (number, CVV, expiry) and submit, **Then** payment gateway processes securely (PCI compliant), deducts amount, and returns success confirmation within 10 seconds
3. **Given** parent with multiple children owing fees, **When** they view payment screen, **Then** system displays each child's pending amount separately allowing individual or combined payment
4. **Given** payment in progress, **When** network connection drops before confirmation, **Then** system queries payment gateway for transaction status and reconciles automatically within 5 minutes
5. **Given** payment failure due to insufficient balance, **When** gateway returns error, **Then** system displays user-friendly message "Payment declined - insufficient funds" and allows retry
6. **Given** successful payment at 10:30 PM, **When** transaction completes, **Then** parent receives push notification "Payment of ₹7,000 received for Raj Kumar - Receipt: RCP-2026-00123" within 30 seconds

---

### User Story 3 - Digital Receipt Generation & Delivery (Priority: P3)

School office staff and system automatically generate professional PDF receipts for fee payments containing receipt number, student details, fee category breakdown, amount paid, payment method, date, and school seal. Receipts are instantly delivered to parent mobile app, stored in student's fee ledger, and downloadable. Admin can also manually generate receipts for cash/cheque payments.

**Why this priority**: Digital receipts eliminate manual receipt books, reduce errors, provide instant confirmation to parents, and create permanent audit trail. Essential for financial accountability and parent trust.

**Independent Test**: Can be fully tested by triggering receipt generation for various payment scenarios, verifying PDF content and format, delivery to mobile app, without requiring payroll or analytics dependencies.

**Acceptance Scenarios**:

1. **Given** online payment of ₹7,000 completed successfully, **When** payment confirmed, **Then** system auto-generates PDF receipt "RCP-2026-00123" with student name, fee breakdown (Tuition: ₹5,000, Transport: ₹1,500, Exam: ₹500), payment method "UPI", date "2026-02-11", school logo and seal
2. **Given** parent "Suresh Kumar" in mobile app, **When** receipt is generated, **Then** receipt appears in "Payments" section with "Download PDF" and "Share" buttons, and push notification sent
3. **Given** office staff receives cash payment ₹7,000 from parent, **When** they manually create receipt in web admin, **Then** system generates receipt with payment method "Cash", prints automatically if printer connected, and adds to fee ledger
4. **Given** bulk payments for 50 students on fee collection day, **When** office staff processes payments, **Then** system generates 50 receipts within 5 minutes and queues for parent app delivery
5. **Given** receipt number sequence "RCP-2026-00123", **When** next receipt generated, **Then** system auto-increments to "RCP-2026-00124" ensuring unique sequential numbering
6. **Given** generated receipt for "Q1 Term Fees", **When** parent downloads PDF, **Then** file size is under 500KB and contains complete payment details in Hindi and English

---

### User Story 4 - Staff Payroll Calculation (Priority: P4)

School administrators need to calculate monthly salaries for teaching and non-teaching staff based on base salary, attendance (working days vs leave days), performance bonuses, deductions (PF, TDS), and advance payments. System generates salary slips, tracks payment history, and provides payroll reports for accounting.

**Why this priority**: Automated payroll reduces administrative burden, ensures accurate salary calculations tied to attendance, and maintains financial compliance. While important, it's lower priority than student fee collection which is the primary revenue stream.

**Independent Test**: Can be fully tested by admin configuring staff salary structures, marking staff attendance, calculating monthly payroll, generating salary slips, viewing payment history, independent of fee or analytics features.

**Acceptance Scenarios**:

1. **Given** staff member "Mr. Singh" with base salary ₹40,000/month, 22 working days in February 2026, **When** admin calculates payroll and Mr. Singh has 20 days present and 2 days leave (without pay), **Then** system calculates salary: (₹40,000/22) × 20 = ₹36,363.64
2. **Given** staff with salary ₹50,000 and performance bonus ₹5,000 for February, **When** payroll calculated, **Then** system shows gross salary ₹55,000, deductions (PF: ₹6,000, TDS: ₹2,750), net salary ₹46,250
3. **Given** teacher who took ₹10,000 advance in January, **When** February payroll calculated, **Then** system auto-deducts ₹10,000 from net salary and marks advance as recovered
4. **Given** staff payroll for 50 employees, **When** admin triggers bulk salary calculation, **Then** system processes all 50 salary calculations within 2 minutes and generates individual salary slips
5. **Given** calculated payroll, **When** admin generates salary slip PDF for "Mr. Singh - February 2026", **Then** PDF contains: employee details, base salary, attendance days, allowances, deductions, net salary, and payment month
6. **Given** salary slip generated, **When** staff member logs into their portal, **Then** salary slip appears in "My Salary" section with download option, and shows payment history for last 12 months

---

### User Story 5 - Advanced Admin Analytics Dashboards (Priority: P5)

School administrators need comprehensive dashboards visualizing financial health (fee collection rate, pending fees by class, payment method breakdown), academic performance (average marks by subject, attendance trends), and operational metrics (daily active users, teacher workload). Dashboards refresh in real-time, support date range filtering, and export to PDF/Excel.

**Why this priority**: Analytics provide strategic insights for decision-making but are not blocking for day-to-day operations. Schools can function without dashboards initially, making this lowest priority for Phase 3.

**Independent Test**: Can be fully tested by viewing dashboards with various filters (date ranges, grade levels), verifying chart accuracy against database, testing export functionality, without live payment processing.

**Acceptance Scenarios**:

1. **Given** admin opens financial dashboard, **When** page loads for current month, **Then** system displays: total fee collected (₹25,00,000), pending fees (₹8,00,000), collection rate (75.76%), fee overdue by class (Grade 5: ₹1,20,000, Grade 10: ₹2,30,000)
2. **Given** financial dashboard showing payment method breakdown, **When** admin views chart, **Then** system displays pie chart: UPI (60%), Card (25%), Cash (12%), Cheque (3%)
3. **Given** academic performance dashboard, **When** admin selects "Q1 Exam 2026", **Then** system displays: average marks by subject (Math: 78, Science: 82, English: 85), pass rate (92%), top performers list
4. **Given** operational dashboard showing teacher activity, **When** admin views attendance marked metric, **Then** system shows daily trend: Feb 10 (450 classes), Feb 11 (478 classes), with peak time 9:00-9:30 AM
5. **Given** dashboard with date range filter, **When** admin selects "Last Quarter (Dec-Feb)", **Then** all metrics recalculate showing 3-month trends and comparisons
6. **Given** admin satisfied with dashboard insights, **When** they click "Export PDF", **Then** system generates PDF report with all charts, tables, and summary metrics within 15 seconds

---

### Edge Cases

- **What happens when parent attempts payment but gateway is down?** System should detect gateway unavailability, display "Payment service temporarily unavailable - please retry in 15 minutes", and log incident for admin notification
- **What happens when duplicate payment occurs (parent clicks twice)?** System should implement idempotency check - process only first transaction, reject second with "Already paid - Receipt: RCP-2026-00123"
- **What happens when fee structure changes mid-year after some students paid?** System should version fee structures, apply old structure to existing payments, new structure to future payments, alert admin of affected students
- **What happens when staff leaves mid-month?** System should allow pro-rated salary calculation based on working days (e.g., worked 15 out of 22 days) with exit date recorded
- **What happens when payment gateway takes 2 hours to confirm transaction?** System should implement webhook callback, keep transaction in "Pending" state, auto-reconcile when confirmation received, notify parent of status
- **What happens when generating 1000 salary slips simultaneously?** System should queue generation jobs, process in batches of 50, provide progress indicator "Generating 150/1000 slips"
- **What happens when parent requests refund for excess payment?** System should allow admin to initiate refund workflow, mark transaction as "Refund Initiated", integrate with payment gateway refund API, update ledger after refund processed
- **What happens when dashboard shows 0 data for new academic year?** System should display "No data available for selected period" with suggestions to adjust date range or confirm data collection is active
- **What happens when receipt PDF generation fails due to corrupted template?** System should log error, retry with default template, notify admin "Receipt generation error for RCP-2026-00123 - please verify"

## Requirements *(mandatory)*

### Functional Requirements

**Fee Structure:**
- **FR-001**: System MUST allow Admin to define fee categories with attributes: category name (Tuition, Transport, Exam, Lab, Library, Activity), amount, frequency (Monthly/Quarterly/Annual), mandatory/optional flag
- **FR-002**: System MUST support multiple fee structures per grade level and academic year
- **FR-003**: System MUST calculate automatic installments based on payment schedule (e.g., annual ₹84,000 → 12 monthly payments of ₹7,000)
- **FR-004**: System MUST configure late fee penalties with amount or percentage and grace period (e.g., ₹500 after 7 days overdue)
- **FR-005**: System MUST support discount rules: sibling discount, merit discount, early payment discount with percentage or flat amount
- **FR-006**: System MUST assign fee structure to individual students with customization (e.g., waive transport fee)
- **FR-007**: System MUST generate student fee ledger showing: total fees, paid amount, pending amount, due dates, payment history
- **FR-008**: System MUST automatically apply late fees to overdue payments based on configured rules
- **FR-009**: System MUST support fee structure versioning when changes occur mid-year

**Online Payments:**
- **FR-010**: System MUST integrate payment gateway supporting UPI (Google Pay, PhonePe, Paytm) and credit/debit cards
- **FR-011**: System MUST display pending fees to parents with breakdown by category and due dates
- **FR-012**: System MUST provide secure payment interface compliant with PCI DSS standards
- **FR-013**: System MUST process payment and return confirmation within 15 seconds for successful transactions
- **FR-014**: System MUST handle payment failures gracefully with user-friendly error messages and retry option
- **FR-015**: System MUST implement idempotency to prevent duplicate payments (check transaction ID)
- **FR-016**: System MUST support partial payments (e.g., pay ₹3,000 out of ₹7,000 due)
- **FR-017**: System MUST reconcile pending transactions via webhook callbacks from payment gateway
- **FR-018**: System MUST update fee ledger immediately upon successful payment
- **FR-019**: System MUST send push notification to parent upon payment confirmation within 30 seconds
- **FR-020**: System MUST maintain payment transaction log with gateway response, timestamp, status

**Digital Receipts:**
- **FR-021**: System MUST auto-generate PDF receipt upon payment confirmation with format: receipt number, date, student details, fee breakdown, amount, payment method, school branding
- **FR-022**: System MUST generate unique sequential receipt numbers with format "RCP-YYYY-NNNNN"
- **FR-023**: System MUST deliver generated receipt to parent mobile app within 60 seconds
- **FR-024**: System MUST allow manual receipt generation for cash/cheque payments by office staff
- **FR-025**: System MUST store all receipts permanently in student fee ledger with download option
- **FR-026**: System MUST support bulk receipt generation for multiple payments with queue processing
- **FR-027**: System MUST include bilingual content (Hindi and English) in receipts
- **FR-028**: System MUST optimize receipt PDF file size to under 500KB

**Staff Payroll:**
- **FR-029**: System MUST store staff salary structure with attributes: employee ID, base salary, allowances (HRA, DA), deductions (PF, TDS), payment frequency
- **FR-030**: System MUST calculate monthly salary based on attendance: (base salary / working days) × days present
- **FR-031**: System MUST apply performance bonuses, advance deductions, and other adjustments to gross salary
- **FR-032**: System MUST calculate statutory deductions (PF, TDS) based on configurable rules
- **FR-033**: System MUST generate salary slip PDF containing: employee details, salary breakdown, deductions, net salary, payment month
- **FR-034**: System MUST provide staff portal for viewing salary slips and payment history (last 24 months)
- **FR-035**: System MUST support bulk payroll processing for all staff in single operation
- **FR-036**: System MUST maintain payroll audit trail with calculation details and approval workflow
- **FR-037**: System MUST mark advance payments and auto-deduct from future salaries with recovery schedule

**Analytics Dashboards:**
- **FR-038**: System MUST provide financial dashboard showing: total fees collected, pending fees, collection rate, overdue amount by class, payment method breakdown
- **FR-039**: System MUST provide academic dashboard showing: average marks by subject/grade, pass rate, attendance trends, top performers
- **FR-040**: System MUST provide operational dashboard showing: daily active users, feature usage, teacher attendance marking rate, system health
- **FR-041**: System MUST refresh dashboard data in real-time or with configurable refresh interval (e.g., every 5 minutes)
- **FR-042**: System MUST support date range filtering on all dashboard metrics (today, this week, this month, this quarter, custom range)
- **FR-043**: System MUST visualize data using charts: line charts (trends), bar charts (comparisons), pie charts (breakdowns), tables (details)
- **FR-044**: System MUST export dashboard reports to PDF and Excel formats
- **FR-045**: System MUST show drill-down capability (e.g., click overdue fees → show student list)

**UI/UX & Architecture:**
- **FR-046**: Payment interface MUST be fully responsive and secure on mobile devices (parent primary payment method)
- **FR-047**: System MUST use modular component architecture extending Phase 1 & 2 component libraries
- **FR-048**: System MUST use JSON mock data for fee structures, payment transactions, and dashboard metrics during development
- **FR-049**: Fee structure configuration interface MUST adapt for tablet use by admin staff
- **FR-050**: Dashboard charts MUST be responsive, displaying compact view on mobile, full detail on desktop
- **FR-051**: System MUST maintain consistent styling across all financial UI following established design patterns
- **FR-052**: Payment gateway integration MUST use sandbox/test mode with mock responses initially

### Key Entities

- **FeeStructure**: Defines fee template with attributes: feeStructureID, academicYear, gradeLevel, category (Tuition/Transport/Exam/Lab), amount, frequency (Monthly/Quarterly/Annual), isMandatory, lateFeeRule, effectiveDate. Relationships: applied to many Students
- **FeeCategory**: Types of fees with attributes: categoryID, name, description, defaultAmount, accountingCode. Relationships: used in FeeStructures
- **StudentFeeLedger**: Financial record per student with attributes: ledgerID, studentID, feeStructureID, totalFees, paidAmount, pendingAmount, overdueAmount, lastPaymentDate, dueDate. Relationships: belongs to one Student, has many Transactions
- **PaymentTransaction**: Records payment with attributes: transactionID, studentID, amount, paymentMethod (UPI/Card/Cash/Cheque), gatewayTransactionID, status (Success/Failed/Pending/Refunded), timestamp, receiptID. Relationships: belongs to one Student, generates one Receipt
- **Receipt**: Payment proof with attributes: receiptNumber, transactionID, studentID, amount, feeBreakdown (JSON), paymentMethod, issuedDate, pdfURL, generatedByUserID. Relationships: belongs to one Transaction
- **PaymentGateway**: Integration details with attributes: gatewayID, provider (Razorpay/Paytm/etc), apiKey, webhookURL, isActive, transactionFees. Used for payment processing
- **StaffSalary**: Employee compensation with attributes: salaryID, employeeID, baseSalary, allowances (HRA, DA, TA), deductions (PF, TDS, LoanRecovery), paymentFrequency, effectiveDate, status (Active/Frozen). Relationships: belongs to one User (staff)
- **PayrollRecord**: Monthly payroll with attributes: payrollID, employeeID, month, year, workingDays, presentDays, leaveDays, grossSalary, totalDeductions, netSalary, paymentDate, salarySlipURL, status (Calculated/Paid/On-Hold). Relationships: belongs to one Staff member
- **AdvancePayment**: Salary advance with attributes: advanceID, employeeID, amount, issueDate, recoverySchedule (JSON), balanceAmount, status (Pending/Recovering/Recovered). Relationships: belongs to one Staff, affects future Payroll
- **DashboardMetric**: Stores calculated metrics with attributes: metricID, metricType (Financial/Academic/Operational), metricName, value, calculatedAt, dateRange, filters (JSON). Used for dashboard caching

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can create complete fee structure for a grade level in under 5 minutes
- **SC-002**: Parents can complete online fee payment from start to confirmation in under 2 minutes
- **SC-003**: System handles 200 concurrent fee payments during peak collection period without degradation
- **SC-004**: 95% of online payments complete successfully within 15 seconds
- **SC-005**: Payment success rate is above 98% excluding user errors (insufficient balance, wrong CVV)
- **SC-006**: Digital receipts are delivered to parent mobile app within 60 seconds of payment confirmation
- **SC-007**: Receipt PDF generation completes in under 5 seconds per receipt
- **SC-008**: Fee overdue cases reduce by 50% within 3 months of online payment launch (measured against baseline)
- **SC-009**: 80% of fee payments occur online (vs cash/cheque) within 6 months of launch
- **SC-010**: Payroll calculation for 50 staff members completes within 2 minutes
- **SC-011**: Salary slip generation accuracy is 100% (verified against manual calculation sample)
- **SC-012**: Staff report high satisfaction (4+ out of 5) with digital salary slips and payment history access
- **SC-013**: Financial dashboard loads within 3 seconds with current month data
- **SC-014**: Dashboard data refresh occurs within 30 seconds of underlying data changes
- **SC-015**: Admin uses dashboards for monthly reporting, reducing report preparation time by 60%
- **SC-016**: Zero financial errors or discrepancies in fee ledger reconciliation
- **SC-017**: Payment gateway integration maintains 99.9% uptime during school operational hours
- **SC-018**: All payment transactions are logged and auditable for accounting compliance
- **SC-019**: Payment interface is mobile-optimized with 95% of parents successfully completing payment on first attempt via mobile
- **SC-020**: Dashboard is fully responsive displaying summary cards on mobile, detailed charts on desktop
- **SC-021**: All financial features maintain responsive design across mobile (375px+), tablet (768px+), desktop (1024px+)

## Assumptions

- Phase 1 (Authentication, Students) and Phase 2 (Academic features) are fully operational
- School has bank account and merchant agreements with payment gateway provider (integration in future sprint)
- Payment gateway API credentials (API keys, webhook URLs) will be configured; using sandbox mode initially
- School complies with financial regulations for digital payments and data privacy
- Staff attendance records are maintained daily for payroll calculation
- School has defined grading policy for performance bonuses (if applicable)
- Internet connectivity is reliable for payment processing
- Parents have smartphones with UPI apps or credit/debit cards for online payment
- School accounting team can reconcile digital payments with bank statements
- Tax regulations (PF, TDS rates) are configured per local government requirements
- Hindi translations for financial terms are available
- Storage infrastructure can handle receipt and salary slip PDFs (estimate 10GB/year)
- Mock payment data includes various transaction scenarios (success, failure, pending) for testing
- UI component library from Phase 1 & 2 provides foundation for financial module interfaces

## Dependencies

- Phase 1: Student database, parent mobile app for payment interface
- Phase 2: Academic data for performance dashboards
- Payment gateway integration: Razorpay, Paytm, or similar provider
- Backend payment processing APIs with secure transaction handling
- PDF generation service for receipts and salary slips
- S3 or similar storage for financial documents
- Background job processing for bulk operations (receipts, payroll, reports)
- Webhook infrastructure for payment confirmation callbacks
- Staff attendance tracking system (may be Phase 1 extension)
- Dashboard charting library integrated in React web app
- Export functionality for PDF and Excel report generation
- Mobile app payment UI screens and receipt viewing interface

## Out of Scope (for Phase 3)

- Inventory and asset management
- Library book management and tracking
- Transport and bus tracking system
- Hostel management (if applicable)
- Alumni management and alumni fee collection
- Grant and scholarship management
- Multi-currency support (assuming single currency INR)
- Integration with external accounting software (Tally, QuickBooks)
- Student loan management
- Insurance claim processing
- Cafeteria billing and meal management
- Event ticketing and fee collection
- Donation and fundraising module
- Investment and endowment tracking
