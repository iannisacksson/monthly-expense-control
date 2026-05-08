# Backend Architecture

## Purpose

This document defines the **backend architecture of the application**.

It describes:

- technology stack
- architectural layers
- folder structure
- code responsibilities
- backend design patterns
- backend quality gates

This document serves two main purposes:

1️⃣ Guide developers implementing the backend  
2️⃣ Provide **structured context for AI-assisted development (Copilot / LLMs)**

Because of this:

- architecture rules must be explicit
- layers must be clearly defined
- code responsibilities must be documented

This prevents AI tools from generating inconsistent backend code.

---

# Technology Stack

The backend uses the following stack:


Runtime: Node.js
Language: TypeScript
Framework: Express
ORM: Sequelize
Database: PostgreSQL
Authentication: short-lived JWT access token in HttpOnly cookie + rotating refresh session
Password hashing: bcrypt (12 rounds)
Environment config: dotenv
Security middleware: cookie-parser, helmet, express-rate-limit, cors
Backend automated testing: Vitest + Supertest + PostgreSQL test database


---

# Authentication Architecture

The backend uses cookie-based authentication with server-tracked sessions.

## Session lifecycle

1. User registers via `POST /api/v1/auth/register`.
2. User logs in via `POST /api/v1/auth/login`.
3. The backend validates credentials, creates an `auth_sessions` record, hashes and stores the refresh token, and signs a short-lived JWT access token with payload `{ id, email, sessionId }`.
4. The backend returns the authenticated user in the response body and sets two HttpOnly cookies:

```text
fc_access_token   -> short-lived JWT access token
fc_refresh_token  -> rotating opaque refresh token
```

5. The frontend sends requests with `withCredentials: true`; it does not store tokens in localStorage.
6. Protected routes validate the access token through `authMiddleware` and confirm that the referenced session still exists and is not revoked.
7. When the access token expires, the client refreshes the session through `POST /api/v1/auth/refresh`, which rotates the refresh token and issues a new access token cookie.
8. `req.user` is populated with `{ id, email, sessionId }` from the verified access token.
9. Controllers and services use `req.user.id` to resolve the authenticated user. User identity is never trusted from request bodies.

## Session persistence

Authenticated sessions are persisted in `auth_sessions`.

Each session stores:

- `user_id`
- `refresh_token_hash`
- `refresh_expires_at`
- `revoked_at`
- request metadata such as IP and user agent

This enables:

- rotating refresh tokens
- multi-session support per user
- immediate revocation on logout
- server-side invalidation for expired or revoked sessions

## Audit trail

Authentication events are stored in `auth_audit_logs`.

Current events include:

- `login_succeeded`
- `login_failed`
- `refresh_succeeded`
- `refresh_failed`
- `logout_succeeded`
- `session_invalid`

These records capture the user, session, email when available, IP address, user agent, and optional metadata.

## Middleware

`src/middlewares/auth.middleware.ts`

Reads the access token from the HttpOnly cookie, verifies the JWT, confirms the referenced session is active, and populates `req.user`. Missing or invalid auth cookies are forwarded to the centralized error handler as `401 Unauthorized` responses.

The middleware is applied **globally** in `src/routes/index.ts` immediately after the public auth and operational routes, protecting all resource routes without requiring per-route decoration.

Public routes (`register`, `login`, `refresh`, `logout`, `health`, `live`, `ready`, `metrics`) are registered before the global `router.use(authMiddleware)` call.

## Security controls

The backend currently applies these HTTP security measures:

- `cors` with credentials support and environment-aware origin policy
- `helmet` for baseline security headers
- `express-rate-limit` on login and refresh endpoints
- `cookie-parser` for HttpOnly cookie handling

Current environment policy:

- development: allow any origin dynamically while supporting credentialed requests
- production: allow only origins listed in environment configuration

## Ownership Enforcement

All resource services enforce that the requesting user owns the resource.

The class `ForbiddenError` (`src/utils/errors.ts`) is thrown by the service when ownership does not match:

```ts
export class ForbiddenError extends Error {
  readonly statusCode = 403
  constructor(message = "Forbidden") {
    super(message)
    this.name = "ForbiddenError"
  }
}
```

Controllers catch `ForbiddenError` and return `HTTP 403`:

```ts
if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
```

Two ownership patterns exist:

**Direct** — resources with a `user_id` column (months, expenses, categories, monthly incomes, recurring incomes, recurring expenses, installment groups, budget rules):

```ts
if (resource.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
```

**Traversal** — resources without a direct `user_id` (subcategories, income taxes, budget allocations, expense items, expense adjustments):

```ts
const parent = await parentRepository.findById(resource.parent_id)
if (parent.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
```

All service methods that operate on a single resource accept `requestingUserId: string` as a parameter. Controllers always pass `req.user!.id`.

## Environment variables

| variable | purpose |
|----------|---------|
| ACCESS_TOKEN_SECRET | signing secret for the access JWT (required; `JWT_SECRET` remains legacy fallback only) |
| ACCESS_TOKEN_TTL_MINUTES | access token lifetime in minutes (optional, defaults to 15) |
| REFRESH_TOKEN_TTL_DAYS | refresh session lifetime in days (optional, defaults to 30) |
| ACCESS_TOKEN_COOKIE_NAME | access token cookie name (optional, defaults to `fc_access_token`) |
| REFRESH_TOKEN_COOKIE_NAME | refresh token cookie name (optional, defaults to `fc_refresh_token`) |
| COOKIE_DOMAIN | optional cookie domain for deployed environments |
| FRONTEND_ORIGIN | single allowed frontend origin; usable as production allowlist input |
| CORS_ALLOWED_ORIGINS | comma-separated allowed origins for production |
| TRUST_PROXY | reverse proxy setting for Express/rate limiting |
| AUTH_LOGIN_RATE_LIMIT_MAX | max login attempts per rate-limit window (optional, defaults to 5) |
| AUTH_REFRESH_RATE_LIMIT_MAX | max refresh attempts per rate-limit window (optional, defaults to 20) |
| APP_NAME | logical service name used in structured logs and metrics labels |
| LOG_LEVEL | backend log level override (`silent`, `error`, `warn`, `info`, `debug`) |
| METRICS_ENABLED | enables Prometheus metrics collection when not set to `false` |

## Operational observability baseline

The backend now includes a minimal operational layer for production readiness.

### Structured logging

- `src/utils/logger.ts` provides the shared Pino logger
- startup and operational failures log structured JSON events instead of raw `console.log`
- `src/middlewares/request-logger.middleware.ts` emits one completion log per request
- request logs include `requestId`, method, route, status code, and duration
- sensitive fields such as cookies, tokens, and password values are redacted before output

### Error handling

- `src/middlewares/error-handler.middleware.ts` is the centralized fallback for HTTP boundary failures
- middleware-originated failures such as auth and CORS errors are normalized before response
- unexpected errors return `HTTP 500` with `{ "error": "Internal server error" }`

### Operational endpoints

- `GET /api/v1/live` verifies process liveness
- `GET /api/v1/ready` verifies application readiness, including database connectivity
- `GET /api/v1/health` returns an aggregate operational summary
- `GET /api/v1/metrics` exposes Prometheus/OpenMetrics text metrics

The readiness flow is implemented in `src/services/operational.service.ts` and uses the configured Sequelize connection to validate database availability.

### Metrics

- `src/utils/metrics.ts` owns the Prometheus registry and default process metrics
- HTTP request count and duration are captured centrally in the request logging middleware

Operational documentation for logging, health checks, metrics, backup guidance, retention, and incident response lives in `docs/architecture/backend-operations.md`.

---

# Architectural Style

The backend follows a **layered architecture**.

Main layers:


Controller
Service
Repository
Model
DTO


Responsibilities are strictly separated.

---

# Backend Quality Gates

Backend changes must satisfy an executable quality gate.

Current baseline:

- backend build must pass
- backend automated tests must pass
- critical HTTP and domain flows are covered through integration tests
- CI must run backend build plus backend tests against PostgreSQL

Mandatory rule:

- every new backend feature
- every backend bug fix
- every backend behavior-changing refactor

must add or update automated backend tests for the affected behavior.

Changes without automated coverage for the affected backend behavior are incomplete.

---

# Request Flow

Typical request lifecycle:


HTTP Request
↓
Controller
↓
Service
↓
Repository
↓
Database (Sequelize / PostgreSQL)


Response:


Database
↓
Repository
↓
Service
↓
Controller
↓
HTTP Response


---

# Folder Structure

The backend project follows this structure:


src/

controllers
services
repositories
models
routes
dtos
middlewares
config
database
tests
utils


Example:


src/
├ controllers
│ └ expense.controller.ts
│
├ services
│ └ expense.service.ts
│
├ repositories
│ └ expense.repository.ts
│
├ models
│ ├ expense.model.ts
│ └ auth-session.model.ts
│
├ routes
│ └ expense.routes.ts
│
├ dtos
│ └ create-expense.dto.ts
│
├ middlewares
│ ├ auth.middleware.ts
│ └ rate-limit.middleware.ts
│
├ config
│ ├ auth.config.ts
│ └ security.config.ts
│
├ database
│ ├ connection.ts
│ └ migrations
│    └ 20260430000034-create-auth-sessions.js
│
└ utils
  ├ auth-cookies.ts
  └ request-context.ts


---

# Controllers

Controllers are responsible for:

- handling HTTP requests
- validating input
- calling services
- returning HTTP responses

Controllers must **NOT**:

- implement business logic
- access the database directly
- interact with Sequelize models

Example responsibility:


Request parsing
Validation
Calling service
Formatting response


Example pattern:

```ts
export const createExpense = async (req, res) => {
  const data = req.body

  const result = await expenseService.createExpense(data)

  return res.status(201).json(result)
}
Services

Services implement the business logic of the application.

Responsibilities:

business rules

validations

orchestration between repositories

Services must NOT:

access Express request or response objects

perform direct HTTP operations

Example:

ExpenseService
MonthlyIncomeService
BudgetService
BudgetService

Example pattern:

async createExpense(data: CreateExpenseDTO) {

   const expense = await expenseRepository.create(data)

   return expense
}
Repositories

Repositories handle database access.

They interact with Sequelize models.

Responsibilities:

database queries

persistence

query optimization

Repositories must NOT:

implement business logic

handle HTTP requests

Example responsibilities:

createExpense
findExpensesByMonth
findExpensesByCategory

Example pattern:

async create(data) {
   return ExpenseModel.create(data)
}
Models

Models define Sequelize entities.

Each model represents a database table.

Example:

User
Expense
MonthlyIncome
Category

Example model:

export const Expense = sequelize.define('Expense', {

  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },

  value: {
    type: DataTypes.DECIMAL
  }

})

Models must define:

columns

data types

associations

DTOs (Data Transfer Objects)

DTOs define the structure of request data.

Purpose:

validation

input typing

API contracts

Example:

CreateExpenseDTO
CreateIncomeDTO
CreateBudgetRuleDTO

Example:

export interface CreateExpenseDTO {

  userId: string
  monthId: string
  categoryId: string
  value: number
  description?: string

}
Routes

Routes connect HTTP endpoints to controllers.

Example:

POST /expenses
GET /expenses
GET /expenses/month/:monthId

Example route file:

router.post(
  "/expenses",
  expenseController.createExpense
)
Database Layer

Database interaction uses Sequelize.

Connection configuration lives in:

src/database/connection.ts

Migrations are stored in:

src/database/migrations

Sequelize models must match the schema defined in:

docs/architecture/database-model.md
Error Handling

The backend should implement centralized error handling.

Example middleware:

errorHandler

Responsibilities:

catch unexpected errors

return standardized responses

Example response:

{
  "error": "ValidationError",
  "message": "Invalid expense value"
}
Authentication (Future)

Authentication may include:

JWT tokens
login endpoints
user sessions

Auth middleware:

authMiddleware
Logging

The backend should include logging for:

requests
errors
database failures

Possible tools:

pino
winston
AI Guardrails

AI tools interacting with this repository must follow these rules:

1️⃣ Controllers must not access Sequelize models directly

2️⃣ Business logic must be implemented inside services

3️⃣ Database access must go through repositories

4️⃣ Models must reflect the schema defined in:

docs/architecture/database-model.md

5️⃣ Do not introduce new architectural layers unless explicitly defined

Summary

Architecture layers:

Controller
Service
Repository
Model
DTO

Technology stack:

Node.js
TypeScript
Express
Sequelize
PostgreSQL

Design principles:

Separation of concerns
Layered architecture
Explicit domain modeling
AI-friendly documentation