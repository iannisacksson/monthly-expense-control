# Repository Pattern

## Purpose

This document defines how the repository pattern must be implemented in the backend.

Repositories are responsible for **data persistence and database interaction**.

They isolate database logic from business logic.

AI assistants must follow this pattern when generating:

- repositories
- application layer persistence access
- database interactions

This document complements:

docs/architecture/backend-architecture.md  
docs/architecture/database-model.md  
docs/domain/aggregates.md

---

# Architecture Layers

The backend now uses a Clean Architecture inspired separation.

Interfaces Layer  
Application Layer  
Domain Layer  
Infrastructure Layer

Responsibilities:

Controllers → handle HTTP requests and responses  
Use cases → orchestrate application behavior  
Domain → hold pure business rules  
Repositories → interact with the database

Application use cases and domain code must **never access Sequelize models directly**.

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

Current physical location:


src/repositories


Architectural role:

- repositories are infrastructure adapters used by the application layer
- the physical location may remain `src/repositories` during migration, but their responsibility is infrastructure, not domain


Example:


src/repositories/account.repository.ts
src/repositories/expense.repository.ts
src/repositories/income.repository.ts


---

# Repository Interface Design

Each repository should expose methods required by the application layer.

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

Application use cases and domain code must not interact with Sequelize directly.

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

# Application Interaction

Application use cases and supporting services must use repositories to interact with the database.

Example flow:

Controller  
→ Use Case  
→ Repository  
→ Database

Example:


AccountController
→ CreateAccountUseCase
→ AccountRepository
→ Sequelize
→ PostgreSQL


---

# Business Logic Location

Business rules must exist in the application layer or domain layer.

Repositories must not:

- validate business rules
- coordinate aggregates
- trigger domain events

These responsibilities belong to the application layer and pure domain code, not to repositories.

---

# AI Usage Instructions

When generating backend code, AI assistants must:

1. create repository classes for each aggregate root
2. use Sequelize models inside repositories
3. call repositories from application use cases or supporting orchestration services
4. avoid database logic inside controllers, use cases, and domain entities

Repositories must focus strictly on **data persistence**.

---

# Expected Result

Using this pattern, AI tools should generate:

- clean service layer
- reusable repositories
- maintainable database access

aligned with the architecture defined in this project.