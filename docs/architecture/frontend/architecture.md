# Frontend Architecture

## Purpose

This document defines the frontend architecture of the Finanças da Casa application.

The goal is to ensure:

- consistent UI development
- predictable code organization
- maintainable components
- clear integration with the backend API
- reliable AI-assisted code generation

All frontend code must follow this architecture.

---

# Frontend Technology Stack

The frontend will use the following technologies:

React  
TypeScript  
Vite  
Axios  
React Router  

Optional tools that may be added later:

React Query (for server state management)  
Zustand (for client state management)

---

# Frontend Architecture Overview

The frontend follows a **component-based architecture**.

Key principles:

- reusable UI components
- separation between UI and business logic
- centralized API communication
- predictable folder structure

The frontend communicates with the backend through the REST API defined in:

docs/architecture/api-spec.md

---

# Frontend Folder Structure


frontend/

src/

components/
pages/
layouts/
hooks/
services/
store/
types/
utils/
routes/

main.tsx
App.tsx


---

# Folder Responsibilities

## components

Location:


src/components


Purpose:

Reusable UI components.

Examples:


Button
Input
Modal
ExpenseCard


Components should:

- be reusable
- be presentation-focused
- avoid business logic

---

## pages

Location:


src/pages


Purpose:

Application screens.

Pages compose components to build full screens.

Examples:


DashboardPage
ExpensesPage
CategoriesPage


Pages may:

- call hooks
- call services
- manage page-level state

---

## layouts

Location:


src/layouts


Purpose:

Shared layout structures.

Examples:


MainLayout
AuthLayout


Layouts define:

- navigation
- header
- sidebar
- page structure

---

## hooks

Location:


src/hooks


Purpose:

Reusable logic extracted from components.

Examples:


useExpenses
useCategories
useAuth


Hooks may:

- call services
- manage state
- transform API responses

---

## services

Location:


src/services


Purpose:

Handle communication with the backend API.

Responsibilities:

- perform HTTP requests
- map API responses
- centralize API configuration

Services should use Axios.

Example:


expense.service.ts
category.service.ts
auth.service.ts


---

## store

Location:


src/store


Purpose:

Manage global application state.

Examples:


auth.store.ts
settings.store.ts


This layer may use:

Zustand or other state management libraries.

---

## types

Location:


src/types


Purpose:

Define shared TypeScript types.

Examples:


Expense
Category
User


Types should match the API responses defined in:

docs/architecture/dto-spec.md

---

## utils

Location:


src/utils


Purpose:

Utility functions used across the application.

Examples:


currency-format.ts
date-format.ts
validation.ts


---

## routes

Location:


src/routes


Purpose:

Define application routes.

Routing must use React Router.

Example:


app.routes.tsx


---

# API Integration

The frontend must communicate with the backend API defined in:

docs/architecture/api-spec.md

Rules:

- all HTTP requests must go through services
- components must not call Axios directly
- services handle API endpoints

Example flow:


Component → Hook → Service → API


---

# Example Request Flow


ExpensesPage
↓
useExpenses Hook
↓
expense.service.ts
↓
Axios HTTP Request
↓
Backend API


---

# AI Development Rules

AI tools generating frontend code must:

- follow the folder structure defined in this document
- place files in the correct locations
- separate UI and business logic
- use services for API communication
- respect the API specification

AI tools must not create alternative architectures unless explicitly requested.

---

# Related Documents

docs/product/features.md  
docs/architecture/api-spec.md  
docs/architecture/dto-spec.md  
docs/architecture/project-structure.md  
docs/ai/task-templates.md