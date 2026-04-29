# Repository Pattern

## Purpose

This document defines how the repository pattern must be implemented in the backend.

Repositories are responsible for **data persistence and database interaction**.

They isolate database logic from business logic.

AI assistants must follow this pattern when generating:

- repositories
- service layer
- database interactions

This document complements:

docs/architecture/backend-architecture.md  
docs/architecture/database-model.md  
docs/domain/aggregates.md

---

# Architecture Layers

The backend follows a layered architecture.

Controller Layer  
Service Layer  
Repository Layer  
Database Layer

Responsibilities:

Controllers → handle HTTP requests and responses  
Services → implement business logic  
Repositories → interact with the database

Services must **never access Sequelize models directly**.

All database access must go through repositories.

---

# Repository Responsibilities

Repositories are responsible for:

- creating database records
- retrieving data
- updating records
- deleting records

Repositories must not implement business logic.

They only handle persistence.

---

# Repository Location

Repositories must be stored in:


src/repositories


Example:


src/repositories/account.repository.ts
src/repositories/expense.repository.ts
src/repositories/income.repository.ts


---

# Repository Interface Design

Each repository should expose methods required by the service layer.

Example interface:


create
findById
findAll
update
delete


Additional methods may be added when needed.

---

# Example Repository Interface

Example for Account repository:


createAccount(data)
findAccountById(id)
listAccounts()
updateAccount(id, data)
deleteAccount(id)


Repositories must return domain objects compatible with:

docs/domain/domain-model.md

---

# Sequelize Implementation

Repositories must use Sequelize models defined in:

docs/architecture/database-model.md

Example structure:


repositories
account.repository.ts
models
account.model.ts


Repositories should import Sequelize models and perform queries.

Services must not interact with Sequelize directly.

---

# Example Repository Structure

Example implementation pattern:


import { AccountModel } from "../models/account.model"

export class AccountRepository {

async create(data) {
return AccountModel.create(data)
}

async findById(id) {
return AccountModel.findByPk(id)
}

async findAll() {
return AccountModel.findAll()
}

async update(id, data) {
const account = await AccountModel.findByPk(id)
return account.update(data)
}

async delete(id) {
const account = await AccountModel.findByPk(id)
return account.destroy()
}

}


---

# Service Interaction

Services must use repositories to interact with the database.

Example flow:

Controller  
→ Service  
→ Repository  
→ Database

Example:


AccountController
→ AccountService
→ AccountRepository
→ Sequelize
→ PostgreSQL


---

# Business Logic Location

Business rules must exist in the service layer.

Repositories must not:

- validate business rules
- coordinate aggregates
- trigger domain events

These responsibilities belong to services.

---

# AI Usage Instructions

When generating backend code, AI assistants must:

1. create repository classes for each aggregate root
2. use Sequelize models inside repositories
3. call repositories from services
4. avoid database logic inside controllers or services

Repositories must focus strictly on **data persistence**.

---

# Expected Result

Using this pattern, AI tools should generate:

- clean service layer
- reusable repositories
- maintainable database access

aligned with the architecture defined in this project.