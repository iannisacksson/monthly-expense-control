# Project Structure — Backend

## Purpose

This document defines the folder structure of the backend project.

The goal is to ensure:

- consistent project organization
- predictable file placement
- easier AI-assisted code generation
- maintainable architecture

All backend code must follow this structure.

---

# Backend Root Structure


backend/

src/
controllers/
services/
repositories/
models/
routes/
dtos/
database/
config/
middlewares/
utils/

app.ts
server.ts


---

# Folder Responsibilities

## controllers

Location:


src/controllers


Purpose:

Handle HTTP requests and responses.

Responsibilities:

- receive requests
- validate DTOs
- call services
- return responses

Controllers must NOT contain business logic.

Example:


expense.controller.ts
user.controller.ts


---

## services

Location:


src/services


Purpose:

Implement business logic.

Responsibilities:

- enforce domain rules
- coordinate repositories
- trigger domain events

Services must not access the database directly.

They must use repositories.

Example:


expense.service.ts
user.service.ts


---

## repositories

Location:


src/repositories


Purpose:

Encapsulate persistence logic.

Responsibilities:

- database queries
- interaction with Sequelize models
- data retrieval and persistence

Repositories isolate the ORM from the rest of the system.

Example:


expense.repository.ts
user.repository.ts


---

## models

Location:


src/models


Purpose:

Define Sequelize models representing database tables.

Models must follow the schema defined in:

docs/architecture/database-model.md

Example:


expense.model.ts
user.model.ts


---

## routes

Location:


src/routes


Purpose:

Define Express routes and map endpoints to controllers.

Example:


expense.routes.ts
user.routes.ts


---

## dtos

Location:


src/dtos


Purpose:

Define Data Transfer Objects used by controllers.

DTOs define the shape of requests and responses.

They must follow:

docs/architecture/dto-spec.md

Example:


create-expense.dto.ts
update-expense.dto.ts


---

## database

Location:


src/database


Purpose:

Database initialization and Sequelize configuration.

Example:


sequelize.ts


---

## config

Location:


src/config


Purpose:

Application configuration.

Example:


database.config.ts
app.config.ts


---

## middlewares

Location:


src/middlewares


Purpose:

Express middleware functions.

Example:


error-handler.middleware.ts
auth.middleware.ts


---

## utils

Location:


src/utils


Purpose:

Utility functions shared across the backend.

Example:


date.utils.ts
validation.utils.ts


---

# Application Entry Points

## app.ts

Purpose:

Configure the Express application.

Responsibilities:

- register middlewares
- register routes
- configure error handling

---

## server.ts

Purpose:

Start the HTTP server.

Responsibilities:

- initialize app
- connect to database
- start listening on a port

---

# Expected Backend Structure

Example:


backend/

src/

controllers/
expense.controller.ts
user.controller.ts

services/
expense.service.ts
user.service.ts

repositories/
expense.repository.ts
user.repository.ts

models/
expense.model.ts
user.model.ts

routes/
expense.routes.ts
user.routes.ts

dtos/
create-expense.dto.ts
update-expense.dto.ts

database/
sequelize.ts

config/
database.config.ts

middlewares/
error-handler.middleware.ts

utils/
date.utils.ts

app.ts
server.ts


---

# AI Development Rules

When generating backend code, AI tools must:

1. place files in the correct folders
2. respect layer responsibilities
3. follow backend-architecture.md
4. follow repository-pattern.md

AI tools must not introduce new folder structures unless explicitly approved.

---

# Related Documents

docs/architecture/backend-architecture.md  
docs/architecture/database-model.md  
docs/architecture/repository-pattern.md  
docs/architecture/dto-spec.md  
docs/ai/backend-coding-rules.md