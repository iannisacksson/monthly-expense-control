# API Specification

## Purpose

This document defines the HTTP API of the backend.

It describes:

- available endpoints
- request formats
- response formats
- resource structure

AI assistants must use this document when generating:

- controllers
- routes
- DTOs
- request validation

This document complements:

Documentation precedence for AI assistants:

1. docs/product/vision.md
2. docs/domain/domain-model.md
3. this document and docs/architecture/dto-spec.md
4. docs/product/features.md

If docs/product/features.md conflicts with this API specification, follow the API specification and the domain model.

---

# API Design Principles

The API follows a RESTful design.

Resources are represented using plural nouns.

Examples:

/users
/months
/expenses
/monthly-incomes

HTTP methods define the action:

GET → retrieve data  
POST → create resource  
PUT → update resource  
DELETE → remove resource

All update endpoints return the full updated object unless otherwise documented.

All delete endpoints return `{ "success": true }`.

All error responses return `{ "error": "message" }`.

The target ownership boundary of the API is User + Month.

During migration, temporary compatibility endpoints may exist, but new endpoints must prefer user-scoped behavior.

Authentication:

All endpoints except `/auth/register`, `/auth/login`, and `/health` require a valid JWT Bearer token.

The token must be sent in the `Authorization` header:

Authorization: Bearer <token>

The `authMiddleware` is applied globally in `routes/index.ts` to all resource routes after the public `/auth` and `/health` routes.

The authenticated user identity is always sourced from the token. Clients must not send `user_id` in request bodies for identity resolution.

## Cross-User Access Protection

Every resource endpoint enforces ownership.

If a request targets a resource that belongs to a different user, the server returns:

```
HTTP 403 Forbidden
{ "error": "Forbidden" }
```

This is implemented at the service layer via `ForbiddenError` (`src/utils/errors.ts`). Services receive `requestingUserId` from the controller (always `req.user.id`) and compare it against the resource owner before any mutation or read.

Resources with a direct `user_id` column are checked directly.

Resources without a direct `user_id` (e.g. subcategories, income taxes, budget allocations) traverse to their parent resource to resolve the owner.

Current implementation note:

- all active resource routes are user-scoped
- legacy `families` and `family-members` tables still exist in the database for archival compatibility but are not exposed through active API routes
- new work must not reference family ownership in any new endpoint or behavior

---

# Base URL

/api/v1

---

# Health Check Endpoint

GET /api/v1/health

### Response

{
  "status": "ok"
}

---

# Resource: Auth

Public endpoints for registration and login. No token required.

## Register

POST /api/v1/auth/register

### Request

{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "password": "SenhaSegura1"
}

### Response (201)

{
  "id": "uuid",
  "name": "Maria Silva",
  "email": "maria@example.com",
  "createdAt": "2026-04-29T00:00:00.000Z"
}

## Login

POST /api/v1/auth/login

### Request

{
  "email": "maria@example.com",
  "password": "SenhaSegura1"
}

### Response (200)

{
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@example.com"
  }
}

## Get Authenticated Profile

GET /api/v1/auth/me

Requires: Authorization: Bearer <token>

### Response (200)

{
  "id": "uuid",
  "name": "Maria Silva",
  "email": "maria@example.com",
  "created_at": "2026-04-29T00:00:00.000Z",
  "updated_at": "2026-04-29T00:00:00.000Z"
}

Note: `password_hash` is never returned in any response.

## Update Authenticated Profile

PUT /api/v1/auth/me

Requires: Authorization: Bearer <token>

### Request (all fields optional)

{
  "name": "Maria Souza",
  "email": "maria.souza@example.com",
  "password": "NovaSenha2"
}

### Response (200)

Full updated user object (without password_hash).

## Delete Authenticated Account

DELETE /api/v1/auth/me

Requires: Authorization: Bearer <token>

### Response (200)

{
  "success": true
}

---

# Resource: Users

Admin-scoped user management routes. These routes return public user data only (no password_hash).

## Create User

POST /api/v1/users

Note: For self-registration, prefer `POST /api/v1/auth/register`.

## List Users

GET /api/v1/users

## Get User by ID

GET /api/v1/users/{id}

## Update User

PUT /api/v1/users/{id}

## Delete User

DELETE /api/v1/users/{id}

---

# Resource: Months

Represents a financial period for one user.

## Create Month

POST /api/v1/months

### Request

{
  "user_id": "uuid",
  "year": 2026,
  "month": 3,
  "status": "open"
}

## List Months by User

GET /api/v1/months/user/{userId}

There is no active family-scoped month listing route in the target contract.

Behavior note:

- the active month schema path is user-owned and no longer depends on `family_id`

Legacy endpoints such as `GET /api/v1/months/family/{familyId}` must not be used by frontend clients and should be removed during the User + Month cutover.

## Get Month by ID

GET /api/v1/months/{id}

## Update Month

PUT /api/v1/months/{id}

### Request

{
  "status": "open"
}

## Finalize Month

PATCH /api/v1/months/{id}/finalize

### Response

{
  "id": "uuid",
  "status": "closed"
}

## Delete Month

DELETE /api/v1/months/{id}

### Behavior

This endpoint must be blocked explicitly and return an error response.

---

# Resource: Categories

Represents user-owned expense categories.

## Create Category

POST /api/v1/categories

### Request

{
  "user_id": "uuid",
  "name": "Moradia",
  "type": "essential"
}

## List Categories by User

GET /api/v1/categories/user/{userId}

## Get Category by ID

GET /api/v1/categories/{id}

## Update Category

PUT /api/v1/categories/{id}

## Delete Category

DELETE /api/v1/categories/{id}

---

# Resource: Subcategories

Represents detailed classification inside a category.

## Create Subcategory

POST /api/v1/subcategories

## List Subcategories by Category

GET /api/v1/subcategories/category/{categoryId}

## Get Subcategory by ID

GET /api/v1/subcategories/{id}

## Update Subcategory

PUT /api/v1/subcategories/{id}

## Delete Subcategory

DELETE /api/v1/subcategories/{id}

---

# Resource: Monthly Incomes

Represents income records for a user month.

## Create Monthly Income

POST /api/v1/monthly-incomes

### Request

{
  "user_id": "uuid",
  "month_id": "uuid",
  "gross_income": 5000,
  "income_type": "salary",
  "notes": "Main income"
}

## List Monthly Incomes by Month

GET /api/v1/monthly-incomes/month/{monthId}

## Get Monthly Income by ID

GET /api/v1/monthly-incomes/{id}

## Update Monthly Income

PUT /api/v1/monthly-incomes/{id}

## Delete Monthly Income

DELETE /api/v1/monthly-incomes/{id}

---

# Resource: Recurring Incomes

Represents income templates that generate monthly incomes.

## Create Recurring Income

POST /api/v1/recurring-incomes

Behavior note:

- the active payload is user-scoped and must not require `family_id`
- the backend must validate that `start_month_id` belongs to the same owner user
- recurring income persistence is user-owned in the active schema path

## List Recurring Incomes by User

GET /api/v1/recurring-incomes/user/{userId}

There is no active family-scoped recurring income listing route in the target contract.

## Get Recurring Income by ID

GET /api/v1/recurring-incomes/{id}

## Update Recurring Income

PUT /api/v1/recurring-incomes/{id}

## Delete Recurring Income

DELETE /api/v1/recurring-incomes/{id}

---

# Resource: Income Taxes

Represents taxes applied to a monthly income.

## Create Income Tax

POST /api/v1/income-taxes

## List Income Taxes by Monthly Income

GET /api/v1/income-taxes/monthly-income/{monthlyIncomeId}

## Update Income Tax

PUT /api/v1/income-taxes/{id}

## Delete Income Tax

DELETE /api/v1/income-taxes/{id}

---

# Resource: Expenses

Represents expenses for a user month.

## Create Expense

POST /api/v1/expenses

### Request

{
  "user_id": "uuid",
  "month_id": "uuid",
  "category_id": "uuid",
  "subcategory_id": "uuid",
  "description": "Internet",
  "value": 120,
  "expense_date": "2026-03-10"
}

Behavior note:

- the backend must validate expense ownership through the selected month and category owner, using `user_id + month_id + category` as the primary invariant
- `family_id` may be accepted only as a legacy fallback when the selected month still belongs exclusively to a legacy family context

## List Expenses by User and Month

GET /api/v1/expenses/user/{userId}/month/{monthId}

There is no active family-scoped expense listing route in the target contract.

Legacy endpoints such as `GET /api/v1/expenses/family/{familyId}/month/{monthId}` are out of the active app surface and should not be reintroduced in frontend hooks or month flows.

## Get Expense by ID

GET /api/v1/expenses/{id}

## Update Expense

PUT /api/v1/expenses/{id}

## Delete Expense

DELETE /api/v1/expenses/{id}

## Bulk Delete Expenses

POST /api/v1/expenses/bulk-delete

### Request

{
  "user_id": "uuid",
  "month_id": "uuid",
  "expense_ids": ["uuid-1", "uuid-2"]
}

### Response

{
  "success": true,
  "deleted_count": 2
}

### Behavior

The backend must verify that every selected expense belongs to the given user and month before deleting.

---

# Resource: Budget Rules

Represents user-owned budget strategies.

## Create Budget Rule

POST /api/v1/budgets/rules

## List Budget Rules by User

GET /api/v1/budgets/rules/user/{userId}

Behavior note:

- budget rule listing in the active application is user-scoped
- allocation validation must compare the effective owner of the budget rule and the selected category

## Get Budget Rule by ID

GET /api/v1/budgets/rules/{id}

## Update Budget Rule

PUT /api/v1/budgets/rules/{id}

## Delete Budget Rule

DELETE /api/v1/budgets/rules/{id}

---

# Resource: Budget Allocations

Represents category allocations inside a budget rule.

## Create Allocation

POST /api/v1/budgets/allocations

## List Allocations by Budget Rule

GET /api/v1/budgets/allocations/rule/{ruleId}

## Update Allocation

PUT /api/v1/budgets/allocations/{id}

## Delete Allocation

DELETE /api/v1/budgets/allocations/{id}

---

# Resource: Installment Groups

Represents installment purchase series.

## Create Installment Group

POST /api/v1/installment-groups

Behavior note:

- active create payloads are user-scoped and rely on `start_month_id` plus optional `user_id`
- the backend must derive the effective owner from `user_id` or the selected `start_month_id`
- recurring expense persistence is user-owned in the active schema path

## List Installment Groups by User

GET /api/v1/installment-groups/user/{userId}

## Get Installment Group by ID

GET /api/v1/installment-groups/{id}

## List Expenses by Installment Group

GET /api/v1/installment-groups/{id}/expenses

## Update Installment Group with Scope

PUT /api/v1/installment-groups/{id}

### Request

{
  "scope": "future_occurrences",
  "effective_month_id": "uuid",
  "description": "Notebook",
  "total_value": 2500,
  "installments": 12
}

## Remove Installment Occurrence

DELETE /api/v1/installment-groups/{id}

### Request

{
  "scope": "single_occurrence",
  "effective_month_id": "uuid"
}

## Recreate Installment Occurrence

POST /api/v1/installment-groups/{id}/restore-occurrence

### Request

{
  "month_id": "uuid"
}

## Delete Installment Group

DELETE /api/v1/installment-groups/{id}

---

# Resource: Recurring Expenses

Represents recurring expense series.

## Create Recurring Expense

POST /api/v1/recurring-expenses

Behavior note:

- active create payloads are user-scoped and rely on `start_month_id` plus optional `user_id`
- any legacy `family_id` fallback must be resolved internally from the selected start month while legacy persisted data still exists

## List Recurring Expenses by User

GET /api/v1/recurring-expenses/user/{userId}

## Get Recurring Expense by ID

GET /api/v1/recurring-expenses/{id}

## List Expenses by Recurring Expense

GET /api/v1/recurring-expenses/{id}/expenses

## Update Recurring Expense with Scope

PUT /api/v1/recurring-expenses/{id}

### Request

{
  "scope": "single_occurrence",
  "effective_month_id": "uuid",
  "value": 180
}

## Remove Recurring Occurrence

DELETE /api/v1/recurring-expenses/{id}

### Request

{
  "scope": "single_occurrence",
  "effective_month_id": "uuid"
}

## Recreate Recurring Occurrence

POST /api/v1/recurring-expenses/{id}/restore-occurrence

### Request

{
  "month_id": "uuid"
}

## Delete Recurring Expense

DELETE /api/v1/recurring-expenses/{id}

---

# Resource: Dashboard

Represents month-level financial visibility for a user.

## Get Monthly Dashboard

GET /api/v1/dashboard/user/{userId}/month/{monthId}

### Response

The response must include enough data to render:

- gross income
- taxes
- net income
- total expenses
- remaining balance
- expenses grouped by category type
- budget comparison by category
- month status

---

# Legacy and Migration Notes

The API no longer treats families or family members as first-class product resources.

Legacy family-scoped endpoints may temporarily coexist during migration, but new implementation must prefer user-scoped routes and validations.

Debt is archived outside the HTTP contract and must not be exposed as an active API resource.
