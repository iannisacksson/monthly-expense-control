# Domain Validation Rules

## Purpose

This document defines the validation rules for the domain entities.

Validation rules ensure that domain data remains consistent and valid.

AI assistants must use these rules when generating:

- DTO validation
- service validations
- database constraints

This document complements:

docs/domain/domain-model.md  
docs/domain/aggregates.md  
docs/architecture/api-spec.md  
docs/architecture/dto-spec.md

---

# Validation Principles

Validation should occur in two layers:

1. API Layer (DTO validation)
2. Service Layer (business validation)

DTO validation ensures request data is valid.

Service validation ensures business rules are respected.

---

# User Validation Rules

## name

- required
- minimum length: 2 characters
- maximum length: 100 characters

## email

- required
- must be a valid email format
- must be unique across users

## password_hash

- required

---

# Month Validation Rules

## user_id

- required
- must reference an existing user

## year

- required
- must be a positive integer

## month

- required
- must be between 1 and 12

## status

- required
- allowed values: open, closed

## Uniqueness

A user cannot have two identical months.

Constraint: UNIQUE (user_id, year, month)

## Deletion

A month cannot be deleted.

## Finalization

When a month is closed, incompatible mutations that change monthly financial results must be blocked.

---

# MonthlyIncome Validation Rules

## user_id

- required
- must reference an existing user

## month_id

- required
- must reference an existing month
- must belong to the same user as the income

## recurring_income_id

- optional
- if provided, must reference an existing recurring income template owned by the same user

## gross_income

- required
- must be greater than zero

## income_type

- required
- examples: salary, freelance, bonus, commission

## notes

- optional
- maximum length: 255 characters

---

# RecurringIncome Validation Rules

## user_id

- required
- must reference an existing user

## description

- required
- maximum length: 255 characters

## gross_income

- required
- must be greater than zero

## income_type

- required
- examples: salary, freelance, overtime, bonus, profit_sharing, commission, other

## kind

- required
- allowed values: fixed_salary, recurring_extra

## start_month_id

- required
- must reference an existing month
- must belong to the same user as the recurring income definition

## occurrences

- required
- must be at least 1

## status

- required
- allowed values: active, inactive

---

# IncomeTax Validation Rules

## monthly_income_id

- required
- must reference an existing monthly income

## tax_type

- required
- examples: INSS, FGTS, DAS, custom

## value

- required
- must be greater than or equal to zero

## is_auto

- required
- must be boolean

---

# Category Validation Rules

## user_id

- required
- must reference an existing user

## name

- required
- minimum length: 2 characters
- maximum length: 100 characters

## type

- required
- examples: essential, necessary, lifestyle, investment

---

# Subcategory Validation Rules

## category_id

- required
- must reference an existing category

## name

- required
- minimum length: 2 characters
- maximum length: 100 characters

---

# BudgetRule Validation Rules

## user_id

- required
- must reference an existing user

## name

- required
- minimum length: 2 characters
- maximum length: 100 characters

---

# BudgetAllocation Validation Rules

## budget_rule_id

- required
- must reference an existing budget rule

## category_id

- required
- must reference an existing category
- must belong to the same user as the selected budget rule

## percentage

- required
- must be greater than zero

---

# Expense Validation Rules

## user_id

- required
- must reference an existing user

## month_id

- required
- must reference an existing month
- must belong to the same user as the expense

## category_id

- required
- must reference an existing category
- must belong to the same user as the expense

## subcategory_id

- optional
- if provided, must reference an existing subcategory belonging to the selected category

## paid_by

- optional
- if provided, must reference an existing user

## responsible_user_id

- optional
- if provided, must reference an existing user

## is_paid

- optional on update
- boolean
- defaults to false when the expense is created

## description

- required
- maximum length: 255 characters

## value

- required
- must be greater than zero

## expense_date

- required
- must be a valid date

## Bulk Deletion

Bulk deletion must validate that all selected expenses belong to the same user and month.

## Closed Month

Expenses cannot be created, bulk-deleted, or changed in incompatible ways when the target month is closed.

---

# InstallmentGroup Validation Rules

## user_id

- required
- must reference an existing user

## description

- required
- maximum length: 255 characters

## total_value

- required
- must be greater than zero

## installments

- required
- must be a positive integer greater than 1

## starting_installment_number

- required
- must be a positive integer
- must be less than or equal to installments

## category_id

- required
- must reference an existing category owned by the same user

## start_month_id

- required
- must reference an existing month owned by the same user

## Scoped Editing

Installment updates that affect generated expenses must specify an explicit scope.

Allowed scopes:

- single_occurrence
- future_occurrences
- whole_series

## effective_month_id

- required when scope is single_occurrence or future_occurrences
- must reference an existing month
- must be on or after start_month_id
- must stay inside the tracked installment range

## Occurrence Restoration

- restoring one deleted installment occurrence must receive month_id explicitly
- month_id must belong to the same tracked schedule
- duplicate regenerated expenses for the same installment group and month are not allowed

---

# RecurringExpense Validation Rules

## user_id

- required
- must reference an existing user

## description

- required
- maximum length: 255 characters

## value

- required
- must be greater than zero

## category_id

- required
- must reference an existing category owned by the same user

## subcategory_id

- optional
- if provided, must reference an existing subcategory belonging to the selected category

## paid_by

- optional
- if provided, must reference an existing user

## responsible_user_id

- optional
- if provided, must reference an existing user

## start_month_id

- required
- must reference an existing month owned by the same user

## occurrences

- required for MVP
- must be a positive integer

## status

- required
- allowed values: active, inactive

## Uniqueness

The system must not generate duplicate expenses for the same recurring expense and month.

## Scoped Editing

Recurring expense updates that affect generated expenses must specify an explicit scope.

Allowed scopes:

- single_occurrence
- future_occurrences
- whole_series

## effective_month_id

- required when scope is single_occurrence or future_occurrences
- must reference an existing month
- must be on or after start_month_id
- must stay inside the recurring expense range

## Occurrence Restoration

- restoring one deleted recurring occurrence must receive month_id explicitly
- month_id must belong to the same recurring schedule
- inactive recurring expenses cannot restore occurrences

---

# Debt Validation Rules

Debt is legacy during the User + Month migration.

New product flows must not depend on family-scoped debt validation.
