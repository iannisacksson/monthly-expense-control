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

## Notes

- keep `.env.test` local only; do not commit secrets
- use `backend/.env.example` and `backend/.env.test.example` as templates only
- run migrations separately for the target environment before serving production traffic