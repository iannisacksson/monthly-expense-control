# ADR-005 — Cookie-Based Session Authentication Strategy

## Status

Accepted

## Date

2026-04-30

---

## Context

The application is a personal financial management product and must meet a higher production security baseline than the previous frontend-managed JWT bearer flow.

The previous approach stored the JWT in frontend-managed storage and relied on `Authorization: Bearer <token>` on every request. That design had several drawbacks for the current product stage:

- tokens were exposed to XSS through browser storage
- there was no server-side revocation for active sessions
- there was no rotating refresh flow
- logout depended on the client deleting the token locally
- the backend HTTP surface lacked aligned session auditing and abuse protection

The deployed topology is expected to use sibling subdomains for frontend and backend. The security model should therefore support credentialed cross-origin requests within the same site boundary while keeping tokens inaccessible to application JavaScript.

---

## Decision

The backend will use **short-lived JWT access tokens in HttpOnly cookies plus rotating refresh tokens backed by persisted server-side sessions**.

### Route structure

Authentication uses identity-based routes:

```text
POST   /api/v1/auth/register   — public, creates a user account
POST   /api/v1/auth/login      — public, validates credentials, creates session, sets auth cookies
POST   /api/v1/auth/refresh    — cookie-based, rotates refresh token and renews auth cookies
POST   /api/v1/auth/logout     — cookie-based, revokes the current session when available and clears auth cookies
GET    /api/v1/auth/me         — protected, returns the authenticated user
PUT    /api/v1/auth/me         — protected, updates name / email / password
DELETE /api/v1/auth/me         — protected, deletes the account and revokes all sessions
```

All other resource routes remain protected.

### Access token

- short-lived JWT
- stored only in an HttpOnly cookie
- payload: `{ id, email, sessionId }`
- signed with `ACCESS_TOKEN_SECRET`
- default lifetime: 15 minutes

### Refresh token

- opaque random token
- stored only in an HttpOnly cookie
- persisted server-side only as a SHA-256 hash
- default lifetime: 30 days
- rotated on every successful refresh

### Session persistence

Authenticated sessions are stored in `auth_sessions`.

Each session includes:

- user id
- hashed refresh token
- refresh expiration timestamp
- revocation timestamp
- last seen timestamp
- request metadata such as IP address and user agent

This enables:

- multi-session support per user
- per-session revocation
- logout invalidation on the server
- session invalidation after refresh expiry

### Middleware behavior

`src/middlewares/auth.middleware.ts` reads the access token from the cookie, verifies the JWT, confirms the referenced session is active, and sets:

```ts
req.user = { id, email, sessionId }
```

Controllers and services must continue resolving the authenticated user through `req.user.id`. User identity must never be accepted from request bodies for protected operations.

### Security controls

The authentication surface is hardened with:

- HttpOnly cookies
- environment-aware CORS allowlist with credentials support
- security headers via `helmet`
- rate limiting on login and refresh endpoints
- audit logging for authentication lifecycle events

### Audit trail

Authentication events are persisted in `auth_audit_logs`.

The initial event set includes:

- `login_succeeded`
- `login_failed`
- `refresh_succeeded`
- `refresh_failed`
- `logout_succeeded`
- `session_invalid`

---

## Rationale

- **Reduce token exposure**: HttpOnly cookies remove direct token access from frontend JavaScript.
- **Enable revocation**: persisted sessions allow immediate invalidation on logout and account deletion.
- **Fit the deployment model**: sibling subdomains can use credentialed requests with cookie-based auth.
- **Improve operational control**: audit logs and rate limiting make abusive or suspicious auth traffic more observable.
- **Preserve current ownership model**: services still derive the owner from authenticated request identity under the User + Month boundary.

---

## Consequences

- the frontend must use `withCredentials: true` and must not persist auth tokens in localStorage
- access token renewal now depends on the `/auth/refresh` endpoint
- the backend performs a session lookup during authenticated requests
- production deployment must configure explicit allowed origins and the access token secret through environment variables
- `JWT_SECRET` becomes legacy fallback only; new deployments should use `ACCESS_TOKEN_SECRET`
- CSRF protection is currently based on same-site deployment assumptions plus cookie policy; if deployment expands beyond same-site sibling subdomains, explicit CSRF tokens should be evaluated

---

## Related Documents

- docs/architecture/backend-architecture.md
- docs/architecture/api-spec.md
- docs/architecture/dto-spec.md
- docs/domain/validation-rules.md