# ADR-003 — Refactor Core Context from Family + Month to User + Month

## Status

Accepted

Implementation state: In progress

---

# Context

The current product is modeled as a collaborative family finance system.

The main ownership boundary is:

Family + Month

This ownership is enforced across:

- domain documents
- API routes and DTOs
- Sequelize associations
- service validations
- repository filters
- frontend routes and data fetching

Concrete examples in the current implementation:

- Month belongs to `family_id`
- Category belongs to `family_id`
- BudgetRule belongs to `family_id`
- Expense belongs to `family_id` and `month_id`
- Debt is scoped by `family_id`
- RecurringExpense and InstallmentGroup generate expenses under `family_id`
- frontend navigation uses `/families/:familyId/...`

The new product direction is personal finance management.

The new ownership boundary must become:

User + Month

This is an architectural and domain refactor, not a route rename.

---

# Decision

The system will be refactored so that the primary financial boundary is the user.

The target model is:

User + Month

with month-centered financial operations preserved.

## Ownership Rules

The following ownership rules are adopted:

- User becomes the root financial owner of personal data.
- Month belongs directly to `user_id`.
- Category belongs directly to `user_id`.
- BudgetRule belongs directly to `user_id`.
- Expense belongs to `user_id` and `month_id`.
- MonthlyIncome remains owned by `user_id` and `month_id`.
- RecurringIncome belongs to `user_id`.
- RecurringExpense belongs to `user_id`.
- InstallmentGroup belongs to `user_id`.
- Subcategory continues to belong to Category.

`Month` remains the monthly organizational boundary, with `status` preserved as `open` or `closed`.

## Entities Removed or Demoted

The following decisions apply to the collaborative model:

- Family stops being a first-class aggregate for financial ownership.
- FamilyMember stops being part of the main domain model.
- family-based screens, routes, repositories, DTOs, and services must be removed after migration.

During migration, Family and FamilyMember may remain temporarily as legacy persistence artifacts only until data backfill and cutover are complete.

## Debt Decision

Debt no longer represents obligations between family members.

To keep the individual product coherent, Debt is demoted from the collaborative model and must follow one of these rules:

- short term: keep the table as legacy and remove it from the primary UX and product scope during the refactor
- long term: redesign Debt as a user-owned liability record against an external counterparty, not another internal user

For the refactor rollout, the safe decision is:

- remove family-member debt flows from the active product scope
- keep existing debt data readable only if needed for migration/export
- avoid redesigning Debt in the same migration step that changes the ownership boundary

This avoids mixing two domain changes in one cutover.

## Authentication and Route Design

The frontend store now persists token and current user identity, but the application still keeps explicit route parameters and compatibility behavior during the migration.

The current backend also does not show an active request identity layer in the main app wiring.

Because of that, authentication does not yet provide enough verified identity to immediately collapse all routes to implicit `/me` semantics.

The safe route migration is:

- first introduce user-scoped application services and endpoints
- allow explicit `user_id` resolution at the backend boundary during transition
- add authenticated user resolution middleware
- only then simplify routes and payloads to operate on the authenticated user context

This prevents hidden coupling to incomplete auth infrastructure.

## Current Implementation Snapshot

The migration is partially implemented.

Observed current state:

- user-scoped data paths already exist for part of the application
- legacy family-scoped routes, services, and screens still exist
- compatibility behavior is still active in both backend and frontend
- the repository has been consolidated as a monorepo, but the domain migration is not complete

Expected cutover behavior for months:

- month list and month detail navigation must be user-scoped only
- family-scoped month routes must be removed from backend and frontend
- remaining family compatibility must not reintroduce month navigation under `/families/:familyId/months`

Current compatibility decision for adjacent flows:

- budget management is already being cut over to user-scoped frontend routes and must be reachable from month detail under `/users/:userId/budgets`
- category and subcategory frontend routes are now user-scoped only
- category backend listing is now user-scoped only
- budget rule listing in the active application is now user-scoped only
- family-scoped expense listing is no longer part of the active frontend surface and should not return as a compatibility path

This ADR remains the target architectural direction and must be read together with the current transitional reality.

---

# Impact Analysis

## What Can Be Removed

These parts can be removed after cutover:

- Family CRUD flows
- FamilyMember CRUD flows
- family-based frontend navigation
- service validations that require family existence
- repository filters centered on `family_id`
- Sequelize associations from Family to financial aggregates
- API endpoints like `/families/...` and `/resource/family/:familyId`

## What Must Be Adapted

These parts must be adapted, not just removed:

- Month uniqueness changes from `(family_id, year, month)` to `(user_id, year, month)`
- Category ownership changes from `family_id` to `user_id`
- BudgetRule ownership changes from `family_id` to `user_id`
- Expense validation changes from `family_id + month_id` to `user_id + month_id`
- Expense category validation must follow the same owner as the selected month, preferring `user_id` and using `family_id` only for legacy fallback months
- RecurringExpense generation must create month records by `user_id`
- InstallmentGroup generation must create month records by `user_id`
- dashboard aggregation queries must filter by `user_id + month_id`
- frontend routes must stop carrying `familyId`
- frontend list and form services must stop calling family-scoped endpoints

## What Requires Data Migration

The following tables require schema and data migration:

- months
- categories
- budget_rules
- expenses
- recurring_incomes
- recurring_expenses
- installment_groups
- debts if legacy preservation is required

The following tables require relational review because they depend on migrated parents:

- budget_allocations
- subcategories
- monthly_incomes
- income_taxes

---

# Safe Migration Strategy

## Guiding Principle

Prefer an additive migration with compatibility windows.

Do not start by deleting Family columns or endpoints.

First make the system capable of running in User + Month, then backfill data, then cut traffic over, and only then remove legacy structures.

## Migration Constraints

A family-scoped dataset cannot be safely split into multiple personal datasets without an explicit ownership rule.

Because existing family data may represent genuinely shared finances, fully automatic distribution across multiple users is unsafe.

Therefore, the migration policy is:

- if a family has exactly one member, automatically map that family to that user
- if a family has multiple members, require an explicit migration owner mapping before backfill
- do not automatically duplicate shared expenses, budgets, or months across multiple users
- record migration decisions in a dedicated mapping table or migration configuration input

This is the safest option because it prevents silent semantic corruption.

## Recommended Migration Phases

### Phase 0 — Contract First

- approve this ADR
- update domain, architecture, API, database, and product docs to the new target model
- define the transitional endpoint strategy and auth assumptions

### Phase 1 — Additive Schema Changes

- add nullable `user_id` to family-owned financial tables that will become user-owned
- add new indexes and future uniqueness constraints using `user_id`
- keep `family_id` temporarily for compatibility
- add migration metadata table to map each legacy family to one target user owner

### Phase 2 — Data Backfill

- backfill `user_id` using the migration mapping
- validate there are no null `user_id` values in migrated rows
- validate each month, category, budget rule, recurring entity, installment group, and expense resolves to the same target user
- produce a dry-run report before applying destructive changes

### Phase 3 — Dual-Read / Dual-Write Service Refactor

- update repositories to support user-scoped queries
- update services to validate against `user_id + month_id`
- keep compatibility reads while legacy data still exists
- move ownership checks out of family validations and into user/month/category invariants
- narrow compatibility windows per resource instead of preserving all family-scoped reads uniformly

### Phase 4 — Feature Completion Under New Model

- block month deletion in backend and remove delete action in frontend
- add month finalization endpoint and UI state handling
- add bulk expense deletion by `user_id + month_id`
- add remove-and-recreate monthly expense behavior for one-off, recurring, and installment expenses
- add scoped edit behavior for recurring and installment series: single month, future occurrences, whole series when applicable

### Phase 5 — Frontend Cutover

- replace `/families/:familyId/...` routes with user-scoped monthly routes
- remove family management screens and navigation
- update dashboard, month details, categories, and budgets to use authenticated user context
- make month status visible and block incompatible actions when closed
- keep only explicitly justified family-scoped screens during transition, with a named removal target for each remaining route

### Phase 6 — Legacy Removal

- remove Family and FamilyMember financial ownership from code
- remove legacy endpoints and DTOs
- remove `family_id` constraints and columns after production validation
- archive or remove legacy debt flows according to the chosen redesign timeline

---

# Target Domain Invariants

The refactor must enforce these invariants:

- a user cannot have two identical months for the same year and month
- an expense must belong to the same user as its month
- a category used by an expense must belong to the same user as the expense
- a budget rule must belong to the same user as the categories it allocates
- a recurring expense series must belong to one user and generate only that user's monthly expenses
- an installment group must belong to one user and generate only that user's monthly expenses
- closed months cannot accept incompatible mutations
- months cannot be deleted

---

# Feature Decisions Under User + Month

## Bulk Expense Deletion

Add a bulk delete command scoped by:

- `user_id`
- `month_id`
- selected expense ids

The service must verify all selected expenses belong to the same user and month before deletion.

## Month Finalization

Add an explicit endpoint to mark a month as `closed`.

Once closed:

- month deletion remains forbidden
- writes that change monthly financial results must be blocked unless a future business rule explicitly allows reopening or privileged override

## Remove and Recreate Monthly Expense

The behavior must distinguish the source of the monthly record:

- one-off expense: delete only the selected record
- recurring expense occurrence: remove only that month record and allow regeneration or manual recreation later
- installment expense occurrence: remove only that monthly occurrence and allow manual recreation when needed without corrupting the series definition

This requires the service layer to treat generated monthly entries as occurrences, not as immutable mirrors of the source series.

## Scoped Edit for Recurring and Installment Flows

Supported scopes must be explicit:

- only this occurrence
- this and future occurrences when the series semantics support regeneration
- whole series when the change is global

The backend contract must encode the scope explicitly, and the frontend must expose it before mutation.

---

# Implementation Order to Reduce Risk

The safest implementation order is:

1. update documentation and formalize the target domain
2. introduce user ownership in schema and data migration support
3. refactor backend repositories and services to user-scoped invariants
4. add month finalization and forbid month deletion
5. add bulk expense deletion
6. add scoped edit and occurrence removal behaviors for recurring and installment flows
7. cut frontend routes and screens over to user context
8. remove legacy family code and columns

This order minimizes simultaneous breakage in persistence, API, and UI.

---

# Consequences

Positive outcomes:

- the product aligns with the new personal finance direction
- ownership rules become simpler and more coherent
- frontend navigation and monthly dashboards become less coupled
- financial data is easier to validate in a single-user context

Negative outcomes:

- migration from collaborative family data requires explicit operator decisions
- debt must be temporarily de-scoped or redesigned
- rollout requires a compatibility period instead of a single hard cut

---

# Related Documents

docs/domain/domain-model.md
docs/domain/validation-rules.md
docs/architecture/backend-architecture.md
docs/architecture/api-spec.md
docs/architecture/database-model.md
docs/product/features.md