# Tasks: Platform Admin Control Panel

**Input**: `specs/009-platform-admin-control-panel/spec.md`, `specs/009-platform-admin-control-panel/plan.md`
**Date**: 2026-02-15

## Phase 0 - Foundations

- [ ] Create platform RBAC matrix and permission constants.
- [ ] Implement `platform_users`, `platform_roles`, `platform_role_permissions` migrations.
- [ ] Implement platform auth endpoints and JWT claims for platform scope.
- [ ] Add middleware for correlation IDs and privileged-action reason capture.
- [ ] Add append-only `audit_events` write service and retention policy.

## Phase 1 - School Lifecycle

- [ ] Implement `tenants`, `schools`, `school_status_history` migrations.
- [ ] Implement school creation API with bootstrap admin generation.
- [ ] Implement school status transition API with rule validation.
- [ ] Build internal panel screens: school list, school detail, onboarding wizard.
- [ ] Add integration tests for onboarding and status transitions.

## Phase 2 - Student Import

- [ ] Implement object storage upload flow for import files.
- [ ] Implement parser service for CSV/XLSX with schema normalization.
- [ ] Implement preview API with validation and duplicate detection.
- [ ] Implement import job queue and chunked commit workers.
- [ ] Implement `import_jobs` and `import_row_results` persistence.
- [ ] Implement import error export endpoint.
- [ ] Build import center UI (upload, mapping, preview, commit, history).
- [ ] Add retry and idempotency controls for import jobs.
- [ ] Add performance tests for high-volume imports.

## Phase 3 - Subscription and Billing

- [ ] Implement `subscription_plans`, `school_subscriptions`, `invoices`, `invoice_payments` migrations.
- [ ] Implement plan catalog APIs.
- [ ] Implement school subscription assign/change APIs with proration.
- [ ] Implement invoice generation and payment record APIs.
- [ ] Implement billing scheduler for overdue/grace enforcement.
- [ ] Build panel screens: plan catalog, school subscription workspace, invoice list/detail.
- [ ] Add reconciliation and idempotency tests for payment webhook processing.

## Phase 4 - Support and Compliance

- [ ] Implement support action APIs (account unlock, job retry, webhook replay).
- [ ] Implement impersonation lifecycle endpoints with hard timeout.
- [ ] Implement `support_actions` and `impersonation_sessions` persistence.
- [ ] Build support console UI with mandatory reason prompts.
- [ ] Build audit explorer UI with filters and CSV export.
- [ ] Add security tests for impersonation and privilege escalation abuse.

## Phase 5 - Hardening and Rollout

- [ ] Run load tests for import workers and billing jobs.
- [ ] Run permission boundary and tenant-isolation penetration tests.
- [ ] Validate observability dashboards and alerting thresholds.
- [ ] Enable pilot rollout for internal ops and selected schools.
- [ ] Collect pilot feedback and fix issues before GA.
- [ ] Publish runbooks for onboarding, import recovery, and billing incident handling.

## Exit Criteria

- [ ] No manual DB intervention required for onboarding/import/subscription operations.
- [ ] 100% privileged actions captured in audit events with actor and reason.
- [ ] Import success and billing enforcement metrics meet defined success criteria.
- [ ] Pilot completes one full billing cycle with no unresolved critical defects.
