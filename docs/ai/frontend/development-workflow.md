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
2. Review API specification
3. Create service layer
4. Create hooks
5. Create components
6. Create pages
7. Integrate routes
8. Validate against architecture

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

# Step 2 — Review API Specification

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

# Step 3 — Generate Service Layer

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

# Step 4 — Generate Hooks

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

# Step 5 — Generate Components

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

# Step 6 — Generate Page

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

# Step 7 — Register Routes

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

# Step 8 — Validate the Implementation

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
2. Review API endpoints
3. Generate expense.service.ts
4. Generate useExpenses hook
5. Generate ExpenseCard component
6. Generate ExpensesPage
7. Register route /expenses

---

# AI Development Rules

AI assistants must:

- follow the workflow defined in this document
- consult architecture documents before generating code
- respect project folder structure
- ensure TypeScript type safety

AI tools should not skip workflow steps.

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