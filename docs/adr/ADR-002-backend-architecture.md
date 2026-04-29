# ADR-002 — Backend Architecture

## Status

Accepted

---

# Context

The backend for the Finanças da Casa application needs to support:

- household financial tracking
- multiple financial entities (expenses, categories, users)
- scalable feature development
- AI-assisted development using tools such as Copilot

The architecture must provide:

- clear separation of concerns
- maintainable structure
- predictable code generation for AI assistants

Because the project uses AI-assisted development, the architecture must also be **easy for AI tools to understand and follow**.

---

# Decision

The backend will use a **layered architecture** with the following components:

Controller Layer  
Service Layer  
Repository Layer  
Database Layer

The backend stack will be:

Node.js  
TypeScript  
Express  
Sequelize ORM  
PostgreSQL database

---

# Architecture Overview

The backend will follow this structure:


src/

controllers/
services/
repositories/
models/
routes/
database/


Responsibilities:

Controllers  
Handle HTTP requests and responses.

Services  
Contain business logic.

Repositories  
Handle database access.

Models  
Define Sequelize models.

Routes  
Define Express endpoints.

Database  
Initialize Sequelize and database connection.

---

# Layer Responsibilities

## Controllers

Controllers must:

- receive HTTP requests
- validate DTOs
- call services
- return responses

Controllers must NOT:

- contain business logic
- access the database directly

---

## Services

Services implement business logic.

Responsibilities:

- validate domain rules
- coordinate repositories
- trigger domain events

Services must NOT:

- access Sequelize models directly

They must use repositories.

---

## Repositories

Repositories encapsulate persistence.

Responsibilities:

- query database
- map entities to models
- isolate ORM usage

This allows future changes to persistence technology without affecting business logic.

---

## Models

Models represent database tables using Sequelize.

They must:

- match the schema defined in database-model.md
- not contain business logic

---

# Database

The project will use:

PostgreSQL

Reasons:

- relational consistency
- strong transactional guarantees
- excellent support in Sequelize
- suitable for financial data

---

# Alternatives Considered

## MongoDB

Pros

- flexible schema
- fast prototyping

Cons

- weaker relational guarantees
- complex financial relationships
- joins handled at application level

Because financial data is highly relational, MongoDB was rejected.

---

## Direct SQL without ORM

Pros

- full SQL control
- maximum performance

Cons

- higher development cost
- harder for AI tools to generate consistently

Because the project relies on AI-assisted development, Sequelize was chosen.

---

# Consequences

Positive outcomes:

- predictable project structure
- easier onboarding
- better AI code generation
- strong separation of concerns

Negative outcomes:

- more boilerplate code
- slightly higher initial setup cost

---

# AI Development Implications

AI tools generating backend code must follow:

docs/architecture/backend-architecture.md  
docs/architecture/repository-pattern.md  
docs/architecture/api-spec.md  

AI-generated code must respect the defined layers.

Controllers must not access the database directly.

Repositories must encapsulate persistence logic.

---

# Related Documents

docs/architecture/backend-architecture.md  
docs/architecture/repository-pattern.md  
docs/architecture/database-model.md  
docs/domain/domain-model.md  
docs/ai/backend-coding-rules.md