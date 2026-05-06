# Backend Operations Baseline

## Purpose

This document describes the minimum operational baseline currently implemented in the backend.

It covers:

- structured logging
- health, liveness, and readiness endpoints
- metrics exposure
- backup and restore guidance
- log retention guidance
- minimum incident response workflow

This file is descriptive of the current baseline and should stay aligned with the running code.

## Structured logging

The backend uses `pino` through `backend/src/utils/logger.ts`.

Current behavior:

- startup logs are emitted as structured JSON
- request completion is logged centrally by `backend/src/middlewares/request-logger.middleware.ts`
- middleware and operational failures are logged by the centralized error handler
- a request identifier is propagated through the `x-request-id` response header
- sensitive fields such as cookies, tokens, and password values are redacted before output

Recommended operational use:

- ship stdout/stderr to the platform log collector instead of writing local application log files
- index logs by `service`, `env`, `requestId`, status code, and route
- use request IDs when correlating auth failures, 5xx responses, and database readiness failures

## Operational endpoints

### GET /api/v1/live

Use for container or process liveness.

It verifies that the process is running and returns uptime metadata.

### GET /api/v1/ready

Use for readiness and deployment health checks.

It verifies that the backend can reach PostgreSQL through the configured Sequelize connection.

If the database check fails, the endpoint returns `503 Service Unavailable`.

### GET /api/v1/health

Use for a simple aggregate health summary.

It combines liveness metadata with the readiness checks.

### GET /api/v1/metrics

Use for Prometheus or compatible OpenMetrics scraping.

Current metrics baseline includes:

- default process metrics from `prom-client`
- centralized HTTP request count
- centralized HTTP request duration histogram

## Error handling baseline

The backend now includes a centralized fallback error handler in `backend/src/middlewares/error-handler.middleware.ts`.

Current scope:

- auth middleware failures
- CORS boundary failures
- JSON parsing or other middleware-originated request failures
- unexpected operational exceptions that reach the Express error pipeline

This baseline does not yet normalize every controller-specific `try/catch` branch into a single global strategy. That remains a future simplification path.

## Backup and restore guidance

Backup and restore are not performed by the application process itself.

Current operational directive:

- run PostgreSQL backups from the infrastructure layer
- define destination, cadence, encryption, and access control in the deployment environment
- verify restore regularly in a non-production environment before public launch
- document the restore operator, last successful backup, and last successful restore drill outside the application runtime

The application currently provides readiness checks only; it does not automate backups or restore execution.

## Log retention guidance

Retention is infrastructure-defined and is not enforced by the backend runtime.

Minimum guidance:

- retain structured application logs in centralized storage
- ensure retention is long enough to investigate authentication issues, financial mutation failures, and production incidents
- define the exact retention window before production go-live according to infrastructure and compliance needs

## Incident response baseline

Minimum incident workflow:

1. Detect through readiness failure, metrics, log anomalies, or user reports.
2. Identify affected routes, time window, and whether the issue is isolated to the backend, database, or deployment edge.
3. Mitigate by reducing traffic, rolling back the last change, or restoring infrastructure dependencies.
4. Validate recovery using `/api/v1/live`, `/api/v1/ready`, `/api/v1/health`, and core authenticated flows.
5. Record the incident cause, impact, mitigation, and follow-up actions in the team operating log.

## Remaining limitations

- no vendor-backed error tracking is configured yet
- no distributed tracing is configured yet
- alert routing remains infrastructure-defined and documented outside the application runtime
- backup cadence, retention duration, and restore ownership still need explicit infrastructure values before production go-live