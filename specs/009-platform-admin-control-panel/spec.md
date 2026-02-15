# Feature Specification: Platform Admin Control Panel

**Feature Branch**: `009-platform-admin-control-panel`
**Created**: 2026-02-15
**Status**: Draft
**Input**: User description: "Need an internal admin panel for our team to add schools, import students from Excel/CSV/other files, and manage subscriptions. This panel should let our team manage everything, with full backend support."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Onboard and Configure a New School (Priority: P1)

Platform operations team needs to create a school tenant, configure core profile data, create an initial admin account, and activate baseline modules in one guided flow.

**Why this priority**: Without reliable onboarding, no school can start using the product. This is the entry point for all revenue and downstream workflows.

**Independent Test**: Create a new school from the panel, complete configuration, and verify the school admin can log in and access only that school's data.

**Acceptance Scenarios**:
1. **Given** a Platform Ops user with `SCHOOL_CREATE` permission, **When** they submit school details and admin contact, **Then** the system creates a new tenant, school profile, and bootstrap admin user.
2. **Given** a newly created school, **When** Platform Ops sets timezone, academic year format, and enabled modules, **Then** the school instance reflects these defaults immediately.
3. **Given** a duplicate school registration number or duplicate primary admin email, **When** creation is attempted, **Then** the system blocks creation with actionable validation errors.
4. **Given** a school is moved to `SUSPENDED` status for policy violation, **When** school users attempt login, **Then** authentication is denied and a suspension reason is recorded.

---

### User Story 2 - Import Students from Excel/CSV with Validation and Preview (Priority: P1)

Platform or school onboarding team needs to bulk import students from Excel/CSV files, map source columns to system fields, detect data issues before commit, and generate an import report.

**Why this priority**: Manual entry is too slow for school onboarding. Bulk import directly impacts activation time and implementation cost.

**Independent Test**: Upload a 5,000-row Excel file, map columns, preview validation output, import valid rows, and download row-level error report for failed records.

**Acceptance Scenarios**:
1. **Given** an import file with valid headers, **When** user uploads and maps fields, **Then** system shows preview with row counts (`valid`, `invalid`, `duplicate`, `warning`).
2. **Given** file contains duplicate admission numbers within the same school, **When** preview runs, **Then** duplicates are flagged and excluded unless user selects explicit override policy.
3. **Given** partial row failures during commit, **When** import completes, **Then** successful rows are persisted and failed rows are available in downloadable error report.
4. **Given** import job execution takes longer than 10 seconds, **When** user leaves the page, **Then** job continues asynchronously and completion status is visible in Import History.
5. **Given** user uploads `.xlsx` and `.csv`, **When** parser runs, **Then** both formats are supported with UTF-8 handling and date normalization.

---

### User Story 3 - Manage Subscription Lifecycle per School (Priority: P1)

Finance/Ops team needs to assign plans, configure pricing, issue invoices, record payments, apply grace periods, and enforce access controls based on subscription state.

**Why this priority**: Subscription lifecycle governs revenue recognition and access policy for every tenant.

**Independent Test**: Create a plan, assign it to a school, mark invoice overdue, and verify feature access enforcement and renewal workflows.

**Acceptance Scenarios**:
1. **Given** a school on trial, **When** trial end date is reached, **Then** system transitions status to `PAYMENT_DUE` and triggers notifications.
2. **Given** a paid invoice is recorded, **When** payment reconciliation succeeds, **Then** subscription status changes to `ACTIVE` and entitlements are updated.
3. **Given** payment is overdue beyond grace period, **When** daily billing job runs, **Then** school is moved to `RESTRICTED` state with configurable module locks.
4. **Given** a school upgrades from Basic to Premium mid-cycle, **When** upgrade is confirmed, **Then** prorated adjustment entry is created and entitlements update immediately.

---

### User Story 4 - Internal Support and Operational Actions (Priority: P2)

Support team needs a secure internal workspace to impersonate sessions (audited), unlock accounts, retry failed jobs, and resolve onboarding/import failures quickly.

**Why this priority**: Reduces MTTR for customer issues and avoids direct database operations for day-to-day support.

**Independent Test**: Perform account unlock and import retry from support tools; verify all actions are audited and reversible where applicable.

**Acceptance Scenarios**:
1. **Given** a failed import due to schema mismatch, **When** Support Ops retries with corrected mapping, **Then** system creates a new run and links it to original import job.
2. **Given** a school admin account is locked, **When** Support Ops performs unlock, **Then** account lock is removed and audit event contains actor, reason, and timestamp.
3. **Given** impersonation is enabled for debugging, **When** Support user impersonates a school admin, **Then** session banner is shown and all actions are tagged as impersonated.

---

### User Story 5 - Compliance, Audit, and Reporting for Platform Actions (Priority: P2)

Leadership and compliance stakeholders need immutable logs and operational reports for who changed what, when, and why across school onboarding, imports, and subscription operations.

**Why this priority**: Internal panel has high-privilege operations; auditability is mandatory for trust and legal defensibility.

**Independent Test**: Execute school creation, subscription update, and import run; verify complete audit trail and exportable operations report.

**Acceptance Scenarios**:
1. **Given** any privileged action is executed, **When** action succeeds or fails, **Then** an immutable audit log is stored with actor, action type, target entity, diff payload, source IP, and request ID.
2. **Given** Finance Ops requests monthly reconciliation report, **When** report is generated, **Then** it includes invoices issued, paid, overdue, credits, and revenue summary by plan.
3. **Given** audit export is requested for a date range, **When** export completes, **Then** CSV download is available with traceable event IDs.

---

### Edge Cases

- Import file has mixed date formats (`DD/MM/YYYY`, `YYYY-MM-DD`, Excel serial dates): system must normalize or flag row-level errors.
- Large file upload (`>50MB` or `>100k` rows): system must reject with limit guidance or route through chunked asynchronous import pathway.
- Same school imported twice by concurrent users: system must enforce idempotency key and conflict handling.
- School deletion requested with active students and financial data: hard delete must be blocked; only archival/disabled states allowed.
- Billing webhook arrives out of order (success then failure): final status must be resolved using gateway event ordering and idempotent reconciliation.
- Import includes students that already exist with different parent mobile: apply configurable merge policy (`skip`, `update`, `manual_review`).
- Platform admin accidentally changes subscription plan: support rollback window and reason capture for plan changes.

## Requirements *(mandatory)*

### Functional Requirements

**Platform Access and RBAC:**
- **FR-001**: System MUST provide a dedicated internal admin panel for platform team users only.
- **FR-002**: System MUST implement platform-level RBAC with roles at minimum: `PlatformOwner`, `PlatformOps`, `FinanceOps`, `SupportOps`, `ReadOnlyAuditor`.
- **FR-003**: System MUST enforce least-privilege permissions on every backend endpoint and UI action.
- **FR-004**: System MUST support optional step-up authentication (OTP/re-auth) for high-risk actions (impersonation, suspension, plan downgrade).

**School Lifecycle Management:**
- **FR-005**: System MUST create school tenant with unique identifiers (`tenantCode`, `schoolCode`) and immutable creation metadata.
- **FR-006**: System MUST capture school profile fields: legal name, display name, registration number, board, address, timezone, contact owner, max student capacity, enabled modules.
- **FR-007**: System MUST create/bootstrap first school admin account during onboarding.
- **FR-008**: System MUST support school lifecycle states: `DRAFT`, `ACTIVE`, `PAYMENT_DUE`, `RESTRICTED`, `SUSPENDED`, `ARCHIVED`.
- **FR-009**: System MUST allow state transitions only through defined transition rules and required reason codes.

**Student Bulk Import:**
- **FR-010**: System MUST support upload of `.csv` and `.xlsx` files for student import.
- **FR-011**: System MUST provide downloadable import template with mandatory and optional fields.
- **FR-012**: System MUST support column mapping UI and save reusable mapping profiles per school/source.
- **FR-013**: System MUST validate required fields (name, class, admission number, guardian contact, DOB format) before commit.
- **FR-014**: System MUST detect duplicates against existing school data using admission number and configured secondary keys.
- **FR-015**: System MUST run imports asynchronously via job queue and expose job status (`QUEUED`, `PROCESSING`, `COMPLETED`, `PARTIAL_SUCCESS`, `FAILED`).
- **FR-016**: System MUST persist row-level import outcomes and allow downloadable error report.
- **FR-017**: System MUST support configurable conflict policy per import (`skip`, `update`, `manual_review`).
- **FR-018**: System MUST provide idempotency support to avoid duplicate imports from repeated submissions.

**Subscription and Billing Operations:**
- **FR-019**: System MUST manage plan catalog with price, billing cycle, student limits, and module entitlements.
- **FR-020**: System MUST assign/change school subscription with effective dates and proration support.
- **FR-021**: System MUST generate invoices and track invoice states (`DRAFT`, `ISSUED`, `PAID`, `PARTIALLY_PAID`, `OVERDUE`, `VOID`).
- **FR-022**: System MUST capture manual and gateway payment records with reconciliation references.
- **FR-023**: System MUST apply grace-period policy and automatic access restriction based on overdue threshold.
- **FR-024**: System MUST provide subscription history timeline including plan changes, discounts, credits, and reason notes.

**Support Operations:**
- **FR-025**: System MUST allow support actions: account unlock, password reset trigger, import retry, webhook replay, and school status override (permission-gated).
- **FR-026**: System MUST support scoped impersonation with explicit start/end and visible session indicator.
- **FR-027**: System MUST require reason text for all high-impact support actions.

**Audit, Compliance, and Reporting:**
- **FR-028**: System MUST write immutable audit logs for all privileged operations (success and failure paths).
- **FR-029**: System MUST include correlation/request IDs for traceability across API, jobs, and logs.
- **FR-030**: System MUST provide operational reports: onboarding funnel, import success ratio, active schools by plan, MRR, overdue risk list.
- **FR-031**: System MUST retain audit and billing records for a configurable compliance window (default 7 years).

### Non-Functional Requirements

- **NFR-001**: Tenant data isolation MUST be enforced at query and service layers; cross-tenant reads are forbidden unless explicit platform scope is authorized.
- **NFR-002**: Import preview for up to 10,000 rows SHOULD complete within 15 seconds.
- **NFR-003**: Commit import throughput SHOULD support at least 2,000 rows/minute per worker under nominal load.
- **NFR-004**: Internal admin APIs SHOULD achieve p95 latency under 500ms for non-bulk operations.
- **NFR-005**: All privileged actions MUST be fully auditable and tamper-evident.
- **NFR-006**: System MUST support horizontal scaling for import workers and billing jobs.

### Key Entities

- **PlatformUser**: Internal team user with platform role(s), authentication factors, status, and scoped permissions.
- **Tenant**: Top-level container for school data isolation with tenant identifiers and lifecycle status.
- **School**: Business profile linked to tenant; contains legal/operational metadata and module settings.
- **SchoolAdminBootstrap**: Initial admin user account created during onboarding.
- **ImportTemplate**: Versioned schema template describing allowed fields and validation rules.
- **ImportJob**: Asynchronous import request with file metadata, mapping profile, conflict policy, status, and summary counters.
- **ImportRowResult**: Row-level validation/persistence outcome with error codes and normalized payload.
- **SubscriptionPlan**: Commercial plan definition including billing cycle, limits, and entitlements.
- **SchoolSubscription**: School-plan assignment with status timeline, effective dates, and proration data.
- **Invoice**: Billing document with amount, tax, due date, and payment status.
- **PaymentRecord**: Recorded payment transaction from gateway or manual source.
- **AuditEvent**: Immutable log event capturing actor, action, target, before/after diff, reason, and trace metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: New school onboarding (create + bootstrap admin) completes in under 10 minutes by ops user.
- **SC-002**: At least 95% of valid rows import successfully in first run for standardized template files.
- **SC-003**: Import failure report is available within 60 seconds of job completion for files up to 10,000 rows.
- **SC-004**: Subscription status transitions are reflected in access control within 2 minutes of billing update.
- **SC-005**: 100% of privileged actions are present in audit logs with actor and reason metadata.
- **SC-006**: Support MTTR for onboarding/import incidents is reduced by at least 40% after panel launch.
- **SC-007**: Manual database interventions for onboarding/import/billing are reduced by at least 80%.

## Assumptions

- Existing backend stack can support new modules for tenancy, import jobs, and billing orchestration.
- Payment gateway integration for subscription billing is available or can be staged with manual payment mode first.
- Existing student schema can be extended for robust dedupe keys and import metadata.
- Internal team users will use SSO or secure password+OTP flows managed by platform auth.
- School-level RBAC remains separate from platform-level RBAC.

## Dependencies

- Backend: tenant-aware data access layer and migration support.
- Background processing: queue/worker infrastructure for import and billing tasks.
- File processing: CSV/XLSX parsing library with streaming support.
- Storage: secure file/object storage for original import files and reports.
- Notification service: email/SMS/WhatsApp hooks for billing and status alerts.
- Analytics/reporting layer for operational and finance dashboards.

## Out of Scope (Initial Release)

- Full CRM pipeline for sales lead management.
- Automated GST filing or accounting software sync.
- Self-serve public school signup portal.
- Multi-currency invoicing.
- Deep marketing automation.
