# Database Model

## Purpose

This document defines the relational database model used by the application.

It describes:

- tables
- columns
- constraints
- relationships
- indexes

This document serves two main purposes:

1. guide developers implementing persistence
2. provide structured context for AI-assisted development

Because of this, the schema definitions must be:

- explicit
- consistent
- aligned with the domain model

---

# Database Technology

The system uses PostgreSQL.

Key characteristics used in this project:

- relational schema
- foreign keys
- transactional consistency
- normalized tables
- indexed queries

---

# Naming Conventions

Tables use snake_case plural names.

Columns follow snake_case.

Primary key:

id UUID

Standard timestamps:

created_at
updated_at

---

# Ownership Model

The target ownership model is User + Month.

Financial tables must no longer use family ownership as the primary boundary.

During migration, some tables may temporarily contain both `family_id` and `user_id`, but the target schema is user-owned.

---

# Tables

# users

## Purpose

Stores registered users of the system.

## Columns

| column | type |
|------|------|
| id | uuid (pk) |
| name | text |
| email | text |
| password_hash | text |
| created_at | timestamp |
| updated_at | timestamp |

## Constraints

PRIMARY KEY (id)  
UNIQUE (email)

---

# months

## Purpose

Represents a financial period for one user.

## Columns

| column | type |
|------|------|
| id | uuid (pk) |
| user_id | uuid |
| year | integer |
| month | integer |
| status | text |
| created_at | timestamp |

## Constraints

FOREIGN KEY (user_id) REFERENCES users(id)  
UNIQUE (user_id, year, month)

---

# monthly_incomes

## Purpose

Represents income received by a user during a specific month.

Income belongs to User + Month.

## Columns

| column | type |
|------|------|
| id | uuid |
| user_id | uuid |
| month_id | uuid |
| recurring_income_id | uuid |
| gross_income | numeric |
| income_type | text |
| notes | text |
| created_at | timestamp |

## Constraints

FOREIGN KEY (user_id) REFERENCES users(id)  
FOREIGN KEY (month_id) REFERENCES months(id)  
FOREIGN KEY (recurring_income_id) REFERENCES recurring_incomes(id)

---

# recurring_incomes

## Purpose

Stores templates that generate monthly income records such as fixed salary and recurring extra income.

## Columns

| column | type |
|------|------|
| id | uuid |
| user_id | uuid |
| description | text |
| gross_income | numeric |
| income_type | text |
| kind | text |
| start_month_id | uuid |
| occurrences | integer nullable |
| status | text |
| created_at | timestamp |

## Constraints

FOREIGN KEY (user_id) REFERENCES users(id)  
FOREIGN KEY (start_month_id) REFERENCES months(id)

---

# income_taxes

## Purpose

Represents taxes applied to a monthly income.

## Columns

| column | type |
|------|------|
| id | uuid |
| monthly_income_id | uuid |
| tax_type | text |
| value | numeric |
| is_auto | boolean |

## Constraints

FOREIGN KEY (monthly_income_id) REFERENCES monthly_incomes(id)

---

# categories

## Purpose

Top-level expense classification defined per user.

## Columns

| column | type |
|------|------|
| id | uuid |
| user_id | uuid |
| name | text |
| type | text |

## Constraints

FOREIGN KEY (user_id) REFERENCES users(id)

---

# subcategories

## Purpose

Detailed classification inside categories.

## Columns

| column | type |
|------|------|
| id | uuid |
| category_id | uuid |
| name | text |

## Constraints

FOREIGN KEY (category_id) REFERENCES categories(id)

---

# budget_rules

## Purpose

Represents reusable budgeting strategies owned by one user.

## Columns

| column | type |
|------|------|
| id | uuid |
| user_id | uuid |
| name | text |
| created_at | timestamp |

## Constraints

FOREIGN KEY (user_id) REFERENCES users(id)

---

# budget_allocations

## Purpose

Represents category allocations inside a budget rule.

## Columns

| column | type |
|------|------|
| id | uuid |
| budget_rule_id | uuid |
| category_id | uuid |
| percentage | numeric |
| created_at | timestamp |

## Constraints

FOREIGN KEY (budget_rule_id) REFERENCES budget_rules(id)  
FOREIGN KEY (category_id) REFERENCES categories(id)

---

# expenses

## Purpose

Represents financial expenses.

This is the central financial table of the system.

## Columns

| column | type |
|------|------|
| id | uuid |
| user_id | uuid |
| month_id | uuid |
| category_id | uuid |
| subcategory_id | uuid |
| paid_by | uuid |
| responsible_user_id | uuid |
| installment_group_id | uuid |
| recurring_expense_id | uuid |
| is_paid | boolean |
| description | text |
| value | numeric |
| expense_date | date nullable |
| payment_date | date nullable |
| created_at | timestamp |

## Constraints

FOREIGN KEY (user_id) REFERENCES users(id)  
FOREIGN KEY (month_id) REFERENCES months(id)  
FOREIGN KEY (category_id) REFERENCES categories(id)  
FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)  
FOREIGN KEY (responsible_user_id) REFERENCES users(id)  
FOREIGN KEY (recurring_expense_id) REFERENCES recurring_expenses(id)  
FOREIGN KEY (installment_group_id) REFERENCES installment_groups(id)

## Indexes

INDEX (user_id, month_id)  
INDEX (category_id)

## Notes

`month_id` is the authoritative boundary for monthly ownership and reporting.

`payment_date` stores when the expense was actually paid.

`expense_date` is optional metadata and must not be used as the primary rule for deciding which month owns the expense.

---

# installment_groups

## Purpose

Represents purchases made in installments.

The system generates multiple expenses from this record.

## Columns

| column | type |
|------|------|
| id | uuid |
| user_id | uuid |
| description | text |
| total_value | numeric |
| installments | integer |
| starting_installment_number | integer |
| category_id | uuid |
| subcategory_id | uuid |
| paid_by | uuid |
| responsible_user_id | uuid |
| start_month_id | uuid |
| created_at | timestamp |

## Constraints

FOREIGN KEY (user_id) REFERENCES users(id)  
FOREIGN KEY (category_id) REFERENCES categories(id)  
FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)  
FOREIGN KEY (start_month_id) REFERENCES months(id)

---

# recurring_expenses

## Purpose

Represents predictable monthly expenses that automatically generate expenses in future months.

## Columns

| column | type |
|------|------|
| id | uuid |
| user_id | uuid |
| description | text |
| value | numeric |
| category_id | uuid |
| subcategory_id | uuid |
| paid_by | uuid |
| responsible_user_id | uuid |
| start_month_id | uuid |
| occurrences | integer nullable |
| status | text |
| created_at | timestamp |

## Constraints

FOREIGN KEY (user_id) REFERENCES users(id)  
FOREIGN KEY (category_id) REFERENCES categories(id)  
FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)  
FOREIGN KEY (start_month_id) REFERENCES months(id)

## Notes

When `occurrences` is null, the recurring definition remains active indefinitely until its status changes.

---

# debts

## Status

The legacy `debts` table has been removed from the active schema path by migration `20260429000033-drop-debts-legacy-table.js`.

## Decision

Debt must not remain a family-owned primary aggregate in the target product model.

Any future redesign must introduce a new user-owned liability model instead of restoring the legacy family-based table.

---

# Migration Notes

The safe migration path is additive:

1. add nullable `user_id` to family-owned financial tables in the current schema
2. backfill `user_id` using an explicit family-to-user ownership mapping
3. move application reads and writes to user-scoped behavior
4. remove legacy `family_id` dependencies after cutover validation

Families and family_members may temporarily remain only as migration aids and legacy references, not as target ownership boundaries.

## Physical `family_id` Removal Readiness

The current Sequelize models and migrations show three different removal states.

### Ready for next physical-removal planning step

- `categories` and `budget_rules`
- status: migration file `20260429000029-remove-family-ownership-from-categories-budget-rules-and-expenses.js` removes the legacy `family_id` columns from the active schema path
- rationale: active routes, DTOs, frontend flows, and ORM associations are already user-scoped

### Ready for next physical-removal planning step

- `months`
- status: migration file `20260429000031-remove-family-ownership-from-months.js` removes the legacy `family_id` column, removes the family-based uniqueness/indexes, and makes `user_id` non-null in the active schema path
- rationale: the current test database audit shows no `months` rows missing `user_id`, so the remaining family bridge was schema-only

### Not ready for column drop yet

- `expenses`
- status: migration file `20260429000029-remove-family-ownership-from-categories-budget-rules-and-expenses.js` removes the legacy `family_id` column and replaces the family-centered index with a `month_id` index
- rationale: active persistence now derives ownership from `month_id`, while month-level compatibility remains the only remaining bridge for older aggregates

- `recurring_incomes`, `recurring_expenses`, and `installment_groups`
- status: migration file `20260429000030-remove-family-ownership-from-recurring-and-installment-aggregates.js` removes the legacy `family_id` columns from the active schema path, and `20260429000032-make-recurring-and-installment-user-ownership-required.js` hardens `user_id` to `NOT NULL` for `recurring_expenses` and `installment_groups`
- rationale: active routes, DTOs, frontend flows, and ORM associations now operate on owner user context derived from `user_id` plus `start_month_id`
- current verification: the configured local test database has no rows with missing `user_id` in these tables
- remaining hardening step: review whether `recurring_incomes` and related dependents need any further schema tightening beyond the current ownership contract

### Removed from active schema

- `debts`
- rationale: the aggregate was intentionally outside the active product direction and encoded a family relationship rather than month ownership
- decision: the legacy backend/frontend slice was removed and the table was dropped only after an empty-table preflight check in a separate archival step

## Debt Removal Prerequisites

Final removal of `debts` persistence required an explicit archival strategy.

That strategy must define:

- export format and destination for legacy debt data
- retention window and operator responsibility
- one migration or script that extracts legacy rows before table removal
- the follow-up removal sequence for model, repository, service, controller, route, and final drop-table migration

## Debt Archival Strategy

Use a two-path archival policy.

### Fast path when the table is empty

- run a preflight count on `debts`
- if the count is zero, record an archival manifest stating that no rows required export
- then remove debt model, repository, service, controller remnants, and apply a dedicated drop-table migration in a separate change

Current status:

- the configured local test database satisfied the empty-table fast path
- the legacy debt code slice was removed
- the `debts` table was dropped from the active schema path

### Export path when rows exist

- export the full table to CSV or JSON outside the application database
- include a manifest with export timestamp, row count, column list, and operator identity
- retain the exported artifact for the agreed retention window
- only after artifact verification, remove debt code and drop the table in a separate change
