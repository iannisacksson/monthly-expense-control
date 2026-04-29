# Domain Events

## Purpose

This document defines the domain events that occur in the system.

Domain events represent **important business moments** that occur when the state of the system changes.

They help AI assistants understand:

- when important domain changes occur
- how aggregates interact
- when business logic should be triggered

AI tools must use this document when generating:

- services
- domain logic
- event-based workflows

This document complements:

docs/domain/domain-model.md  
docs/domain/aggregates.md

---

# Event Principles

Domain events represent:

a business action that already happened.

Examples:

- an expense was created
- income was registered
- an account balance changed

Events should describe **past actions**.

Example naming convention:
Entity + PastTense


Examples:


ExpenseCreated
IncomeRegistered
AccountBalanceUpdated


---

# Event: ExpenseCreated

## Description

Triggered when a new expense is registered in the system.

## Trigger

Occurs after a user successfully creates an expense.

## Aggregates Involved

Expense  
Account

## Business Effects

The system must:

1. store the expense
2. reduce the balance of the associated account

---

# Event: ExpenseUpdated

## Description

Triggered when an existing expense is modified.

## Aggregates Involved

Expense  
Account

## Business Effects

The system must:

1. update the expense data
2. recalculate the account balance if the amount changed

---

# Event: ExpenseDeleted

## Description

Triggered when an expense is removed.

## Aggregates Involved

Expense  
Account

## Business Effects

The system must:

1. remove the expense
2. restore the amount to the associated account balance

---

# Event: IncomeRegistered

## Description

Triggered when a new income is registered.

## Aggregates Involved

Income  
Account

## Business Effects

The system must:

1. store the income record
2. increase the balance of the associated account

---

# Event: IncomeUpdated

## Description

Triggered when an income record is modified.

## Aggregates Involved

Income  
Account

## Business Effects

The system must:

1. update the income record
2. adjust the account balance if the amount changed

---

# Event: IncomeDeleted

## Description

Triggered when an income record is removed.

## Aggregates Involved

Income  
Account

## Business Effects

The system must:

1. delete the income record
2. reduce the account balance accordingly

---

# Event: AccountCreated

## Description

Triggered when a new financial account is created.

## Aggregates Involved

Account

## Business Effects

The system must:

1. store the account
2. initialize its balance to zero

---

# AI Usage Instructions

When generating backend logic, AI tools must:

1. trigger domain events after state changes
2. ensure aggregates remain consistent
3. update related aggregates when events occur

Controllers should not manage events directly.

Events must be triggered by **services coordinating aggregates**.

---

# Expected Outcome

Using these events, AI tools should generate:

- event-aware services
- domain logic coordination
- consistent balance updates