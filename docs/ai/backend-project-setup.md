# AI Backend Project Setup Guide

## Purpose

This document explains how AI assistants should work with the backend in the current repository.

It defines:

- the monorepo entrypoint
- backend package boundaries
- dependency management rules
- backend runtime and build expectations
- folder placement for new backend code

AI tools must follow this document when creating or changing backend code.

---

# Current Repository Context

The project is an npm workspaces monorepo.

- repository root owns the workspaces configuration
- `backend/` is one workspace
- `frontend/` is one workspace
- installation must happen from the repository root

Do not reinitialize the backend as a standalone repository.

Do not add a second package manager.

---

# Technology Stack

The backend uses:

- Node.js
- TypeScript
- Express
- Sequelize
- PostgreSQL
- dotenv

Do not introduce alternative backend frameworks unless explicitly requested.

Disallowed by default:

- NestJS
- Prisma
- TypeORM
- Fastify

---

# Workspace Setup Rules

## Root Install Command

Use the repository root for installation:

```bash
npm install
```

If a new backend dependency is needed, prefer one of these commands from the repository root:

```bash
npm install <package> --workspace backend
npm install -D <package> --workspace backend
```

## Root Scripts

Important root commands:

```bash
npm run dev:backend
npm run build:backend
npm run build
```

## Backend Local Scripts

The backend workspace keeps its own package scripts in `backend/package.json` for internal build and dev commands.

---

# Backend Folder Structure

Backend code must live under `backend/`.

```text
backend/
├ package.json
├ tsconfig.json
├ src/
│ ├ app.ts
│ ├ server.ts
│ ├ config/
│ ├ controllers/
│ ├ database/
│ ├ dtos/
│ ├ middlewares/
│ ├ models/
│ ├ repositories/
│ ├ routes/
│ ├ services/
│ └ utils/
└ dist/
```

Use this placement rule:

- HTTP boundary code in `controllers/`
- business logic in `services/`
- persistence logic in `repositories/`
- Sequelize table models in `models/`
- route registration in `routes/`
- DTOs in `dtos/`
- database bootstrap and migrations in `database/`

Business logic must not be implemented in controllers or Sequelize models.

---

# Backend Bootstrapping Expectations

## Express App

Main application file:

`backend/src/app.ts`

Purpose:

- configure middleware
- register routes
- export the Express app

## HTTP Server

Server bootstrap file:

`backend/src/server.ts`

Purpose:

- load environment configuration
- start the HTTP server

## Environment Variables

Backend environment variables are currently stored in `backend/.env`.

Typical variables include:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

Use `dotenv` consistently with the current backend bootstrap.

## Database Migrations

Migrations must live in `backend/src/database/migrations`.

Sequelize CLI may be used to manage migrations.

---

# Data and Model Rules

- Sequelize models represent database tables only
- schema must follow `docs/architecture/database-model.md`
- business invariants must live in services and use-cases, not in controllers
- repository methods should isolate ORM details from the rest of the application

---

# AI Assistant Rules

When implementing backend changes, AI assistants must:

- work inside `backend/`, not at the repository root, except for workspace configuration
- install backend dependencies through the root workspace command
- preserve the layered backend structure
- respect the domain model in `docs/domain/`
- keep business logic out of controllers
- keep Sequelize models focused on persistence structure

If setup guidance conflicts with the actual repository layout, follow the monorepo layout and update documentation accordingly.