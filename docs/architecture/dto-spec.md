# DTO Specification

## Purpose

This document defines the Data Transfer Objects (DTOs) used by the API.

DTOs define the structure of:

- request bodies
- response payloads

AI assistants must use DTOs when generating:

- controllers
- request validation
- service input
- frontend TypeScript types

This document complements:

docs/architecture/api-spec.md  
docs/domain/validation-rules.md

---

# DTO Location

Backend DTO files must be stored in:


src/dtos


Example:


user.dto.ts
expense.dto.ts
monthly-income.dto.ts

---

# Auth DTOs

## RegisterDTO


name: string
email: string
password: string


## LoginDTO


email: string
password: string


## LoginResponseDTO


user: {
	id: string
	name: string
	email: string
}


## RefreshResponseDTO


user: {
	id: string
	name: string
	email: string
}


## LogoutResponseDTO


success: boolean


Auth token transport note:

- authentication tokens are set by the backend via HttpOnly cookies
- token values are not returned in JSON response bodies


---

# User DTOs

## CreateUserDTO


name: string
email: string
password_hash: string


## UpdateUserDTO


name?: string
email?: string
password_hash?: string


---

# Month DTOs

## CreateMonthDTO


user_id: string
year: number
month: number
status: string


## UpdateMonthDTO


status?: string


---

# MonthlyIncome DTOs

## CreateMonthlyIncomeDTO


user_id: string
month_id: string
recurring_income_id?: string
gross_income: number
income_type: string
notes?: string


## UpdateMonthlyIncomeDTO


gross_income?: number
income_type?: string
notes?: string


## CreateRecurringIncomeDTO


user_id: string
description: string
gross_income: number
income_type: string
kind: string
start_month_id: string
occurrences: number
status: string


## UpdateRecurringIncomeDTO


description?: string
gross_income?: number
income_type?: string
kind?: string
occurrences?: number
status?: string


---

# IncomeTax DTOs

## CreateIncomeTaxDTO


monthly_income_id: string
tax_type: string
value: number
is_auto: boolean


## UpdateIncomeTaxDTO


tax_type?: string
value?: number
is_auto?: boolean


---

# Category DTOs

## CreateCategoryDTO


user_id: string
name: string
type: string


## UpdateCategoryDTO


name?: string
type?: string


---

# Subcategory DTOs

## CreateSubcategoryDTO


category_id: string
name: string


## UpdateSubcategoryDTO


name?: string


---

# Expense DTOs

## CreateExpenseDTO


user_id: string
month_id: string
category_id: string
subcategory_id?: string
paid_by?: string
responsible_user_id?: string
installment_group_id?: string
recurring_expense_id?: string
expense_kind?: string
planned_amount?: number
description: string
value?: number
expense_date: string


## UpdateExpenseDTO


category_id?: string
subcategory_id?: string
paid_by?: string
responsible_user_id?: string
recurring_expense_id?: string
expense_kind?: string
planned_amount?: number | null
is_paid?: boolean
description?: string
value?: number
expense_date?: string


## ExpenseAdjustmentDTO


id: string
expense_id: string
changed_by?: string
previous_value: number
new_value: number
created_at: string


## ExpenseItemDTO


id: string
expense_id: string
description: string
amount: number
created_at: string


## CreateExpenseItemDTO


description: string
amount: number


## UpdateExpenseItemDTO


description?: string
amount?: number


---

# BulkDeleteExpensesDTO


user_id: string
month_id: string
expense_ids: string[]


---

# InstallmentGroup DTOs

## CreateInstallmentGroupDTO


user_id: string
description: string
total_value: number
installments: number
starting_installment_number: number
category_id: string
subcategory_id?: string
paid_by?: string
responsible_user_id?: string
start_month_id: string


## UpdateInstallmentGroupDTO


scope?: "single_occurrence" | "future_occurrences" | "whole_series"
effective_month_id?: string
description?: string
total_value?: number
installments?: number
category_id?: string
subcategory_id?: string
paid_by?: string
responsible_user_id?: string


## RestoreInstallmentOccurrenceDTO


month_id: string


---

# RecurringExpense DTOs

## CreateRecurringExpenseDTO


user_id: string
description: string
value: number
category_id: string
subcategory_id?: string
paid_by?: string
responsible_user_id?: string
start_month_id: string
occurrences: number
status: string
expense_kind?: string
planned_amount?: number


## UpdateRecurringExpenseDTO


description?: string
value?: number
category_id?: string
subcategory_id?: string
paid_by?: string
responsible_user_id?: string
occurrences?: number
status?: string
expense_kind?: string
planned_amount?: number | null


## UpdateRecurringExpenseWithScopeDTO


scope?: "single_occurrence" | "future_occurrences" | "whole_series"
effective_month_id?: string
description?: string
value?: number
category_id?: string
subcategory_id?: string
paid_by?: string
responsible_user_id?: string
occurrences?: number
status?: string


## RestoreRecurringExpenseOccurrenceDTO


month_id: string


---

# BudgetRule DTOs

## CreateBudgetRuleDTO


user_id: string
name: string


## UpdateBudgetRuleDTO


name?: string


---

# BudgetAllocation DTOs

## CreateBudgetAllocationDTO


budget_rule_id: string
category_id: string
percentage: number


## UpdateBudgetAllocationDTO


category_id?: string
percentage?: number


---

# DTO Usage Rules

Controllers must:

- receive request DTOs
- validate input data

Services must:

- receive validated DTOs
- transform DTOs into domain objects

Repositories must not receive DTOs directly.

---

# AI Usage Instructions

When generating backend code, AI assistants must:

1. create DTO files for each resource
2. validate DTOs using domain validation rules
3. use DTOs as the API contract

When generating frontend code, AI assistants must:

1. create TypeScript types that mirror these DTOs
2. use types in services and hooks
3. ensure type safety across the frontend