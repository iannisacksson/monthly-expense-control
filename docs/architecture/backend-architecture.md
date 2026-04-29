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


Additional tools may include:


Zod or Joi for validation
JWT for authentication
dotenv for configuration


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
DebtService
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
CreateDebtDTO

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