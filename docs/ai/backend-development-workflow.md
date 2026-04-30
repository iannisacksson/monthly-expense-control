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
7. Generate or update service
8. Generate or update controller and routes
9. Validate against API specification and documentation sync rules
10. Add or update automated tests
11. Run backend quality gates

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
- services that enforce the behavior
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

# Step 7 — Generate Service

AI assistants must consult:

docs/domain/aggregates.md  
docs/domain/events.md  
docs/domain/validation-rules.md  

Goal:

Implement business logic.

Services must:

- validate business rules
- coordinate aggregates
- trigger domain events

Example prompt:


Generate the service implementing the business logic for this entity.


Expected output:


src/services/<entity>.service.ts


---

# Step 8 — Generate Controller

AI assistants must consult:

docs/architecture/api-spec.md  
docs/architecture/dto-spec.md  

Goal:

Implement HTTP layer.

Controllers must:

- receive DTOs
- call services
- return responses

Example prompt:


Generate the controller following api-spec.md.


Expected output:


src/controllers/<entity>.controller.ts


---

# Step 9 — Generate Routes

AI assistants must consult:

docs/architecture/api-spec.md

Goal:

Expose endpoints defined in the API specification.

Example prompt:


Generate Express routes for the resource.


Expected output:


src/routes/<entity>.routes.ts


---

# Step 10 — Validate the Implementation

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

# Step 11 — Add or Update Automated Tests

Automated backend tests are mandatory for:

- every new backend feature
- every backend bug fix
- every backend behavior-changing refactor

AI assistants must add or update tests that exercise the affected behavior using the real backend contract whenever practical.

Minimum expectation:

- prefer integration coverage for critical HTTP and domain flows
- do not rely on mock-only tests when real repository and database behavior is part of the risk
- keep test setup reproducible and documented

If a backend change does not update tests for the affected behavior, the task is incomplete.

---

# Step 12 — Run Backend Quality Gates

Before considering a backend task complete, AI assistants must run the available quality gates for the affected scope.

Current minimum backend gates:

- backend build
- backend automated tests

If documentation, setup, or CI changes are included, the related docs must be updated in the same task.

---

# Example Workflow for a New Resource

Example: Implement Expense feature.

Workflow:

1. Read product vision and relevant migration docs
2. Review the current code paths that already implement the behavior
3. Review Expense entity in domain-model.md
4. Review database impact when needed
5. Generate or update ExpenseRepository
6. Generate or update ExpenseService
7. Generate or update ExpenseController and routes
8. Validate against api-spec.md and documentation consistency
9. Add or update automated tests
10. Run backend quality gates

---

# AI Usage Instructions

When generating backend features, AI assistants must:

1. follow this workflow
2. consult the appropriate documentation at each step
3. ensure generated code respects architecture rules
4. review the existing codebase before editing behavior
5. update documentation before or alongside code when a mismatch is found
6. add or update automated tests for every backend feature, bug fix, or behavior-changing refactor

AI tools should not skip workflow steps.

---

# Documentation Sync Rule

No backend refactor should proceed without documentation review and comparison against the current codebase.

Before changing backend code, AI assistants must:

- review the relevant documentation first
- inspect the current implementation second
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