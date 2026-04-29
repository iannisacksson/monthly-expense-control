# Backend Architecture

## Purpose

This document defines the **backend architecture of the application**.

It describes:

- technology stack
- architectural layers
- folder structure
- code responsibilities
- backend design patterns

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
Authentication: JWT Bearer Token (jsonwebtoken)
Password hashing: bcrypt (12 rounds)
Environment config: dotenv


---

# Authentication Architecture

The backend uses stateless JWT Bearer Token authentication.

## Token lifecycle

1. User registers via `POST /api/v1/auth/register`.
2. User logs in via `POST /api/v1/auth/login`.
3. The server signs a JWT with payload `{ id, email }` using `JWT_SECRET`.
4. The client stores the token and sends it on every subsequent request as:

```
Authorization: Bearer <token>
```

5. Protected routes validate the token through `authMiddleware`.
6. `req.user` is populated with `{ id, email }` from the verified token payload.
7. Controllers and services use `req.user.id` to resolve the authenticated user. User identity is never trusted from request bodies.

## Middleware

`src/middlewares/auth.middleware.ts`

Verifies the JWT. Populates `req.user`. Returns 401 if the token is missing, invalid, or expired.

The middleware is applied **globally** in `src/routes/index.ts` immediately after the public `/auth` and `/health` routes, protecting all resource routes without requiring per-route decoration.

Public routes (register, login, health) are registered before the global `router.use(authMiddleware)` call.

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

**Traversal** — resources without a direct `user_id` (subcategories, income taxes, budget allocations):

```ts
const parent = await parentRepository.findById(resource.parent_id)
if (parent.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
```

All service methods that operate on a single resource accept `requestingUserId: string` as a parameter. Controllers always pass `req.user!.id`.

## Environment variables

| variable | purpose |
|----------|---------|
| JWT_SECRET | signing secret (required, no default) |
| JWT_EXPIRES_IN | token lifespan (optional, defaults to 7d) |

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
│ └ expense.model.ts
│
├ routes
│ └ expense.routes.ts
│
├ dtos
│ └ create-expense.dto.ts
│
├ middlewares
│
├ config
│
├ database
│ ├ connection.ts
│ └ migrations
│
└ utils


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