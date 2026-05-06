# Project Structure

## Purpose

This document defines the current repository structure.

The goals are:

- make the monorepo layout explicit
- show where backend and frontend code live
- preserve predictable file placement
- keep AI-assisted changes aligned with the real project shape

All code changes must follow this repository layout.

---

# Repository Layout

The project is an npm workspaces monorepo rooted at the repository root.

Current top-level structure:

```text
/
├ package.json
├ package-lock.json
├ backend/
├ frontend/
├ docs/
└ .github/
```

## Root Responsibilities

The repository root is responsible for:

- npm workspaces configuration
- shared install entrypoint through `npm install`
- root scripts for backend and frontend
- shared Git repository and ignore rules
- cross-project documentation in `docs/`

Current root scripts live in the root `package.json` and include:

- `npm run dev:backend`
- `npm run dev:frontend`
- `npm run build`
- `npm run build:backend`
- `npm run build:frontend`
- `npm run lint:frontend`
- `npm run test:backend`
- `npm run verify:backend`

Repository automation now also includes:

- `.github/workflows/backend-quality.yml` for backend CI
- `docker-compose.test.yml` for local PostgreSQL test setup

---

# Backend Structure

The backend application lives in `backend/`.

```text
backend/
├ package.json
├ README.md
├ .env.example
├ .env.test.example
├ Dockerfile
├ tsconfig.json
├ tests/
├ src/
│ ├ app.ts
│ ├ server.ts
│ ├ config/
│ │ ├ auth.config.ts
│ │ ├ observability.config.ts
│ │ └ security.config.ts
│ ├ controllers/
│ ├ database/
│ ├ dtos/
│ ├ middlewares/
│ ├ models/
│ ├ repositories/
│ ├ routes/
│ ├ services/
│ ├ types/
│ └ utils/
└ dist/
```

## Backend Folder Responsibilities

### controllers

Location: `backend/src/controllers`

Purpose: handle HTTP requests and responses.

Responsibilities:

- receive requests
- validate DTO shape at the boundary when needed
- call services
- return HTTP responses

Controllers must not contain business logic.

### services

Location: `backend/src/services`

Purpose: implement business logic and application rules.

Responsibilities:

- enforce domain rules
- coordinate repositories
- validate invariants
- orchestrate mutations and reads

### repositories

Location: `backend/src/repositories`

Purpose: encapsulate persistence logic.

Responsibilities:

- query the database
- interact with Sequelize models
- isolate persistence concerns from services

Security-related persistence such as authenticated sessions and auth audit logs also belongs here.

### models

Location: `backend/src/models`

Purpose: define Sequelize models representing database tables only.

Models must follow `docs/architecture/database-model.md` and must not contain business logic.

Examples now include domain tables plus security tables such as `auth_sessions` and `auth_audit_logs`.

### routes

Location: `backend/src/routes`

Purpose: register Express endpoints and map them to controllers.

### dtos

Location: `backend/src/dtos`

Purpose: define request and response contracts used at the application boundary.

### database

Location: `backend/src/database`

Purpose: database connection, migrations, and persistence bootstrap.

For test execution, migrations are applied to a dedicated PostgreSQL test database before running the backend integration suite.

### config

Location: `backend/src/config`

Purpose: application and infrastructure configuration.

Examples include auth cookie/session configuration and HTTP security configuration.

Operational observability configuration such as application name, log level, and metrics toggles also belongs here.

### middlewares

Location: `backend/src/middlewares`

Purpose: Express middleware functions.

Examples include authentication, rate limiting, and other HTTP boundary protections.

Operational middleware such as request logging and centralized error handling belongs here as well.

### utils

Location: `backend/src/utils`

Purpose: small shared utilities that do not belong to a domain service.

Examples include request metadata extraction and auth cookie helpers.

Shared operational utilities such as the backend logger and Prometheus metrics registry also live here.

### tests

Location: `backend/tests`

Purpose: backend automated quality gate.

Responsibilities:

- integration tests for critical HTTP and domain flows
- shared setup for the PostgreSQL test database
- reusable helpers for authenticated request flows

Operational endpoints should also receive focused automated coverage when the observability surface changes.

---

# Frontend Structure

The frontend application lives in `frontend/`.

```text
frontend/
├ package.json
├ vite.config.ts
├ src/
│ ├ App.tsx
│ ├ main.tsx
│ ├ assets/
│ ├ components/
│ ├ config/
│ ├ hooks/
│ ├ layouts/
│ ├ pages/
│ ├ routes/
│ ├ services/
│ ├ store/
│ ├ styles/
│ ├ types/
│ └ utils/
└ public/
```

Frontend-specific responsibilities are documented in `docs/architecture/frontend/architecture.md`.

---

# Documentation Structure

Cross-project documentation lives in `docs/`.

Key areas:

- `docs/domain/`: domain rules and model
- `docs/architecture/`: technical architecture and contracts
- `docs/product/`: product direction
- `docs/adr/`: architecture decisions
- `docs/ai/`: AI-oriented implementation guidance

Documentation must distinguish between:

- current implemented state
- transition state where legacy compatibility still exists
- target architecture or product direction