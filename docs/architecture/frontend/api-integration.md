# Frontend API Integration

Frontend must never invent endpoints.

The API specification is the single source of truth.

## Purpose

This document defines how the frontend communicates with the backend API.

The goal is to ensure:

- consistent API communication
- centralized HTTP configuration
- predictable request patterns
- maintainable integration

---

# API Source

The backend API is defined in:

docs/architecture/api-spec.md

All API requests must follow the endpoints defined there.

---

# HTTP Client

The frontend must use:

Axios

Axios configuration must be centralized.

Location:


src/services/http-client.ts


Responsibilities:

- define base URL
- configure headers
- configure interceptors

---

# Service Layer

All API communication must go through the service layer.

Location:


src/services


Examples:


expense.service.ts
month.service.ts


Services must:

- call API endpoints
- return typed responses
- isolate HTTP logic

---

# API Request Flow

The request flow must follow this pattern:


Component
↓
Hook
↓
Service
↓
Axios Client
↓
Backend API


Components must not call Axios directly.

---

# Example Service

Example file:


src/services/expense.service.ts


Responsibilities:

- fetch expenses
- create expenses
- update expenses
- delete expenses

---

# Error Handling

Errors must be handled using Axios interceptors.

Interceptors may:

- log errors
- redirect on authentication errors
- normalize error responses

---

# Authentication

Authentication tokens should be stored securely and added to requests using Axios interceptors.

Example:


Authorization: Bearer <token>


---

# AI Development Rules

AI tools generating API integration code must:

- create services for API communication
- avoid calling Axios directly inside components
- follow the API specification

AI tools must ensure that frontend types match the DTOs defined in:

docs/architecture/dto-spec.md

---

# Related Documents

docs/architecture/frontend/architecture.md  
docs/architecture/frontend/state-management.md  
docs/architecture/api-spec.md  
docs/architecture/dto-spec.md