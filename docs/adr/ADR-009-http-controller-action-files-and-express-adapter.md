# ADR-009 — Pure HTTP Controllers Per Action and Central Express Adapter

## Status

Accepted

## Date

2026-05-30

---

## Context

The backend already had an explicit `interfaces/http` boundary, but the controller implementation still carried legacy coupling:

- grouped controller files per resource
- direct imports of Express request/response types
- local `try/catch` blocks inside controller actions
- duplicated status-code handling spread across controller methods

That made the HTTP layer harder to test, harder to reason about, and inconsistent with the architectural direction established by the application layer refactor.

## Decision

The backend adopts the following HTTP boundary rules:

1. Each HTTP action lives in its own controller file under `src/interfaces/http/controllers/<resource>/<action>.controller.ts`.
2. Controller actions are pure HTTP boundary functions and do not import Express types.
3. Express adaptation is centralized in `src/interfaces/http/express-route.adapter.ts`.
4. The centralized `error-handler` middleware remains the final serializer of HTTP errors.
5. Action-specific fallback status normalization may happen in the Express adapter while legacy services still throw plain `Error` values.
6. Legacy `src/controllers/*.ts` modules remain only as compatibility re-export surfaces during the transition.

## Rationale

- one action per file improves discoverability and responsibility boundaries
- pure controllers are easier to test in isolation
- removing direct Express coupling makes the interface layer more portable and explicit
- centralized adaptation reduces repetitive request parsing and response boilerplate
- error serialization stays consistent because failures still terminate in the shared error middleware

## Consequences

- new controller work must start in `src/interfaces/http/controllers/<resource>/<action>.controller.ts`
- routes should use the shared Express adapter instead of embedding custom `try/catch` logic
- framework-specific behavior such as cookie handling and header serialization belongs to the adapter boundary, not the pure controller action
- services can be migrated gradually toward typed errors without blocking controller-layer cleanup

## Related Documents

- docs/architecture/backend-architecture.md
- docs/architecture/project-structure.md
- docs/ai/backend-development-workflow.md
- docs/adr/ADR-008-backend-clean-architecture-application-layer.md