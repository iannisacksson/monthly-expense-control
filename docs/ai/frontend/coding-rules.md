# Frontend Coding Rules (AI-Assisted Development)

## Purpose

This document defines the coding rules that AI assistants must follow when generating frontend code.

The goal is to ensure:

- consistent coding style
- maintainable React components
- predictable project structure
- alignment with the frontend architecture

AI tools must follow these rules when generating or modifying frontend code.

---

# Technology Stack

Frontend code must use the technologies defined in:

docs/architecture/frontend/architecture.md

Current stack:

React  
TypeScript  
Vite  
Axios  
React Router  
React Query  
Zustand

AI tools must not introduce additional frameworks unless explicitly requested.

---

# General Code Rules

All generated code must:

- use TypeScript
- follow the project folder structure
- follow React best practices
- keep components small and focused

AI tools must prioritize readability and maintainability.

---

# File Placement Rules

AI tools must place files in the correct folders.

Examples:

Components → src/components  
Pages → src/pages  
Hooks → src/hooks  
Services → src/services  
Stores → src/store  

File placement must follow:

docs/architecture/frontend/architecture.md  
docs/architecture/frontend/component-structure.md

AI tools must not create new folders without approval.

---

# Component Rules

Components must follow these rules:

- written in TypeScript
- functional components only
- use PascalCase naming
- receive typed props
- avoid business logic

Components must not:

- call APIs directly
- contain complex state logic

Complex logic must be moved to hooks.

Example component name:

ExpenseCard  
CategorySelector

---

# Hook Rules

Hooks encapsulate reusable logic.

Hooks may:

- call services
- use React Query
- manage local state

Hook naming must start with:

use

Examples:

useExpenses  
useCategories  
useFamilies

Location:

src/hooks

---

# Service Rules

All API communication must go through services.

Location:

src/services

Services must:

- use Axios
- call backend endpoints
- return typed responses

Components must not call Axios directly.

API integration must follow:

docs/architecture/frontend/api-integration.md

---

# State Management Rules

State management must follow:

docs/architecture/frontend/state-management.md

Server state must use:

React Query

Client state must use:

Zustand

AI tools must not introduce additional state libraries.

---

# Naming Conventions

Use clear and consistent naming.

Examples:

Pages:

ExpensesPage  
DashboardPage  

Hooks:

useExpenses  
useCategories  

Services:

expense.service.ts  
family.service.ts  

Stores:

family.store.ts  
ui.store.ts  

---

# Type Safety

All data structures must use TypeScript types.

Types should be defined in:

src/types

Types must match DTOs defined in:

docs/architecture/dto-spec.md

AI tools must avoid using:

any

unless absolutely necessary.

---

# Code Reusability

AI tools should prefer:

- reusable components
- reusable hooks
- shared utilities

Reusable code must be placed in:

src/components  
src/hooks  
src/utils

---

# Error Handling

API errors must be handled in:

- services
- hooks

Components should receive normalized error states.

---

# AI Behavior Guidelines

AI tools must:

- follow frontend architecture
- respect folder structure
- generate typed code
- avoid duplicating logic

AI tools must consult the following documents before generating code:

docs/architecture/frontend/architecture.md  
docs/architecture/frontend/component-structure.md  
docs/architecture/frontend/state-management.md  
docs/architecture/frontend/api-integration.md

---

# Related Documents

docs/architecture/frontend/architecture.md  
docs/architecture/frontend/component-structure.md  
docs/architecture/frontend/state-management.md  
docs/architecture/frontend/api-integration.md  
docs/architecture/api-spec.md