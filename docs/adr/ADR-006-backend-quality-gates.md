# ADR-006 — Backend Automated Quality Gates

## Status

Accepted

## Date

2026-04-30

---

## Context

The backend reached a stage where critical financial flows already exist, but the repository had no automated backend test suite, no CI workflow, and no reproducible operational baseline for test execution.

This created several risks:

- authentication and ownership regressions could ship unnoticed
- month finalization, recurring generation, installment materialization, and budget validations were not protected by automated checks
- new features or bug fixes could alter domain behavior without any enforceable quality gate
- contributors had no standard, documented path to validate backend behavior locally or in CI

Because the application manages personal financial data, the minimum acceptable backend quality bar must include automated validation of critical flows.

---

## Decision

The project adopts the following backend quality baseline:

1. The backend uses `Vitest` for automated tests.
2. HTTP and behavior-critical backend flows are covered with integration tests using `Supertest` against the real Express app.
3. Backend tests run against a dedicated PostgreSQL test database.
4. Local test execution is supported through a dedicated Docker Compose file for the test database.
5. GitHub Actions is the default CI system for backend quality validation.
6. Every backend feature, backend bug fix, or behavior-changing backend refactor must include or update automated tests for the affected behavior.

The initial mandatory coverage set is:

- authentication and session flow
- cross-user isolation
- month finalization behavior
- recurring income behavior
- recurring expense behavior
- installment group behavior
- budget allocation constraints

---

## Rationale

- **Protect domain rules**: critical financial behavior lives in services and must be exercised with realistic repository and database interactions.
- **Reduce false confidence**: integration tests against the actual HTTP app and PostgreSQL provide stronger confidence than mock-only unit tests for this codebase.
- **Keep scope controlled**: the first step focuses on the highest-risk flows rather than broad but shallow coverage.
- **Standardize delivery**: local Docker-based test setup and GitHub Actions create a repeatable validation path.

---

## Consequences

- backend contributors must treat tests as part of the change, not as optional follow-up work
- CI becomes a required checkpoint for backend readiness
- local development now requires a dedicated test database when running backend tests
- operational documentation must remain synchronized with test, CI, and container setup changes

---

## Related Documents

- docs/architecture/backend-architecture.md
- docs/architecture/project-structure.md
- docs/ai/backend-development-workflow.md
- backend/README.md