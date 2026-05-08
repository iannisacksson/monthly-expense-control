# Product Features

## Purpose

This document defines the main product capabilities of the application.

It helps AI assistants understand:

- what the system must do
- which user outcomes must be supported
- the business scope of the MVP
- which feature flows are first-class in the product

AI tools must use this document when generating:

- API endpoints
- services
- controllers
- database models
- domain logic
- frontend feature flows

This document focuses on product capabilities, not implementation details.

Implementation details are defined in:

docs/product/vision.md  
docs/domain/domain-model.md  
docs/architecture/backend-architecture.md  
docs/architecture/database-model.md  
docs/architecture/api-spec.md

---

## Documentation Priority

If there is any conflict between documents, AI assistants must use this priority order:

1. docs/product/vision.md
2. docs/domain/domain-model.md and other docs/domain/*
3. docs/architecture/api-spec.md and docs/architecture/dto-spec.md
4. this document

This document must not be interpreted as permission to ignore the current domain or API shape.

---

## Product Context

The application is a personal financial manager.

Its goal is to help each user manage finances with a clear monthly structure.

The system is organized around:

- users
- monthly financial cycles
- monthly income
- categorized expenses
- recurring expenses
- installment purchases
- budget rules and allocations
- dashboards with monthly financial visibility

The main product boundary is:

User + Month

The system must support simple but structured monthly personal financial management.

The product no longer depends on family, family members, or shared financial spaces as first-class flows.

Legacy family tables remain in the database for archival compatibility only and are not part of the active application surface.

---

## MVP Scope

The MVP focuses on the essential capabilities required for a user to manage monthly finances with clarity.

Included in MVP:

- user registration, login, and authenticated session management
- user profile view, edit, and account deletion
- monthly income tracking per user
- expense tracking with categories and subcategories
- installment purchase tracking
- recurring expense tracking
- monthly budgeting based on customizable rules
- dashboards with budget and spending visibility
- month finalization with open and closed states
- bulk deletion of expenses inside a month
- scoped editing of recurring and installment-generated expenses

Excluded from MVP:

- banking integrations
- automatic bank transaction imports
- investment portfolio management
- advanced forecasting
- collaborative family management
- debts between family members
- complex accounting workflows

AI tools must prioritize MVP features only.

---

## Feature 0 — User Registration, Login and Profile Management

### Goal

Allow users to create accounts, authenticate, and manage their own profile.

### User Actions

Users can:

- register with name, email, and password
- log in with email and password
- view their own profile
- edit their name, email, and password
- delete their account

### System Behavior

The system must:

- hash passwords using bcrypt before storing them
- never return `password_hash` in any API response
- issue a JWT Bearer Token on successful login
- protect all resource routes with JWT authentication
- resolve the user identity from the token, not from request bodies
- enforce email uniqueness
- validate password strength on registration and update

### Auth Endpoints

POST /api/v1/auth/register  
POST /api/v1/auth/login  
GET /api/v1/auth/me  
PUT /api/v1/auth/me  
DELETE /api/v1/auth/me  

### Domain Entities

User

---

## Feature 1 — Monthly Financial Cycle

### Goal

Allow a user to organize financial activity by month.

### User Actions

Users can:

- create a month for themselves
- list their months
- view month details
- finalize a month
- view whether a month is open or closed

Users cannot:

- delete a month

### System Behavior

The system must:

- keep all financial activity scoped to a user and a month
- expose month navigation through user-scoped routes only
- support open and closed month states
- prevent month deletion in both backend and frontend
- block incompatible financial mutations when the month is closed
- preserve the monthly structure as the main navigation and reporting model

Legacy family-scoped month routes are out of the active product contract and must not be used for new work.

### Domain Entities

User  
Month

---

## Feature 2 — Monthly Income Tracking

### Goal

Allow a user to register income for a specific month.

### User Actions

Users can:

- create income records
- update income
- delete income
- list income records by month
- define a fixed salary that appears in upcoming months
- define recurring extra incomes for future months
- register taxes related to a monthly income
- update and delete income tax records

### System Behavior

The system must:

- associate income with user plus month
- support multiple income sources in the same month
- support fixed salary templates for future monthly generation
- support recurring extra incomes such as freelance work, overtime, profit sharing, bonus, and commission
- automatically associate recurring income definitions with the owner user of the selected month
- keep recurring incomes active across future owner months until they are inactivated
- treat recurring income persistence as user-owned in both active API contract and target schema
- store gross income and tax deductions
- allow net income to be derived from gross income minus taxes

### Domain Entities

MonthlyIncome  
RecurringIncome  
IncomeTax  
User  
Month

---

## Feature 3 — Expense Tracking

### Goal

Allow a user to register and monitor expenses within a month.

### User Actions

Users can:

- create an expense
- update an expense
- delete an expense
- list expenses by month
- assign category and optional subcategory
- record who paid for the expense when applicable
- mark one or multiple expenses as paid
- record responsibility when applicable
- select multiple expenses from a month and delete them in bulk

### System Behavior

The system must:

- associate each expense with user plus month plus category
- treat month_id as the primary monthly ownership boundary for the expense
- support detailed classification through subcategories
- preserve clear monthly visibility of spending
- store payment_date separately from monthly belonging so payment can happen later
- allow payment metadata such as payer and payment date to be updated after creation
- support `Expense` as the active envelope implementation through `expense_kind=envelope`
- support `planned_amount` on envelope expenses for planned-versus-current comparisons
- derive envelope current value through named ExpenseItem records
- optionally keep envelope total-change history through ExpenseAdjustment records
- validate bulk deletion using user_id and month_id
- reject bulk deletion requests when any selected expense does not belong to the same user and month
- validate bulk mark-paid requests using user_id and month_id
- reject bulk payment updates when any selected expense does not belong to the same user and month

### Domain Entities

Expense  
ExpenseItem  
ExpenseAdjustment  
Category  
Subcategory  
Month  
User

---

## Feature 4 — Category Management

### Goal

Allow a user to define their own expense structure.

### User Actions

Users can:

- create categories
- update categories
- delete categories
- list their categories
- create subcategories
- update subcategories
- delete subcategories
- list subcategories by category

### System Behavior

The system must:

- keep categories user-scoped
- support category types such as essential, necessary, lifestyle, and investment
- allow subcategories to refine classification without breaking the category structure
- expose category access directly from the monthly navigation flow, without depending on hover-only actions or hidden initial states

Legacy note:

- category and subcategory management must be exposed through user-scoped frontend routes only
- category ownership must be created and listed through user-scoped backend paths only

### Domain Entities

Category  
Subcategory  
User

---

## Feature 5 — Budget Rules and Allocations

### Goal

Allow a user to plan expected spending distribution.

### User Actions

Users can:

- create budget rules
- update budget rules
- delete budget rules
- list their budget rules
- create allocations inside a budget rule
- update allocations
- delete allocations
- compare planned percentages against real spending

### System Behavior

The system must:

- support named budget strategies such as 50/30/20
- allocate percentages to categories
- allow custom financial rules per user
- enable planned versus actual comparisons in dashboards
- expose budget management through a user-scoped route so the month detail flow can reach it without falling back to family navigation
- validate allocations against the effective owner of the selected budget rule and category, preferring `user_id` and using `family_id` only for legacy persisted records

### Domain Entities

BudgetRule  
BudgetAllocation  
Category  
User

---

## Feature 5A — Monthly Budget Envelopes

### Goal

Allow a user to manage an envelope as a real expense whose current value is built from named subitems during the month.

### User Actions

Users can:

- create an envelope expense in a specific month
- define the planned amount of the envelope
- add, edit, and delete named items inside the envelope
- mark the envelope as paid
- view the items that compose the current value of the envelope
- create recurring envelope expenses for future months
- edit and delete recurring envelope expenses
- compare planned versus current values per envelope

### System Behavior

The system must:

- keep the envelope inside the Expense aggregate instead of a parallel monthly item aggregate
- keep the current official envelope value in Expense.value as a derived total
- derive Expense.value from the sum of ExpenseItem records for envelope expenses
- preserve optional audit history of derived value changes in ExpenseAdjustment records
- allow the current value to exceed the planned amount
- show a visual warning when the current value exceeds the plan
- generate future envelope expenses from recurring expense definitions flagged as envelope
- include current envelope values in the month total spent calculation
- include envelope planned amounts in the total planned calculation of the month
- keep the main month summary centered on gross income, taxes, net balance, total spent, balance, and total planned

### Domain Entities

Expense
ExpenseItem
ExpenseAdjustment
RecurringExpense
Category
Month
User

---

## Feature 6 — Installment Purchase Tracking

### Goal

Allow a user to track purchases split across multiple months.

### User Actions

Users can:

- create an installment purchase
- start tracking an installment purchase from a later installment number
- list their installment groups
- view expenses generated by an installment group
- remove a generated monthly expense occurrence
- recreate a removed monthly expense occurrence when needed
- edit the value or metadata for only one occurrence, future occurrences, or the whole series when supported
- delete an installment group

### System Behavior

The system must:

- generate future expenses automatically from the installment definition
- preserve the original installment numbering even when tracking starts from a later installment
- preserve traceability between the installment group and generated expenses
- integrate installment expenses into monthly views
- distinguish clearly between editing one monthly occurrence and editing the series definition
- treat installment listing and creation as user-scoped application flows, resolving any legacy family fallback from the selected start month instead of from active frontend payloads

### Domain Entities

InstallmentGroup  
Expense  
Month  
User

---

## Feature 7 — Recurring Expenses

### Goal

Allow a user to automate predictable monthly expenses.

### User Actions

Users can:

- create a recurring expense definition
- update a recurring expense definition
- deactivate or delete a recurring expense definition
- list their recurring expenses
- view expenses generated by a recurring expense definition
- remove a generated monthly occurrence
- include a removed monthly occurrence again later
- edit only one occurrence, future occurrences, or the whole series when supported

### System Behavior

The system must:

- support monthly recurring expenses for MVP
- generate expenses automatically for each eligible owner month while the recurring definition is active
- preserve traceability between the recurring definition and generated expenses
- prevent duplicate monthly generation for the same recurring definition
- integrate recurring expenses into monthly views
- make the scope of edits explicit in the UI and backend contract
- allow recurring definitions to stay active indefinitely by default, without requiring a fixed month count
- treat recurring expense listing and creation as user-scoped application flows, resolving any legacy family fallback from the selected start month instead of from active frontend payloads

### Domain Entities

RecurringExpense  
Expense  
Month  
User

---

## Feature 8 — Month Status and Finalization

### Goal

Allow a user to close a month after reviewing the monthly result.

### User Actions

Users can:

- finalize a month
- identify whether a month is open or closed

### System Behavior

The system must:

- expose an explicit endpoint to finalize the month
- persist month status as open or closed
- show month status in the frontend
- block incompatible actions when a month is closed
- never allow month deletion

### Domain Entities

Month  
User

---

## Feature 9 — Financial Visibility and Dashboards

### Goal

Allow a user to understand their financial position clearly.

### User Actions

Users can:

- view gross and net income for a month
- view taxes associated with income
- view expenses by category type
- compare planned budget against actual spending
- view remaining balance for the month

### System Behavior

The system must:

- aggregate income, taxes, expenses, and budget usage inside the selected user month
- support fast monthly reading of income versus spending
- preserve category-based visibility across the month
- expose enough data for a monthly dashboard centered on the current user
- use net income, after taxes, as the planning base in planned-versus-actual comparisons
- expose total planned in the month summary header
- include envelope expense items in the total realized value of each envelope and in the month spending aggregates
- allow recurring income, recurring expense, and installment sections to start collapsed while keeping title, context, and main action visible

### Domain Entities

Month  
MonthlyIncome  
IncomeTax  
Expense  
Category  
BudgetRule  
BudgetAllocation
ExpenseItem
ExpenseAdjustment

---

## Debt Handling in the New Product Direction

Debt is no longer a first-class collaborative feature of the active product direction.

During the User + Month refactor:

- debts between family members are removed from the main UX
- debt data was treated as archival-only legacy data for export or manual migration support during cutover
- any future debt redesign must treat debt as a user-owned liability or receivable concept, not as a family-member relationship
- final deletion of debt persistence belongs to a separate archival slice and is no longer part of the active schema path

This prevents domain ambiguity during the transition away from shared family ownership.
