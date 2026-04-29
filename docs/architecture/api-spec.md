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

Current implementation note:

- user-scoped routes already exist for core resources such as months, categories, expenses, recurring entities, and budgets
- family-scoped compatibility routes still exist for part of the backend surface
- top-level legacy resources such as `families` and `family-members` are still registered during migration
- API changes must state whether they affect the target user-scoped contract, the temporary family-scoped compatibility surface, or both

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

# Resource: Users

## Create User

POST /api/v1/users

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

## List Recurring Incomes by User

GET /api/v1/recurring-incomes/user/{userId}

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
- any legacy `family_id` fallback must be resolved internally from the selected start month while legacy persisted data still exists

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
