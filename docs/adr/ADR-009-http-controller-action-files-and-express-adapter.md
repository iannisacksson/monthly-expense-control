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
2. Each controller is a class implementing the generic `IController<TReq, TRes>` interface defined in `src/interfaces/http/http.types.ts`.
3. Use cases are injected into the controller via the constructor.
4. Controllers use `HttpStatusCode` enum from `src/interfaces/http/http-status-code.ts` instead of numeric HTTP status literals.
5. Controller actions do not import Express types.
6. Express adaptation is centralized in `src/interfaces/http/express-route.adapter.ts`.
7. Route files are responsible for instantiating controller classes, injecting use cases, and calling `adaptExpressRoute` with `controller.handle.bind(controller)`.
8. There must be no `index.ts` or aggregator files inside resource controller folders whose sole purpose is re-exporting action controllers or assembling `adaptExpressRoute` calls.
9. The centralized `error-handler` middleware remains the final serializer of HTTP errors.
10. Action-specific fallback status normalization may happen in the Express adapter while legacy services still throw plain `Error` values.
11. Legacy `src/controllers/*.ts` modules remain only as compatibility re-export surfaces during the transition.

## Rationale

- one action per file improves discoverability and responsibility boundaries
- class-based controllers with constructor injection make use-case dependencies explicit and testable in isolation
- the `IController<TReq, TRes>` interface enforces a consistent input/output contract across all actions
- the `HttpStatusCode` enum eliminates numeric literals, reducing ambiguity and centralizing HTTP semantics
- removing `index.ts` aggregator files eliminates an indirection layer that provided no behavior and made the import graph harder to trace
- pure controllers are easier to test in isolation
- removing direct Express coupling makes the interface layer more portable and explicit
- centralized adaptation reduces repetitive request parsing and response boilerplate
- error serialization stays consistent because failures still terminate in the shared error middleware

## Consequences

- new controller work must start in `src/interfaces/http/controllers/<resource>/<action>.controller.ts` as a class implementing `IController`
- controller classes receive their use case via constructor injection
- routes instantiate controllers, inject use cases, and call `adaptExpressRoute(controller.handle.bind(controller), ...)`
- `index.ts` or aggregator files inside resource controller folders must not be created
- `HttpStatusCode` enum must be used instead of numeric HTTP status literals in controllers and routes
- framework-specific behavior such as cookie handling and header serialization belongs to the adapter boundary, not the pure controller action
- services can be migrated gradually toward typed errors without blocking controller-layer cleanup
- the `month` resource serves as the reference implementation of this pattern; other resources should be migrated incrementally

## Related Documents

- docs/architecture/backend-architecture.md
- docs/architecture/project-structure.md
- docs/ai/backend-development-workflow.md
- docs/adr/ADR-008-backend-clean-architecture-application-layer.md