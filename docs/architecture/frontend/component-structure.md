# Frontend Component Structure

## Purpose

This document defines how UI components must be structured in the frontend application.

The goal is to ensure:

- reusable UI components
- predictable file structure
- separation between UI and logic
- easier AI-assisted code generation

All components must follow the structure defined here.

---

# Component Types

The frontend uses three types of components:

UI Components  
Feature Components  
Layout Components

Each type has a different responsibility.

---

# UI Components

Location:


src/components/ui


Purpose:

Reusable visual components with no business logic.

Examples:


Button
Input
Card
Modal
Select


Characteristics:

- reusable
- presentational
- no API calls
- minimal state

Example:


src/components/ui/Button


Structure:


Button/
Button.tsx
Button.types.ts
Button.styles.ts


---

# Feature Components

Location:


src/components/features


Purpose:

Components related to specific features of the application.

Examples:


ExpenseList
ExpenseCard
CategorySelector


Feature components may:

- use hooks
- call services indirectly
- manage local state

Example:


src/components/features/expenses/ExpenseCard


Structure:


ExpenseCard/
ExpenseCard.tsx
ExpenseCard.types.ts


---

# Layout Components

Location:


src/layouts


Purpose:

Define page layout and structure.

Examples:


MainLayout
AuthLayout
DashboardLayout


Layouts manage:

- navigation
- headers
- sidebars
- page containers

---

# Component Naming Conventions

Component names must follow PascalCase.

Example:


ExpenseCard
ExpenseList
CategorySelector


Files must match the component name.

Example:


ExpenseCard.tsx


---

# Component Responsibilities

Components should:

- render UI
- receive props
- delegate logic to hooks

Components must not:

- call APIs directly
- implement complex business logic

---

# Example Component Structure


src/components

ui/
Button/
Button.tsx

features/
expenses/
ExpenseCard/
ExpenseCard.tsx


---

# AI Development Rules

AI tools generating components must:

- place components in the correct folders
- avoid mixing UI and business logic
- follow the naming conventions defined here

AI tools must not introduce alternative component structures.

---

# Related Documents

docs/architecture/frontend/architecture.md  
docs/architecture/frontend/state-management.md  
docs/architecture/frontend/api-integration.md  
docs/architecture/api-spec.md