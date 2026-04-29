# AI Task Templates

## Purpose

This document defines reusable prompts for common backend development tasks.

These prompts help AI assistants generate consistent code.

AI tools should use the context defined in:

docs/ai/context-map.md

before executing these tasks.

---

# Generate Controller

Prompt:

Generate a controller for the resource defined in docs/architecture/api-spec.md.

Requirements:

- follow backend architecture
- use DTOs defined in dto-spec.md
- call the appropriate service
- keep controller logic minimal

Expected output:


src/controllers/<resource>.controller.ts


---

# Generate Service

Prompt:

Generate a service that implements the business logic for the resource.

Requirements:

- follow domain aggregates
- enforce validation rules
- coordinate repositories
- trigger domain events when required

Expected output:


src/services/<resource>.service.ts


---

# Generate Repository

Prompt:

Generate a repository that handles database access using Sequelize.

Requirements:

- follow repository-pattern.md
- use models defined in database-model.md
- implement CRUD methods

Expected output:


src/repositories/<resource>.repository.ts


---

# Generate Sequelize Model

Prompt:

Generate a Sequelize model based on the database schema.

Requirements:

- follow database-model.md
- use Sequelize data types
- map fields to the database schema

Expected output:


src/models/<resource>.model.ts


---

# Generate Migration

Prompt:

Generate a Sequelize migration based on the database schema.

Requirements:

- follow database-model.md
- create or update the table structure

Expected output:


src/database/migrations/<migration>.ts


---

# Generate API Route

Prompt:

Generate Express routes for the resource.

Requirements:

- follow api-spec.md
- connect routes to controllers

Expected output:


src/routes/<resource>.routes.ts


---

# Expected Result

Using these templates, AI assistants should be able to generate:

- controllers
- services
- repositories
- models
- migrations
- routes