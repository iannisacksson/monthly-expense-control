# Prompt Engineering Guide

## Purpose

This document explains the prompt engineering techniques used in this project.

The repository is designed to be **AI-friendly** so that AI assistants can generate high quality backend code.

AI tools should consult this guide to understand how documentation is structured.

---

# AI Documentation Strategy

The documentation follows a layered structure:

Product Layer  
Domain Layer  
Architecture Layer  
AI Guidance Layer

This structure helps AI assistants navigate the project context.

# Documentation Precedence

Not all documents have the same authority.

If two documents conflict, AI assistants must use this priority order:

1. docs/product/vision.md
2. docs/domain/domain-model.md and other docs/domain/*
3. docs/architecture/api-spec.md and docs/architecture/dto-spec.md
4. docs/product/features.md
5. other supporting AI guidance documents

Why this order exists:

- the vision defines the real product direction
- the domain defines the business model
- the architecture and API define the actual contract
- product feature summaries are supporting documents and may lag behind implementation

---

# Prompt Engineering Techniques Used

## 1 Context Anchoring

Each task references specific documents.

Example:

- backend-project-setup.md
- backend-architecture.md
- database-model.md

This ensures the AI uses the correct context.

---

## 2 Task Routing (Context Map)

The project uses a context map:

docs/ai/context-map.md

It defines which documents must be used for each task.

Example:

Backend setup → backend-project-setup.md  
Database modeling → database-model.md  
Domain logic → aggregates.md

---

## 3 Domain Driven Prompting

Domain concepts are defined using:

- domain-model.md
- aggregates.md
- events.md

This allows AI assistants to generate domain logic aligned with the business model.

---

## 4 Step-by-Step Generation

Complex tasks are broken into steps.

Example:

1. create package.json
2. configure TypeScript
3. configure Express
4. configure Sequelize

This improves reliability of generated code.

---

## 5 Constraint Prompting

The technology stack is explicitly defined.

Example:

Node.js  
TypeScript  
Express  
Sequelize  
PostgreSQL

AI assistants must not introduce alternative frameworks.

---

## 6 Architecture Anchoring

The architecture is defined before implementation.

Example documents:

backend-architecture.md  
database-model.md

This prevents AI from inventing project structures.

---

# Expected AI Behavior

AI assistants should:

1. consult documentation before generating code
2. follow the defined architecture
3. respect domain boundaries
4. implement business rules defined in aggregates
5. trigger domain events when required

## 7 Source Priority Prompting

Prompts must explicitly declare which documents win in case of conflict.

Recommended wording:

If documentation conflicts, follow this order:
1. docs/product/vision.md
2. docs/domain/*
3. docs/architecture/api-spec.md and docs/architecture/dto-spec.md
4. docs/product/features.md

This prevents the AI from generating outdated account-based solutions when the real product is family-based and month-based.