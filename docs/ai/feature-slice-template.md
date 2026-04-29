# Feature Slice Template

## Objective

This document defines the **standard template used to implement a full feature slice** in the project.

A feature slice represents a **vertical implementation of a product feature**, including:

- Domain
- Backend
- API
- Frontend

The goal is to allow AI coding assistants (Copilot, Cursor, etc.) to generate **consistent full-stack features** aligned with the project architecture.

---

# Concept

Instead of generating code by technical layers (controllers, services, etc.), the system generates code **by feature**.

Example:

Feature: Expense

The AI should generate:

Domain
Backend
API
Frontend

All artifacts must follow the project documentation inside `/docs`.

---

# Documentation Precedence

Before generating any feature slice, AI assistants must resolve documentation conflicts using this order:

1. docs/product/vision.md
2. docs/domain/domain-model.md and other docs/domain/*
3. docs/architecture/api-spec.md and docs/architecture/dto-spec.md
4. docs/product/features.md
5. docs/ai/*

This rule is mandatory.

It prevents outdated feature summaries from overriding the actual product model, API contracts, and domain language.

---

# Feature Slice Structure

Each feature must generate the following components.

## Domain

Define the domain model if necessary.

Files:

- domain entity
- domain validation rules
- domain events (if applicable)

References:

docs/domain/domain-model.md  
docs/domain/aggregates.md  
docs/domain/validation-rules.md

---

## Backend

The backend implementation must include:

Model
Repository
Service
Controller
Routes

Structure:

src/

models/
{feature}.model.ts

repositories/
{feature}.repository.ts

services/
{feature}.service.ts

controllers/
{feature}.controller.ts

routes/
{feature}.routes.ts

All implementations must follow:

docs/architecture/backend-architecture.md  
docs/architecture/repository-pattern.md

---

## API

The feature must expose REST endpoints.

Examples:

POST /{feature}

GET /{feature}

GET /{feature}/{id}

PUT /{feature}/{id}

DELETE /{feature}/{id}

API specification must follow:

docs/architecture/api-spec.md

DTOs must follow:

docs/architecture/dto-spec.md

---

## Frontend

Frontend must include:

API service  
React Query hooks  
Page  
Components

Structure:

src/

services/
{feature}.service.ts

hooks/
use{Feature}.ts

components/features/{feature}/
{Feature}Card.tsx
{Feature}List.tsx

pages/
{Feature}Page.tsx

Frontend implementation must follow:

docs/architecture/frontend/architecture.md  
docs/architecture/frontend/api-integration.md  
docs/architecture/frontend/state-management.md

---

# Naming Convention

Feature names must be:

- singular
- PascalCase for code
- plural for API routes

Example:

Feature: Expense

Backend model:

Expense

API route:

/expenses

---

# Prompt Library

AI assistants should choose one of the prompt templates below depending on the task scope.

Use these prompts as starting points and adapt only the feature name and feature-specific constraints.

---

## Prompt 1 — Standard Full Feature Slice

Use this when implementing a normal end-to-end feature with no unusual discovery risk.

```text
You are a senior engineer implementing a vertical feature slice in the repository monthly-expense-control.

Implement the full feature slice for "{FeatureName}".

Read first:
- docs/product/vision.md
- docs/product/features.md
- docs/domain/domain-model.md
- docs/domain/validation-rules.md
- docs/architecture/api-spec.md
- docs/architecture/dto-spec.md
- docs/architecture/backend-architecture.md
- docs/architecture/repository-pattern.md
- .github/copilot-instructions.md

If documentation conflicts, use this priority order:
1. docs/product/vision.md
2. docs/domain/*
3. docs/architecture/api-spec.md and docs/architecture/dto-spec.md
4. docs/product/features.md

Generate:
- Domain changes if needed
- Backend routes, controllers, DTOs, services/use-cases, repositories if needed
- Frontend types, services, React Query hooks, pages, and components

Constraints:
- The product is family-based and month-based
- Business logic stays in services/use-cases, not controllers
- Sequelize models represent tables only
- Controllers must stay thin
- Reuse existing TypeScript, Express, Sequelize, React Query, and UI patterns
- Do not introduce new frameworks
- Prefer extending existing flows instead of creating parallel ones

Execution:
1. Inspect the current implementation across backend and frontend
2. Identify what exists, what is missing, and what is inconsistent
3. Implement the missing pieces end-to-end
4. Verify route, DTO, type, and UI consistency
5. Run validation and summarize the result

Output:
- brief gap analysis
- implementation summary
- changed files
- validation results
- remaining risks or follow-ups
```

---

## Prompt 2 — Implementation-Ready

Use this when the scope is already clear and you want the agent to start coding immediately.

```text
You are a senior engineer implementing a vertical feature slice in the repository monthly-expense-control.

Implement or extend these flows end-to-end:
{FeatureScope}

Read first:
- docs/product/vision.md
- docs/product/features.md
- docs/domain/domain-model.md
- docs/domain/validation-rules.md
- docs/architecture/api-spec.md
- docs/architecture/dto-spec.md
- docs/architecture/backend-architecture.md
- docs/architecture/repository-pattern.md
- .github/copilot-instructions.md

If documentation conflicts, follow this order:
1. docs/product/vision.md
2. docs/domain/*
3. docs/architecture/api-spec.md and docs/architecture/dto-spec.md
4. docs/product/features.md

Constraints:
- The product is family-based and month-based
- Business logic stays in services/use-cases, not controllers
- Sequelize models represent tables only
- Controllers must stay thin
- Reuse the existing architecture and UI patterns
- Do not introduce new frameworks
- Prefer extending existing flows over building disconnected ones

Deliver:
- backend routes, controllers, DTOs, validation, services/use-cases
- repositories if needed
- frontend types, services, hooks, pages/components or integrations into existing pages
- loading, empty, and error states

Execution:
1. Inspect the current implementation
2. Identify what exists and what is missing
3. Implement the missing pieces end-to-end
4. Verify routing, types, and UX integration
5. Run validation

Output:
- brief gap analysis
- implementation summary
- changed files
- validation results
- remaining risks
```

---

## Prompt 3 — Planning-First

Use this when the area is unclear, partially implemented, or likely to contain architectural inconsistencies.

```text
You are a senior engineer working in the repository monthly-expense-control.

Plan the implementation of these feature flows:
{FeatureScope}

Read first:
- docs/product/vision.md
- docs/product/features.md
- docs/domain/domain-model.md
- docs/domain/validation-rules.md
- docs/architecture/api-spec.md
- docs/architecture/dto-spec.md
- docs/architecture/backend-architecture.md
- docs/architecture/repository-pattern.md
- .github/copilot-instructions.md

If documentation conflicts, follow this order:
1. docs/product/vision.md
2. docs/domain/*
3. docs/architecture/api-spec.md and docs/architecture/dto-spec.md
4. docs/product/features.md

Important constraints:
- The real product is a family financial manager organized by Family + Month
- Business logic belongs in services/use-cases
- Controllers must stay thin
- Sequelize models represent database tables only
- Reuse the current architecture and patterns
- Do not introduce new frameworks
- Prefer extending current flows instead of creating disconnected alternatives

Do not implement immediately.

First produce:
1. Current-state analysis of backend and frontend
2. Gap analysis: what exists, what is missing, what is inconsistent
3. Risks and architectural constraints
4. Implementation plan grouped by backend, API/DTO/validation, and frontend
5. Validation plan
6. Suggested execution order

Only after presenting the plan, proceed to implementation.

Final output must include:
- gap analysis
- implementation plan
- changed files
- validation results
- remaining risks
```

---

## Prompt 4 — Specialized: Budget Rules and Allocations

Use this when working only on budgeting flows.

```text
You are a senior engineer implementing the Budget Rules and Budget Allocations flow in the repository monthly-expense-control.

Read first:
- docs/product/vision.md
- docs/product/features.md
- docs/domain/domain-model.md
- docs/domain/validation-rules.md
- docs/architecture/api-spec.md
- docs/architecture/dto-spec.md
- docs/architecture/backend-architecture.md
- docs/architecture/repository-pattern.md
- .github/copilot-instructions.md

If documentation conflicts, follow:
1. docs/product/vision.md
2. docs/domain/*
3. docs/architecture/api-spec.md and docs/architecture/dto-spec.md
4. docs/product/features.md

Scope:
- create, list, update, and delete budget rules
- create, list, update, and delete budget allocations within a budget rule
- integrate the frontend flow into the current budgeting experience

Rules:
- budget rules are family-scoped
- allocations belong to a budget rule
- allocations target categories
- percentage values must respect validation rules
- the UI must make planned vs actual spending understandable

Constraints:
- business logic in services/use-cases only
- controllers must stay thin
- reuse existing TypeScript, Express, Sequelize, React Query, and UI patterns
- do not introduce new frameworks
- prefer extending existing dashboard and budgeting flows

Execution:
1. inspect current backend and frontend budget implementation
2. identify what exists and what is missing
3. implement the missing pieces end-to-end
4. verify types, routing, and UX integration
5. run validation

Output:
- brief gap analysis
- implementation summary
- changed files
- validation results
- remaining risks
```

---

## Prompt 5 — Specialized: Income Taxes

Use this when working only on taxes linked to monthly income.

```text
You are a senior engineer implementing the Income Taxes flow for Monthly Income in the repository monthly-expense-control.

Read first:
- docs/product/vision.md
- docs/product/features.md
- docs/domain/domain-model.md
- docs/domain/validation-rules.md
- docs/architecture/api-spec.md
- docs/architecture/dto-spec.md
- docs/architecture/backend-architecture.md
- docs/architecture/repository-pattern.md
- .github/copilot-instructions.md

If documentation conflicts, follow:
1. docs/product/vision.md
2. docs/domain/*
3. docs/architecture/api-spec.md and docs/architecture/dto-spec.md
4. docs/product/features.md

Scope:
- create, list, update, and delete income taxes linked to monthly income
- integrate taxes into the current monthly income flow
- expose tax totals and net income where relevant in the frontend

Rules:
- each income tax belongs to a monthly income
- support tax types such as INSS, IRRF, DAS, and custom
- allow manual CRUD operations
- preserve consistency between gross income, taxes, and net income visualization

Constraints:
- business logic in services/use-cases only
- controllers must stay thin
- Sequelize models represent tables only
- reuse current API and frontend patterns
- do not introduce new frameworks
- prefer integrating with existing month detail and income flows

Execution:
1. inspect current income and income tax implementation
2. identify what exists and what is missing
3. implement the missing pieces end-to-end
4. verify types, route integration, and monthly UI behavior
5. run validation

Output:
- brief gap analysis
- implementation summary
- changed files
- validation results
- remaining risks
```

---

## Prompt 6 — Specialized: Subcategories

Use this when working only on subcategory CRUD and expense-form integration.

```text
You are a senior engineer implementing the Subcategories flow in the repository monthly-expense-control.

Read first:
- docs/product/vision.md
- docs/product/features.md
- docs/domain/domain-model.md
- docs/domain/validation-rules.md
- docs/architecture/api-spec.md
- docs/architecture/dto-spec.md
- docs/architecture/backend-architecture.md
- docs/architecture/repository-pattern.md
- .github/copilot-instructions.md

If documentation conflicts, follow:
1. docs/product/vision.md
2. docs/domain/*
3. docs/architecture/api-spec.md and docs/architecture/dto-spec.md
4. docs/product/features.md

Scope:
- create, list, update, and delete subcategories linked to categories
- integrate subcategories into expense creation and editing flows
- ensure the frontend preserves category -> subcategory consistency

Rules:
- subcategories belong to categories
- subcategory CRUD must be complete
- expense forms must respect the selected category when showing subcategories
- the UX must keep category selection understandable for end users

Constraints:
- business logic in services/use-cases only
- controllers must stay thin
- Sequelize models represent tables only
- reuse existing category and expense flows
- do not introduce new frameworks
- prefer extending current pages and forms instead of parallel screens

Execution:
1. inspect current category, subcategory, and expense implementation
2. identify what exists and what is missing
3. implement the missing pieces end-to-end
4. verify frontend form behavior and API consistency
5. run validation

Output:
- brief gap analysis
- implementation summary
- changed files
- validation results
- remaining risks
```

---

# Expected Outcome

The generated feature must produce a **fully working vertical slice** including:

Database model  
REST API  
Business logic  
Frontend integration