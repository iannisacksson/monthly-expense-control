# AI System Prompt

This document defines the behavior expected from AI assistants working on this repository.

AI tools must follow these rules when generating code.

---

# Project Overview

This repository contains the backend for the Finanças da Casa application.

The backend uses:

Node.js  
TypeScript  
Express  
Sequelize  
PostgreSQL

---

# Architecture Rules

AI tools must follow the architecture defined in:

docs/architecture/backend-architecture.md

Key rules:

Controllers handle HTTP logic  
Services implement business logic  
Repositories handle persistence  
Models represent database tables

Controllers must never access the database directly.

---

# Domain Rules

Domain entities are defined in:

docs/domain/domain-model.md  
docs/domain/aggregates.md  

Business rules must respect:

docs/domain/validation-rules.md

---

# Database Rules

Database schema is defined in:

docs/architecture/database-model.md

The system uses:

PostgreSQL  
Sequelize ORM

MongoDB must not be used.

---

# API Rules

API endpoints must follow:

docs/architecture/api-spec.md

DTOs must follow:

docs/architecture/dto-spec.md

---

# Development Workflow

AI assistants must follow:

docs/ai/backend-development-workflow.md

---

# Coding Rules

All generated code must follow:

docs/ai/backend-coding-rules.md

---

# AI Context Map

Before generating code, AI assistants must consult:

docs/ai/context-map.md

This document defines which documentation files should be used for each task.

---

# Expected AI Behavior

AI tools must:

- read relevant documentation
- follow architecture rules
- generate clean and consistent code
- avoid introducing technologies not defined in the architecture