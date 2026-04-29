# Frontend State Management

## Purpose

This document defines how state should be managed in the frontend application.

The goal is to ensure:

- predictable data flow
- separation between server state and client state
- maintainable state logic
- compatibility with AI-assisted development

---

# Types of State

The application uses two types of state:

Server State  
Client State

Each type must be handled differently.

---

# Server State

Server state represents data fetched from the backend API.

Examples:

- expenses
- categories
- users

Server state must be handled using:

React Query

Responsibilities of React Query:

- fetching data
- caching data
- synchronizing server data
- managing loading states

Example:


useExpenses
useCategories


---

# Client State

Client state represents UI state stored locally in the application.

Examples:

- authentication state
- theme settings
- UI preferences

Client state should use:

Zustand

Example stores:


auth.store.ts
ui.store.ts


---

# State Management Rules

Components should:

- use hooks to access server state
- use stores for global UI state

Components must not:

- fetch data directly
- manage complex shared state internally

---

# Data Flow

The typical data flow is:


Component
↓
Hook
↓
Service
↓
API


Hooks are responsible for coordinating:

- API calls
- caching
- loading states

---

# Example Hook Structure


src/hooks/useExpenses.ts


Example responsibilities:

- fetch expenses
- expose loading state
- expose mutation methods

---

# AI Development Rules

AI tools generating frontend code must:

- use React Query for server state
- use Zustand for client state
- avoid using multiple state management libraries

---

# Related Documents

docs/architecture/frontend/architecture.md  
docs/architecture/frontend/api-integration.md  
docs/architecture/api-spec.md