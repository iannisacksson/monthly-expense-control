# ADR-008 — Backend Application Layer and Rich Domain Entities

## Status

Accepted

## Date

2026-05-30

---

## Context

The backend originally used a strict layered structure centered on:

- controllers
- services
- repositories
- models

That structure kept controllers thin and repositories focused, but over time the `services` layer accumulated too many responsibilities:

- orchestration of multi-step use cases
- validation logic
- ownership checks
- aggregate coordination
- infrastructure-aware branching

The backend test suite also lacked a clear architectural taxonomy. Most coverage lived at the HTTP integration level, with only isolated pure-unit tests.

The project needed a cleaner and more explicit separation without a destructive rewrite.

## Decision

The backend adopts a Clean Architecture inspired hybrid structure with these decisions:

1. Runtime HTTP entrypoints are exposed through `src/interfaces/http`.
2. Application orchestration is expressed explicitly in `src/application/use-cases`.
3. Pure reusable validations and domain rules move into rich entities and value objects in `src/domain`.
4. Repositories remain focused on persistence and continue to act as infrastructure adapters.
5. Existing `src/services` may remain temporarily as compatibility support while explicit use cases become the official runtime boundary.
6. Backend tests are classified explicitly by level:
   - `tests/unit`
   - `tests/integration/http`
   - `tests/shared`
7. The HTTP boundary may continue evolving toward pure controllers plus thin framework adapters as the interface layer is made more explicit.
8. Application use cases are organized one action per file under `src/application/use-cases/<entity>/<action>.use-case.ts`.

## Rationale

- explicit use cases make orchestration visible and easier to evolve
- rich entities move reusable business rules out of controllers and out of ORM-oriented modules
- keeping repositories narrow preserves current persistence discipline
- introducing the new architecture without a destructive rewrite reduces delivery risk
- test taxonomy improves architectural clarity without discarding valuable integration coverage
- action-scoped use-case files reduce hidden coupling and make service removal incremental by slice

## Consequences

- new backend behavior should prefer `application/use-cases` as the runtime orchestration boundary
- new backend behavior should prefer action-scoped files under `application/use-cases/<entity>/`
- domain validations should preferentially live in rich entities or value objects when reusable and pure
- controllers remain thin and HTTP-focused
- repositories remain infrastructure-only and must not absorb business logic
- legacy folders may coexist temporarily, but documentation must treat them as compatibility surfaces rather than the target architecture
- grouped `src/application/use-cases/<entity>.use-cases.ts` files are migration leftovers and must not be used for new slices

## Related Documents

- docs/architecture/backend-architecture.md
- docs/architecture/project-structure.md
- docs/architecture/repository-pattern.md
- docs/ai/backend-development-workflow.md
- backend/README.md