# Backend Development Workflow (AI-Assisted)

## Purpose

This document defines the recommended workflow for developing backend features using AI assistants.

It ensures that generated code follows:

- project architecture
- domain rules
- database schema
- API specification

AI assistants must follow this workflow when generating backend code.

---

# Workflow Overview

Backend development should follow these steps:

1. Understand the feature
2. Review current documentation set
3. Review current codebase behavior
4. Review domain model
5. Review database schema
6. Generate or update repository
7. Generate or update domain entities or domain rules when needed
8. Generate or update application use cases
9. Generate or update controller and routes
10. Validate against API specification and documentation sync rules
11. Add or update automated tests
12. Run backend quality gates

Each step references specific documentation.

---

# Step 1 — Understand the Feature

Before generating code, AI tools must read:

docs/product/vision.md

Then consult, when relevant:

docs/product/features.md
docs/adr/ADR-003-user-month-refactor.md

Goal:

Understand the product direction, active scope, and whether the task belongs to the target model or a temporary compatibility flow.

Example prompt:


Read docs/product/vision.md and identify whether this change belongs to the target product flow or a legacy compatibility flow.


---

# Step 2 — Review Current Documentation Set

Before changing backend code, AI assistants must review the current documentation set that defines the intended behavior.

Minimum documentation review:

docs/product/vision.md  
docs/domain/domain-model.md  
docs/architecture/api-spec.md  
docs/architecture/dto-spec.md  
docs/adr/ADR-003-user-month-refactor.md when ownership or migration is involved

Goal:

- establish intended behavior before editing
- identify whether the task is target-state work or transitional compatibility work
- detect whether the documentation is already explicit enough for a safe change

---

# Step 3 — Review Current Codebase Behavior

Before editing backend code, AI assistants must inspect the current implementation that owns the behavior.

Minimum codebase review:

- routes or controllers that expose the behavior
- use cases or services that enforce the behavior
- repositories or models that constrain the behavior
- related frontend calls when the contract affects the UI

If documentation and implementation disagree, do not silently pick one and proceed.

First determine whether:

- documentation must be updated
- code must be updated
- both must change together as part of the refactor

---

# Step 4 — Review Domain Model

AI assistants must consult:

docs/domain/domain-model.md  
docs/domain/aggregates.md  
docs/domain/events.md  

Goal:

Understand:

- domain entities
- aggregate boundaries
- domain events

Example prompt:


Review the domain model and aggregates before generating business logic.


---

# Step 5 — Review Database Schema

AI assistants must consult:

docs/architecture/database-model.md

Goal:

Ensure generated models match the database schema.

Example prompt:


Generate the Sequelize model following the schema defined in database-model.md.


Expected output:


src/models/<entity>.model.ts


---

# Step 6 — Generate Repository

AI assistants must consult:

docs/architecture/repository-pattern.md

Goal:

Create the repository responsible for database interaction.

Example prompt:


Generate the repository for the entity following repository-pattern.md.


Expected output:


src/repositories/<entity>.repository.ts


---

# Step 7 — Generate Domain Rules

AI assistants must consult:

docs/domain/domain-model.md  
docs/domain/validation-rules.md  

Goal:

Move pure validations and reusable invariants into rich entities or domain-level constructs when that improves clarity and testability.

Domain code must not depend on Express or Sequelize.

---

# Step 8 — Generate Application Use Cases

AI assistants must consult:

docs/domain/aggregates.md  
docs/domain/events.md  
docs/domain/validation-rules.md  

Goal:

Implement orchestration and use-case behavior.

Use cases must:

- coordinate repositories and supporting services
- invoke rich domain entities and domain rules
- keep orchestration out of controllers

Example prompt:


Generate the application use cases for this feature.


Expected output:


src/application/use-cases/<entity>/<action>.use-case.ts

Examples:

- src/application/use-cases/category/create.use-case.ts
- src/application/use-cases/category/list-by-user.use-case.ts
- src/application/use-cases/category/get-by-id.use-case.ts

Rules:

- do not aggregate multiple actions in `<feature>.use-cases.ts`
- do not route new application behavior through `src/services` when the use case can orchestrate repositories and domain rules directly
- prefer one focused unit test group per migrated action or entity slice under `backend/tests/unit/application/use-cases`


---

# Step 9 — Generate Controller

AI assistants must consult:

docs/architecture/api-spec.md  
docs/architecture/dto-spec.md  

Goal:

Implement HTTP layer.

Controllers must:

- be organized as one action per file under `src/interfaces/http/controllers/<resource>/<action>.controller.ts`
- be classes implementing the `IController<TReq, TRes>` interface from `src/interfaces/http/http.types.ts`
- receive the relevant use case injected via the constructor
- receive simple request models (`HttpRequest` or `AuthenticatedHttpRequest`) instead of Express objects
- call the injected use case and return an `HttpResponse`
- use `HttpStatusCode` enum from `src/interfaces/http/http-status-code.ts` instead of numeric literals

Express adapters must:

- live at the HTTP boundary, inside the route file
- instantiate controller classes and inject their use cases
- call `adaptExpressRoute` passing `controller.handle.bind(controller)` as the handler
- extract `req` data using `buildHttpRequest` or `buildAuthenticatedHttpRequest`
- forward failures to the centralized error handler

There must be no `index.ts` or aggregator files inside resource controller folders.
`adaptExpressRoute` calls and controller instantiation belong exclusively in the route file.

Example prompt:


Generate the controller following api-spec.md.


Expected output:


src/interfaces/http/controllers/<resource>/<action>.controller.ts


Example controller structure:

```ts
import type { SomeDTO } from "../../../../dtos/some.dto"
import { SomeUseCase } from "../../../../application/use-cases/some.use-cases"
import { HttpStatusCode } from "../../http-status-code"
import type { AuthenticatedHttpRequest, HttpResponse, IController } from "../../http.types"

export class CreateSomeController implements IController<AuthenticatedHttpRequest<SomeDTO>> {
  constructor(private readonly useCase: SomeUseCase) {}

  async handle(request: AuthenticatedHttpRequest<SomeDTO>): Promise<HttpResponse> {
    const result = await this.useCase.execute(request.body, request.userId)
    return { statusCode: HttpStatusCode.CREATED, body: result }
  }
}
```

Example route registration:

```ts
const controller = new CreateSomeController(new SomeUseCase())
router.post("/", adaptExpressRoute(
  controller.handle.bind(controller),
  (req) => buildAuthenticatedHttpRequest(req),
  withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
))
```


---

# Step 10 — Generate Routes

AI assistants must consult:

docs/architecture/api-spec.md

Goal:

Expose endpoints defined in the API specification.

Example prompt:


Generate Express routes for the resource.


Expected output:


src/interfaces/http/routes/<entity>.routes.ts


---

# Step 11 — Validate the Implementation

AI assistants must verify:

- architecture consistency
- DTO validation
- repository usage
- correct API endpoints

Documents to consult:

docs/architecture/backend-architecture.md  
docs/domain/validation-rules.md  
docs/architecture/api-spec.md  
docs/product/vision.md  
docs/adr/ADR-003-user-month-refactor.md when relevant

Example prompt:


Review the generated code and ensure it follows the architecture and validation rules.


---

# Step 12 — Add or Update Automated Tests

Automated backend tests are mandatory for:

- every new backend feature
- every backend bug fix
- every backend behavior-changing refactor

AI assistants must add or update tests that exercise the affected behavior using the real backend contract whenever practical.

Minimum expectation:

- prefer integration coverage for critical HTTP and domain flows
- add focused unit coverage when logic becomes pure and isolated in domain entities or value objects
- do not rely on mock-only tests when real repository and database behavior is part of the risk
- keep test setup reproducible and documented

If a backend change does not update tests for the affected behavior, the task is incomplete.

---

# Step 13 — Run Backend Quality Gates

Before considering a backend task complete, AI assistants must run the available quality gates for the affected scope.

Current minimum backend gates:

- backend build
- backend automated tests

If documentation, setup, or CI changes are included, the related docs must be updated in the same task.

If the backend change affects logging, metrics, health checks, readiness, or other operational behavior, update the operational docs and README in the same task.

---

# Example Workflow for a New Resource

Example: Implement Expense feature.

Workflow:

1. Read product vision and relevant migration docs
2. Review the current code paths that already implement the behavior
3. Review Expense entity in domain-model.md
4. Review database impact when needed
5. Generate or update ExpenseRepository
6. Generate or update rich domain entities or rules when needed
7. Generate or update Expense use cases
8. Generate or update pure Expense controllers, HTTP adapters, and routes
9. Validate against api-spec.md and documentation consistency
10. Add or update automated tests
11. Run backend quality gates

---

# AI Usage Instructions

When generating backend features, AI assistants must:

1. follow this workflow
2. consult the appropriate documentation at each step
3. ensure generated code respects architecture rules
4. review the existing codebase before editing behavior
5. update documentation before or alongside code when a mismatch is found
6. add or update automated tests for every backend feature, bug fix, or behavior-changing refactor
7. classify backend tests explicitly by level when reorganizing or adding new suites

AI tools should not skip workflow steps.

---

# Documentation Sync Rule

No backend refactor should proceed without documentation review and comparison against the current codebase.

Before changing backend code, AI assistants must:

- review the relevant documentation first
- inspect the current implementation second
- update operational documentation and ADRs alongside the code when runtime behavior or observability changes
- compare both sources before editing

If documentation and implementation differ, the task must include one of these outcomes:

- update the documentation to reflect the approved current behavior
- update the code to match the approved documentation
- update both in the same task when the refactor intentionally changes the contract

---

# Expected Outcome

Using this workflow, AI assistants should generate:

- consistent backend structure
- clean separation of concerns
- domain-aligned business logic
- API endpoints matching the specification