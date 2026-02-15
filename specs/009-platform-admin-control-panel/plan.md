# Implementation Plan: Platform Admin Control Panel

**Branch**: `009-platform-admin-control-panel` | **Date**: 2026-02-15 | **Status**: Draft | **Spec**: [specs/009-platform-admin-control-panel/spec.md](spec.md)
**Input**: Feature specification from `specs/009-platform-admin-control-panel/spec.md`

## Summary

Build an internal control panel for the platform team to manage school onboarding, student bulk imports, and subscription lifecycle end-to-end. Implement required backend modules for tenancy, async import processing, billing state enforcement, and immutable auditing.

## Current State and Gaps

### Already Available
- Student bulk import endpoint exists for school-level data (`/api/academics/students/bulk-import`).
- School operations and finance modules exist for school users.
- Auth and role checks exist but are designed around school-facing roles.

### Gaps to Close
- No dedicated platform/internal admin role model.
- No tenant/school lifecycle management APIs for internal ops.
- No robust import orchestration with preview, reusable mapping profiles, and row-level retry/reporting.
- No subscription lifecycle engine tied to access restriction policies.
- No centralized support tooling (impersonation, webhook replay, account unlock) with strict audit controls.

## Technical Context

**Primary Stack**: Spring Boot backend (`sanchalak_be`), React/TypeScript admin frontend (`sanchalan`)  
**Storage**: PostgreSQL for transactional data, object storage for import files/reports  
**Async Processing**: Queue + worker model (Redis queue/SQS equivalent)  
**AuthN/AuthZ**: JWT with platform-scoped claims + step-up auth for high-risk actions  
**Observability**: Structured logs, metrics, traces, immutable audit events  
**Scale Target**:
- 1,000+ schools
- 100k+ student records imported/day
- 10k+ billing events/month

## Constitution Check

- [x] **Security**: Platform RBAC + reason-required privileged actions + immutable audit.
- [x] **Components**: Feature modules split by domain (`schools`, `imports`, `subscriptions`, `support`, `audit`).
- [x] **Type Safety**: Typed request/response contracts and shared DTO definitions.
- [x] **Backend Integration**: Explicit API contracts and queue-backed bulk operations.
- [x] **Performance**: Async import, pagination, cursor-based listings for high-volume screens.
- [x] **UX/i18n**: Internal panel labels and action feedback prepared for localization.
- [x] **Complexity**: Multi-tenant safeguards justified due to platform-admin scope.

## Architecture Plan

### Backend Domains
1. `platform-auth`: platform users, roles, step-up challenge events.
2. `tenant-school`: tenant and school lifecycle state machine.
3. `import-orchestrator`: upload parsing, validation preview, commit workers, reporting.
4. `billing-subscription`: plan catalog, school subscriptions, invoices, payments, enforcement.
5. `support-ops`: impersonation sessions, action tooling, incident-safe overrides.
6. `audit-compliance`: append-only event storage and audit export service.

### Data Isolation Strategy
- Every school-facing table includes `tenant_id`.
- Service layer enforces tenant scopes by default.
- Platform scope requires explicit permission and logs actor + reason.
- Cross-tenant queries require dedicated repository methods with audit tags.

### Import Processing Strategy
- Phase 1 parse and validate synchronously for preview (row cap enforced).
- Phase 2 commit asynchronously as a queued job.
- Use chunked processing (e.g., 500 rows/batch) and transactional per-chunk writes.
- Write `ImportRowResult` for every row with normalization + error codes.

### Subscription Enforcement Strategy
- Daily scheduler evaluates `trial_end`, `invoice_due`, `grace_end`.
- State transitions trigger entitlement updates and notifications.
- Enforcement applies module-level restrictions instead of immediate hard lock by default.

## Proposed API Contracts (Backend)

### Platform Auth and Session
- `POST /api/platform/v1/auth/login`
- `POST /api/platform/v1/auth/step-up/request`
- `POST /api/platform/v1/auth/step-up/verify`
- `POST /api/platform/v1/auth/logout`

### School Management
- `POST /api/platform/v1/schools`
- `GET /api/platform/v1/schools`
- `GET /api/platform/v1/schools/{schoolId}`
- `PATCH /api/platform/v1/schools/{schoolId}`
- `POST /api/platform/v1/schools/{schoolId}/status-transition`
- `POST /api/platform/v1/schools/{schoolId}/bootstrap-admin/reset`

### Bulk Import
- `POST /api/platform/v1/schools/{schoolId}/imports/students/upload`
- `POST /api/platform/v1/schools/{schoolId}/imports/students/preview`
- `POST /api/platform/v1/schools/{schoolId}/imports/students/commit`
- `GET /api/platform/v1/schools/{schoolId}/imports/students/jobs`
- `GET /api/platform/v1/import-jobs/{jobId}`
- `GET /api/platform/v1/import-jobs/{jobId}/errors/export`
- `POST /api/platform/v1/import-jobs/{jobId}/retry`

### Subscription and Billing
- `POST /api/platform/v1/subscription-plans`
- `GET /api/platform/v1/subscription-plans`
- `PATCH /api/platform/v1/subscription-plans/{planId}`
- `POST /api/platform/v1/schools/{schoolId}/subscriptions/assign`
- `POST /api/platform/v1/schools/{schoolId}/subscriptions/change`
- `GET /api/platform/v1/schools/{schoolId}/subscriptions/history`
- `POST /api/platform/v1/invoices`
- `GET /api/platform/v1/invoices`
- `POST /api/platform/v1/invoices/{invoiceId}/payments`
- `POST /api/platform/v1/webhooks/payments/reconcile`

### Support and Audit
- `POST /api/platform/v1/support/impersonation/start`
- `POST /api/platform/v1/support/impersonation/end`
- `POST /api/platform/v1/support/accounts/{userId}/unlock`
- `POST /api/platform/v1/support/webhooks/{eventId}/replay`
- `GET /api/platform/v1/audit-events`
- `POST /api/platform/v1/audit-events/export`

## Data Model Additions (Backend)

### New Tables
- `platform_users`
- `platform_roles`
- `platform_role_permissions`
- `tenants`
- `schools`
- `school_status_history`
- `import_templates`
- `import_jobs`
- `import_row_results`
- `subscription_plans`
- `school_subscriptions`
- `invoices`
- `invoice_payments`
- `support_actions`
- `impersonation_sessions`
- `audit_events` (append-only)

### Key Constraints
- Unique: `tenants.tenant_code`, `schools.school_code`, `schools.registration_number`.
- Unique (per school): student admission number and external student key.
- Foreign keys with soft-delete-safe references for audit retention.
- Check constraints for valid status transitions and billing states.

## Frontend (Internal Panel) Plan

### Feature Modules
- `src/features/platform/schools`
- `src/features/platform/imports`
- `src/features/platform/subscriptions`
- `src/features/platform/support`
- `src/features/platform/audit`

### UI Screens
- School list and onboarding wizard
- School detail with status timeline
- Student import center (upload, mapping, preview, commit, history)
- Plan catalog and school subscription workspace
- Invoice and payment reconciliation views
- Support tools (account actions, job retry, impersonation sessions)
- Audit explorer with filters/export

### UI and API Integration
- Add dedicated `platformApiClient` with stricter timeout/retry policies.
- Use optimistic updates only for non-critical metadata; billing and status transitions remain server-confirmed.
- Show irreversible action confirmations and mandatory reason capture modals.

## Phased Delivery Plan

### Phase 0 - Foundations (1 sprint)
- Define platform RBAC model and permission matrix.
- Add tenant and school schema migrations.
- Create base platform auth endpoints.
- Establish audit-event write utility and middleware.

### Phase 1 - School Lifecycle and Core Panel (1 sprint)
- Implement school CRUD + lifecycle transitions.
- Build onboarding wizard UI and school list/detail screens.
- Add bootstrap admin flow and notification hooks.

### Phase 2 - Student Import System (1-2 sprints)
- Implement upload, parse, mapping, preview APIs.
- Implement queue workers, commit pipeline, row-level reporting.
- Build import center UI and import history tracking.
- Add idempotency and retry controls.

### Phase 3 - Subscription and Billing (1-2 sprints)
- Implement plan catalog and school subscription assignment/change.
- Build invoice generation and payment recording/reconciliation.
- Add enforcement scheduler for `PAYMENT_DUE` -> `RESTRICTED` transitions.
- Build subscriptions + invoice UI workflows.

### Phase 4 - Support Ops and Compliance (1 sprint)
- Implement impersonation, account unlock, webhook replay endpoints.
- Build support actions console with reason capture.
- Build audit explorer + export and compliance reports.

### Phase 5 - Hardening and Rollout (1 sprint)
- Load/performance tests for import + billing jobs.
- Security testing (permission bypass, tenant escape, audit integrity).
- UAT with internal ops/finance/support teams.
- Progressive rollout (internal -> pilot schools -> all schools).

## Testing Strategy

### Backend Tests
- Unit tests: state transitions, import validators, billing calculators, permission guards.
- Integration tests: onboarding flow, import preview/commit, invoice lifecycle, webhook idempotency.
- Contract tests: platform API schemas shared with frontend client.
- Security tests: cross-tenant access attempts, role escalation checks, impersonation misuse cases.

### Frontend Tests
- Component tests: mapping UI, status transitions, billing forms, confirmation/reason modals.
- Integration tests: end-to-end onboarding/import/subscription flows against mocked API.
- Accessibility checks: keyboard access for critical controls and modal flows.

### Performance and Reliability Tests
- Import load test: 10 concurrent jobs x 10k rows.
- Billing scheduler simulation with 5k invoices.
- Queue resilience tests with worker restarts and retry backoff.

## Rollout and Migration Plan

1. Deploy schema migrations and platform RBAC in disabled mode.
2. Enable school lifecycle module for internal pilot users.
3. Enable import module for selected onboarding projects.
4. Enable billing enforcement in `observe-only` mode for one cycle.
5. Switch to active enforcement after finance sign-off.
6. Enable support and audit modules globally.

## Risks and Mitigations

- **Risk**: Incorrect subscription enforcement disrupts school operations.
  - **Mitigation**: `observe-only` mode and manual override for first cycle.
- **Risk**: Import quality issues cause data corruption.
  - **Mitigation**: strict preview, dry-run mode, row-level rollback boundaries, idempotency keys.
- **Risk**: Platform-level access creates elevated security exposure.
  - **Mitigation**: step-up auth, just-in-time permissions, immutable audit, anomaly alerts.
- **Risk**: Billing reconciliation mismatch with gateway events.
  - **Mitigation**: webhook idempotency, replay endpoint, periodic reconciliation job.

## Open Questions

- Should subscription billing remain manual-first for v1 or include payment gateway automation on day one?
- Which document format standards are mandatory for invoices/credit notes in target regions?
- Do we need parent/teacher/staff bulk import in the same release or student-only first?

## Definition of Done

- Platform team can onboard schools, import students, and manage subscriptions end-to-end without direct DB edits.
- All privileged actions require permissions, capture reason, and emit immutable audit events.
- Import and billing modules meet agreed performance SLOs.
- Pilot rollout succeeds with no P0/P1 incidents for one full billing cycle.
