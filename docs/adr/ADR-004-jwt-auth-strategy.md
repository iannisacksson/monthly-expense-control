# ADR-004 — JWT Bearer Token Authentication Strategy

## Status

Accepted

## Date

2025-04

---

## Context

The application requires user authentication to protect all resource routes and enforce the User + Month ownership boundary. Users must be able to register, log in, manage their own profile, and have their identity verifiable on every request.

The system is a single-user personal finance manager. Each user owns their own data (months, expenses, incomes, budgets). There is no shared session concept or multi-user collaboration at this level.

A stateless authentication strategy is preferred to avoid server-side session storage and to keep the backend horizontally scalable.

---

## Decision

The backend uses **JWT Bearer Token** authentication.

### Route structure

Authentication uses identity-based routes, not parameterized user ID routes:

```
POST   /api/v1/auth/register   — public, creates a user account
POST   /api/v1/auth/login      — public, returns a signed JWT
GET    /api/v1/auth/me         — protected, returns the authenticated user
PUT    /api/v1/auth/me         — protected, updates name / email / password
DELETE /api/v1/auth/me         — protected, deletes the account
```

All other resource routes (`/months`, `/expenses`, etc.) are protected.

### Token

- Payload: `{ id: uuid, email: string }`
- Signed with `JWT_SECRET` environment variable (required, no default)
- Expiry: controlled by `JWT_EXPIRES_IN` (defaults to `7d`)
- Sent by the client in every request as `Authorization: Bearer <token>`

### Middleware

`src/middlewares/auth.middleware.ts` verifies the token and sets `req.user = { id, email }`.

Controllers and services must resolve the authenticated user via `req.user.id`. User identity must never be accepted from request bodies for protected operations.

### Password hashing

Passwords are hashed with **bcrypt at cost factor 12** before persistence. Plain-text passwords are never stored. `password_hash` is never returned in any API response.

---

## Rationale

- **Stateless**: no session store needed; easy to scale horizontally
- **Standard**: JWT is a widely supported, well-understood pattern for SPAs
- **Aligned with User + Month boundary**: all resources are resolved through the authenticated user id extracted from the token — no family or legacy ownership needed
- **Secure defaults**: bcrypt cost 12 is strong enough for a personal finance app while remaining practical on commodity hardware
- **Identity-based `/auth/me` routes**: avoids exposing the user's UUID in the URL for self-management operations, consistent with REST best practices for identity endpoints

---

## Consequences

- The client (frontend) must store the JWT securely and include it on every API request.
- Token invalidation requires a client-side logout (clear the token). There is no server-side token revocation in this implementation.
- If `JWT_SECRET` is not set in the environment, the application must not start or must fail requests securely.
- All new resource routes added in the future must apply `authMiddleware`.
