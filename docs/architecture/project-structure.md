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
│ ├ integration/
│ │ └ http/
│ ├ shared/
│ │ └ helpers/
│ ├ setup/
│ └ unit/
│   └ domain/
├ src/
│ ├ app.ts
│ ├ server.ts
│ ├ application/
│ │ └ use-cases/
│ ├ domain/
│ │ ├ entities/
│ │ └ value-objects/
│ ├ config/
│ │ ├ auth.config.ts
│ │ ├ observability.config.ts
│ │ └ security.config.ts
│ ├ database/
│ ├ interfaces/
│ │ └ http/
│ │   ├ controllers/
│ │   └ routes/
│ ├ middlewares/
│ ├ models/
│ ├ repositories/
│ ├ controllers/
│ ├ dtos/
│ ├ routes/
│ ├ services/
│ ├ types/
│ └ utils/
└ dist/
```

## Backend Folder Responsibilities

### application/use-cases

Location: `backend/src/application/use-cases`

Purpose: explicit application actions.

Responsibilities:

- orchestrate use cases
- coordinate repositories and supporting services
- keep orchestration out of controllers

### domain

Location: `backend/src/domain`

Purpose: rich domain entities and domain-level reusable rules.

Responsibilities:

- hold pure business validations and invariants
- expose value objects and rich entities without HTTP or ORM dependencies

### interfaces/http

Location: `backend/src/interfaces/http`

Purpose: HTTP-facing boundary.

Responsibilities:

- expose pure action controllers used by routes
- centralize Express adapters used by routes
- compose the runtime route entrypoint

Controllers must not contain business logic.

Current pattern:

- one action per controller file, for example `backend/src/interfaces/http/controllers/month/create.controller.ts`
- each controller is a class implementing `IController<TReq, TRes>` from `http.types.ts`
- use cases are injected via the constructor
- HTTP status codes use the `HttpStatusCode` enum from `http-status-code.ts`
- shared Express adaptation in `backend/src/interfaces/http/express-route.adapter.ts`
- routes receive Express `req`/`res`, controllers do not
- `adaptExpressRoute` calls and controller instantiation live directly in the route file
- there must be no `index.ts` or aggregator files inside resource controller folders whose sole purpose is re-exporting

Anti-patterns that must not be introduced:

- `index.ts` files inside resource folders that only re-export action controllers
- `<resource>.controller.ts` files at the controllers root that only do `export * from "./<resource>"`
- hard-coded numeric HTTP status literals inside controllers or routes

### services

Location: `backend/src/services`

Purpose: compatibility support for orchestration that has not yet been fully absorbed by explicit use cases.

Responsibilities:

- preserve legacy orchestration that has not yet been fully absorbed by explicit use cases
- support current runtime behavior while the architecture migrates toward application + domain boundaries

### repositories

Location: `backend/src/repositories`

Purpose: encapsulate persistence logic.

Responsibilities:

- query the database
- interact with Sequelize models
- isolate persistence concerns from services

Security-related persistence such as authenticated sessions and auth audit logs also belongs here.

Architectural note:

- repositories are infrastructure adapters even though the physical folder remains `src/repositories`

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

- unit tests for pure domain and value-object behavior
- integration/http tests for critical HTTP and domain flows
- shared setup and reusable helpers for the PostgreSQL test database

Operational endpoints should also receive focused automated coverage when the observability surface changes.

Current taxonomy:

- `backend/tests/unit/domain`
- `backend/tests/integration/http`
- `backend/tests/shared`

### legacy compatibility folders

The following folders still exist during the architectural transition and are still used internally in runtime support:

- `backend/src/controllers`
- `backend/src/routes`
- `backend/src/services`

They should be treated as compatibility surfaces around the new explicit application and domain layers, not as the long-term primary architecture.

Current note:

- `backend/src/controllers` now acts primarily as a compatibility re-export surface to the new `interfaces/http/controllers` folders

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