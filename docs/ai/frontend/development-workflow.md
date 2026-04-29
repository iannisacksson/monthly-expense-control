# Frontend Development Workflow (AI-Assisted)

## Purpose

This document defines the workflow for implementing frontend features using AI tools.

The goal is to ensure:

- consistent development process
- alignment with backend API
- predictable feature implementation
- reliable AI-assisted development

AI assistants must follow this workflow when generating frontend code.

---

# Workflow Overview

Frontend feature development follows these steps:

1. Understand the feature
2. Review current documentation set
3. Review current codebase behavior
4. Review API specification
5. Create or update service layer
6. Create or update hooks
7. Create or update components and pages
8. Integrate routes
9. Validate against architecture and documentation sync rules

Each step references documentation that AI assistants must read.

---

# Step 1 — Understand the Feature

AI assistants must first read:

docs/product/vision.md

Then consult, when relevant:

docs/domain/domain-model.md

If the feature touches migration behavior or ownership rules, also read:

docs/adr/ADR-003-user-month-refactor.md

Goal:

Understand the feature requirements and user interactions.

Example prompt:

Read the vision and domain docs and explain the feature to be implemented.

---

# Step 2 — Review Current Documentation Set

Before changing frontend code, AI assistants must review the current documentation set that defines the intended behavior.

Minimum documentation review:

docs/product/vision.md  
docs/domain/domain-model.md when business ownership matters  
docs/architecture/api-spec.md  
docs/architecture/frontend/architecture.md  
docs/adr/ADR-003-user-month-refactor.md when the task touches migration behavior

Goal:

- establish intended behavior before editing
- identify whether the task is target-state work or legacy compatibility work
- avoid implementing against outdated assumptions

---

# Step 3 — Review Current Codebase Behavior

Before editing frontend code, AI assistants must inspect the current implementation that owns the behavior.

Minimum codebase review:

- route definitions
- page and layout entry points
- hooks and services that fetch or mutate data
- types or store objects that constrain the UI flow

If documentation and implementation disagree, do not proceed as if the mismatch does not exist.

First determine whether:

- documentation must be updated
- code must be updated
- both must change together as part of the refactor

---

# Step 4 — Review API Specification

AI assistants must consult:

docs/architecture/api-spec.md

Goal:

Understand the backend endpoints that the frontend must call.

AI assistants must distinguish between:

- target user-scoped endpoints
- temporary legacy family-scoped endpoints still required for compatibility

Example prompt:

Identify the API endpoints needed for this feature.

---

# Step 5 — Generate Service Layer

AI assistants must consult:

docs/architecture/frontend/api-integration.md

Goal:

Create services responsible for API communication.

Expected output:

src/services/<feature>.service.ts

Example:

expense.service.ts

Services must call the endpoints defined in api-spec.md.

---

# Step 6 — Generate Hooks

AI assistants must consult:

docs/architecture/frontend/state-management.md

Goal:

Create hooks responsible for managing server state.

Hooks should:

- call services
- use React Query
- expose loading and error states

Expected output:

src/hooks/use<Feature>.ts

Example:

useExpenses.ts

---

# Step 7 — Generate Components

AI assistants must consult:

docs/architecture/frontend/component-structure.md

Goal:

Create UI components for the feature.

Components should:

- be reusable
- focus on UI rendering
- receive props

Expected output:

src/components/features/<feature>

Example:

ExpenseCard  
ExpenseList

---

# Step 8 — Generate Page

AI assistants must consult:

docs/architecture/frontend/architecture.md

Goal:

Create the page representing the feature.

Expected output:

src/pages/<Feature>Page.tsx

Example:

ExpensesPage

Pages should:

- use hooks
- compose components
- manage page-level layout

---

# Step 9 — Register Routes

AI assistants must register routes using React Router.

Location:

src/routes

Example:

app.routes.tsx

Routes must map pages to URLs.

Example:

/expenses  
/categories

When both route models exist, prefer user-scoped routes for new product work.

---

# Step 10 — Validate the Implementation

AI assistants must verify:

- correct folder placement
- correct API usage
- proper component structure
- correct TypeScript types

Documents to consult:

docs/architecture/frontend/architecture.md  
docs/architecture/frontend/component-structure.md  
docs/architecture/frontend/state-management.md  
docs/architecture/frontend/api-integration.md

---

# Example Feature Workflow

Example: Expenses feature.

Steps:

1. Review product vision and domain context
2. Review current route, page, hook, and service implementation
3. Review API endpoints
4. Generate expense.service.ts
5. Generate useExpenses hook
6. Generate ExpenseCard component
7. Generate ExpensesPage
8. Register route /expenses

---

# AI Development Rules

AI assistants must:

- follow the workflow defined in this document
- consult architecture documents before generating code
- respect project folder structure
- ensure TypeScript type safety
- review the existing frontend flow before editing behavior
- update documentation before or alongside code when a mismatch is found

AI tools should not skip workflow steps.

---

# Documentation Sync Rule

No frontend behavior should be changed before reviewing the relevant documentation.

Before editing frontend code, AI assistants must:

- review the relevant documentation first
- review the current code path second
- compare both sources before implementing changes

If documentation and implementation are out of sync, the task must include at least one of these actions:

- update documentation to reflect the approved current behavior
- update code to comply with approved documentation
- update both together when the refactor intentionally changes the contract

---

# Related Documents

docs/product/vision.md  
docs/domain/domain-model.md  
docs/adr/ADR-003-user-month-refactor.md  
docs/architecture/api-spec.md  
docs/architecture/frontend/architecture.md  
docs/architecture/frontend/component-structure.md  
docs/architecture/frontend/state-management.md  
docs/architecture/frontend/api-integration.md