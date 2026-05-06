# ADR-007 — Backend Operational Observability Baseline

## Status

Accepted

## Date

2026-04-30

---

## Context

The backend already had authentication hardening and automated quality gates, but its runtime operational surface remained too weak for production use.

Observed gaps:

- backend startup used raw `console.log`
- there was no shared structured logger
- there was no centralized fallback error handler for operational failures
- the only health endpoint was a shallow `GET /health` returning `{ "status": "ok" }`
- there was no readiness check, no database reachability check, and no metrics endpoint
- operational guidance for logging, backup and restore, retention, and incidents was missing or incomplete

The project needs a minimum useful baseline without introducing ornamental complexity or unnecessary vendor lock-in.

## Decision

The backend adopts a minimal observability and readiness baseline composed of:

1. `pino` as the shared structured logger.
2. Centralized request completion logging with request IDs.
3. A centralized fallback HTTP error handler for middleware and unexpected operational failures.
4. Public operational endpoints:
   - `GET /api/v1/live`
   - `GET /api/v1/ready`
   - `GET /api/v1/health`
   - `GET /api/v1/metrics`
5. Readiness verification backed by the configured Sequelize/PostgreSQL connection.
6. Prometheus/OpenMetrics exposure through `prom-client`.
7. Operational documentation for logging, metrics, backup/restore guidance, retention, and incident response.

## Rationale

- `pino` provides structured JSON logging with low overhead and no platform lock-in.
- request IDs improve correlation across auth, readiness, and unexpected runtime failures.
- readiness should reflect database availability because the backend is not useful without PostgreSQL.
- Prometheus/OpenMetrics offers a simple, portable metrics baseline without requiring a vendor choice now.
- documenting backup, restore, retention, and incidents is necessary even when automation is deferred to infrastructure.

## Consequences

- backend operational logs should be consumed by infrastructure stdout/stderr collectors
- production environments should protect `/metrics` through network or proxy controls when needed
- future error tracking or tracing integrations should extend this baseline rather than replace it with ad hoc logging
- exact alerting policy, retention window, backup cadence, and restore ownership remain infrastructure decisions that must be finalized before production launch

## Related Documents

- docs/architecture/backend-architecture.md
- docs/architecture/api-spec.md
- docs/architecture/backend-operations.md
- backend/README.md