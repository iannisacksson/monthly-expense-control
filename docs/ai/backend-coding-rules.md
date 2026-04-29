# AI Backend Coding Rules

## Purpose

This document defines the **coding rules that AI tools must follow when generating backend code**.

It is designed to guide AI assistants such as:

- GitHub Copilot
- Cursor AI
- Claude Code

The goal is to ensure that generated code:

- follows the project architecture
- respects separation of concerns
- remains consistent across the codebase

AI tools must treat this document as **a strict guideline when generating code**.

---

# Project Context

Before generating backend code, AI tools must consider the following project documentation:

docs/product/vision.md  
docs/product/features.md  
docs/domain/domain-model.md  
docs/architecture/database-model.md  
docs/architecture/backend-architecture.md  

These documents define:

- the business domain
- database schema
- architectural rules

Generated code must always align with them.

---

# Technology Stack

All backend code must follow this stack:

Runtime: Node.js  
Language: TypeScript  
Framework: Express  
ORM: Sequelize  
Database: PostgreSQL  

Do not introduce other frameworks unless explicitly requested.

Examples of **disallowed technologies**:

- NestJS
- Prisma
- TypeORM
- Fastify

---

# Backend Architecture Layers

The backend follows a **layered architecture**.

Layers:

Controller  
Service  
Repository  
Model  
DTO  

Each layer has strict responsibilities.

---

# Controller Rules

Controllers are responsible only for HTTP handling.

Controllers must:

- parse request data
- call services
- return HTTP responses

Controllers must NOT:

- access Sequelize models
- contain business logic
- execute SQL queries
- access repositories directly

Correct flow:

HTTP Request  
→ Controller  
→ Service  

Example pattern:

```ts
export const createExpense = async (req, res) => {

  const data = req.body

  const result = await expenseService.createExpense(data)

  return res.status(201).json(result)

}
Service Rules

Services contain business logic.

Services must:

validate business rules

orchestrate repositories

perform domain operations

Services must NOT:

use Express request or response objects

handle HTTP responses

directly manipulate database queries

Correct flow:

Controller
→ Service
→ Repository

Example:

async createExpense(data: CreateExpenseDTO) {

  const expense = await expenseRepository.create(data)

  return expense

}
Repository Rules

Repositories handle database access.

Repositories must:

use Sequelize models

perform database queries

handle persistence operations

Repositories must NOT:

contain business logic

handle HTTP requests

Example pattern:

async create(data: CreateExpenseDTO) {

  return ExpenseModel.create(data)

}
Model Rules

Models represent database tables.

Models must match the schema defined in:

docs/architecture/database-model.md

Example model structure:

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

fields

data types

associations

DTO Rules

DTOs define the structure of input data.

DTOs must:

define request payload types

be used by services and controllers

Example DTO:

export interface CreateExpenseDTO {

  familyId: string
  monthId: string
  categoryId: string
  value: number
  description?: string

}

DTO naming pattern:

Create<Entity>DTO
Update<Entity>DTO

Examples:

CreateExpenseDTO
CreateMonthlyIncomeDTO

Naming Conventions

Naming must follow these rules.

Functions:

createExpense
updateExpense
deleteExpense
findExpensesByMonth

Services:

expenseService
incomeService

Repositories:

expenseRepository

Files:

expense.controller.ts
expense.service.ts
expense.repository.ts

Folder Structure

Backend code must follow this structure:

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

src/controllers/expense.controller.ts
src/services/expense.service.ts
src/repositories/expense.repository.ts

AI tools must not create alternative folder structures.

Error Handling

Use centralized error handling.

Controllers should throw errors or pass them to middleware.

Standard error response:

{
  "error": "ValidationError",
  "message": "Invalid input data"
}
Validation

Input validation should occur before service execution.

Possible validation libraries:

Zod
Joi

Example validation flow:

Route
→ Validation middleware
→ Controller

Database Rules

Database operations must follow the schema defined in:

docs/architecture/database-model.md

Important constraints:

use UUID primary keys

respect foreign key relationships

follow table naming conventions

Never create database structures outside the documented schema.

AI Guardrails

AI tools generating backend code must follow these rules:

Do not access Sequelize models inside controllers

Business logic must be inside services

Database queries must be inside repositories

Do not introduce new architectural layers

Follow the folder structure defined in the backend architecture

Always align with the domain model

docs/domain/domain-model.md

Expected Backend Flow

Standard flow for new features:

Route
→ Controller
→ Service
→ Repository
→ Sequelize Model
→ PostgreSQL

Summary

Architecture:

Controller
Service
Repository
Model
DTO

Stack:

Node.js
TypeScript
Express
Sequelize
PostgreSQL

Key principle:

Strict separation of responsibilities.