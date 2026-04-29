# Domain Aggregates

## Purpose

This document defines the domain aggregates used in the system.

Aggregates define **consistency boundaries** in the domain model.

They help AI assistants understand:

- which entities belong together
- where business rules should live
- which objects control state changes

AI tools must use this document when generating:

- services
- repositories
- domain logic

This document complements:

docs/domain/domain-model.md

---

# Aggregate Design Principles

Each aggregate has:

- a root entity
- internal entities or value objects
- business rules
- state consistency responsibilities

Only the **aggregate root** should be modified directly by external layers.

Controllers and services must interact with the aggregate root.

---

# Aggregate: Account

## Aggregate Root

Account

## Purpose

Represents a financial account where money is stored.

Examples:

- bank account
- cash wallet
- digital wallet

This aggregate is responsible for maintaining the account balance.

---

## Entities Inside the Aggregate

Account

---

## Business Responsibilities

The Account aggregate is responsible for:

- storing the account information
- maintaining the account balance
- applying balance changes

Balance changes must occur when:

- income is registered
- expense is registered

---

## Business Rules

Rules enforced by the aggregate:

1. Account balance cannot be modified directly by external services.
2. Balance must be updated only through transactions.
3. Balance must always reflect the sum of all transactions.

---

## External Interactions

The following aggregates may interact with Account:

Expense  
Income

However, they must not directly modify internal state.

---

# Aggregate: Expense

## Aggregate Root

Expense

## Purpose

Represents money leaving an account.

Examples:

- groceries
- rent
- subscriptions
- transportation

---

## Entities Inside the Aggregate

Expense

---

## Responsibilities

The Expense aggregate is responsible for:

- storing expense information
- associating the expense with an account
- defining the amount and date of the expense

---

## Business Rules

1. Expense must always be associated with an account.
2. Expense amount must be positive.
3. Expense creation must trigger account balance reduction.

---

# Aggregate: Income

## Aggregate Root

Income

## Purpose

Represents money entering an account.

Examples:

- salary
- freelance payment
- refund

---

## Entities Inside the Aggregate

Income

---

## Responsibilities

The Income aggregate is responsible for:

- storing income information
- associating income with an account
- defining amount and date

---

## Business Rules

1. Income must be associated with an account.
2. Income amount must be positive.
3. Income creation must trigger account balance increase.

---

# Aggregate Interaction Rules

Aggregates must interact through services.

Controllers should never manipulate aggregates directly.

Example flow:

Controller  
→ Service  
→ Aggregate  
→ Repository

---

# AI Usage Instructions

When generating domain logic, AI tools must:

1. Identify the aggregate root involved.
2. Apply business rules defined in the aggregate.
3. Use services to coordinate interactions between aggregates.

Controllers must remain thin.

Business logic must live inside services that coordinate aggregates.

---

# Expected Result

Using this document, AI tools should generate:

- domain services
- business rule validations
- consistent domain logic

aligned with the aggregate boundaries.