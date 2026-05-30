# Backend

## Purpose

This workspace contains the Express + TypeScript backend for the monthly expense control application.

## Default commands

Run these commands from the repository root:

```bash
npm install
npm run dev:backend
npm run build:backend
npm run test:backend
```

## Test database setup

The backend test suite uses PostgreSQL and is designed to run against a dedicated test database.

### Local setup

1. Start the PostgreSQL test container:

```bash
docker compose -f docker-compose.test.yml up -d
```

2. Create a local test env file from the example:

```bash
cp backend/.env.test.example backend/.env.test
```

3. Apply migrations to the test database:

```bash
cd backend && npm run test:db:migrate
```

4. Run the backend tests:

```bash
cd backend && npm run test
```

### Test taxonomy

The backend test suite is organized by level:

- `tests/unit/domain` for pure domain and value-object behavior
- `tests/integration/http` for full HTTP integration tests with Supertest and PostgreSQL
- `tests/shared` for reusable helpers

If the local test schema drifts from the current migrations, reapply the test migrations before trusting the suite:

```bash
cd backend && npm run test:db:migrate
```

## Mandatory quality gate

Automated backend tests are mandatory for every new backend feature, backend bug fix, and behavior-changing refactor.

At minimum, any backend change must:

- update or add automated tests for the affected behavior
- keep the backend build passing
- keep the backend test suite passing
- keep the documentation aligned when contracts or setup change

Changes that modify business rules without corresponding automated coverage should be treated as incomplete.

## CI

GitHub Actions runs the backend quality workflow defined in `.github/workflows/backend-quality.yml`.

The workflow:

- installs dependencies
- provisions PostgreSQL for tests
- runs backend migrations for the test database
- builds the backend
- runs the backend integration suite

## Container image

A baseline production image can be built with:

```bash
docker build -f backend/Dockerfile .
```

This image builds the backend workspace and runs `node dist/server.js`.

## Operational observability

The backend exposes a minimal operational surface for production readiness.

### Structured logging

- all backend operational logs use the shared Pino logger in `src/utils/logger.ts`
- each request receives an `x-request-id` response header and a matching structured completion log
- cookies, tokens, and password-like fields are redacted from log output

### Operational endpoints

- `GET /api/v1/live` — process liveness
- `GET /api/v1/ready` — readiness including database connectivity
- `GET /api/v1/health` — aggregate operational summary
- `GET /api/v1/metrics` — Prometheus/OpenMetrics metrics output

### Environment variables

- `APP_NAME` — optional service name override for logs and metrics labels
- `LOG_LEVEL` — optional log level override
- `METRICS_ENABLED` — set to `false` to disable Prometheus metrics collection

### Operations guide

See `docs/architecture/backend-operations.md` for logging, metrics, backup/restore guidance, retention considerations, and incident response baseline.

## Notes

- keep `.env.test` local only; do not commit secrets
- use `backend/.env.example` and `backend/.env.test.example` as templates only
- run migrations separately for the target environment before serving production traffic

## Architecture summary

Current runtime direction:

- HTTP controllers and route entrypoints are exposed through `src/interfaces/http`
- explicit application actions live in `src/application/use-cases`
- rich entities and value objects live in `src/domain`
- repositories, models, and database setup remain infrastructure concerns

Legacy `src/controllers`, `src/routes`, and `src/services` still exist as compatibility surfaces around the new runtime flow.