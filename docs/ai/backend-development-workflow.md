# Backend Development Workflow (AI-Assisted)

## Purpose

This document defines the recommended workflow for developing backend features using AI assistants.

It ensures that generated code follows:

- project architecture
- domain rules
- database schema
- API specification

AI assistants must follow this workflow when generating backend code.

---

# Workflow Overview

Backend development should follow these steps:

1. Understand the feature
2. Review domain model
3. Generate database model
4. Generate repository
5. Generate service
6. Generate controller
7. Generate routes
8. Validate against API specification

Each step references specific documentation.

---

# Step 1 — Understand the Feature

Before generating code, AI tools must read:

docs/product/features.md

Goal:

Understand what capability the feature provides.

Example prompt:


Read docs/product/features.md and explain the feature to be implemented.


---

# Step 2 — Review Domain Model

AI assistants must consult:

docs/domain/domain-model.md  
docs/domain/aggregates.md  
docs/domain/events.md  

Goal:

Understand:

- domain entities
- aggregate boundaries
- domain events

Example prompt:


Review the domain model and aggregates before generating business logic.


---

# Step 3 — Review Database Schema

AI assistants must consult:

docs/architecture/database-model.md

Goal:

Ensure generated models match the database schema.

Example prompt:


Generate the Sequelize model following the schema defined in database-model.md.


Expected output:


src/models/<entity>.model.ts


---

# Step 4 — Generate Repository

AI assistants must consult:

docs/architecture/repository-pattern.md

Goal:

Create the repository responsible for database interaction.

Example prompt:


Generate the repository for the entity following repository-pattern.md.


Expected output:


src/repositories/<entity>.repository.ts


---

# Step 5 — Generate Service

AI assistants must consult:

docs/domain/aggregates.md  
docs/domain/events.md  
docs/domain/validation-rules.md  

Goal:

Implement business logic.

Services must:

- validate business rules
- coordinate aggregates
- trigger domain events

Example prompt:


Generate the service implementing the business logic for this entity.


Expected output:


src/services/<entity>.service.ts


---

# Step 6 — Generate Controller

AI assistants must consult:

docs/architecture/api-spec.md  
docs/architecture/dto-spec.md  

Goal:

Implement HTTP layer.

Controllers must:

- receive DTOs
- call services
- return responses

Example prompt:


Generate the controller following api-spec.md.


Expected output:


src/controllers/<entity>.controller.ts


---

# Step 7 — Generate Routes

AI assistants must consult:

docs/architecture/api-spec.md

Goal:

Expose endpoints defined in the API specification.

Example prompt:


Generate Express routes for the resource.


Expected output:


src/routes/<entity>.routes.ts


---

# Step 8 — Validate the Implementation

AI assistants must verify:

- architecture consistency
- DTO validation
- repository usage
- correct API endpoints

Documents to consult:

docs/architecture/backend-architecture.md  
docs/domain/validation-rules.md  
docs/architecture/api-spec.md  

Example prompt:


Review the generated code and ensure it follows the architecture and validation rules.


---

# Example Workflow for a New Resource

Example: Implement Expense feature.

Workflow:

1. Read features.md
2. Review Expense entity in domain-model.md
3. Generate Sequelize model
4. Generate ExpenseRepository
5. Generate ExpenseService
6. Generate ExpenseController
7. Generate routes
8. Validate against api-spec.md

---

# AI Usage Instructions

When generating backend features, AI assistants must:

1. follow this workflow
2. consult the appropriate documentation at each step
3. ensure generated code respects architecture rules

AI tools should not skip workflow steps.

---

# Expected Outcome

Using this workflow, AI assistants should generate:

- consistent backend structure
- clean separation of concerns
- domain-aligned business logic
- API endpoints matching the specification