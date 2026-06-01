# Domain Model

## Purpose

This document defines the core business domain model of the application.

The goal of this document is to:

- define the business entities
- describe relationships between entities
- establish domain rules
- provide a single source of truth for the domain

This file is also used as context for AI-assisted development.

Because of that:

- entities must use consistent naming
- rules must be explicit
- domain concepts must be clearly described

The system being built is a personal financial manager focused on helping each user manage monthly finances.

---

# Core Domain Concepts

The system is built around individual financial management.

All financial operations occur within the context of:

User + Month

Examples:

- income is registered per user and month
- expenses belong to a user and month
- budgets are defined per user
- dashboard aggregations are month based for a user

Month remains the main time boundary for planning, visibility, and control.

---

# Entities

## User

### Purpose

Represents the owner of a personal financial workspace.

Users can:

- register income
- create expenses
- classify spending
- manage recurring and installment flows
- define budget rules
- close a month

### Fields

id
name
email
createdAt

### Relationships

User
├── Month
├── Category
├── BudgetRule
├── Expense
├── MonthlyIncome
├── RecurringIncome
├── RecurringExpense
└── InstallmentGroup

---

## Month

### Purpose

Represents a financial period for one user.

All monthly financial operations occur within a specific month.

Examples:

2026-03
2026-04

### Fields

id
userId
year
month
status
createdAt

### Rules

A user cannot have two identical months.

Constraint:

UNIQUE (userId, year, month)

A month cannot be deleted.

A closed month blocks incompatible financial mutations.

### Relationships

Month
├── MonthlyIncome
├── Expense
└── User

---

## MonthlyIncome

### Purpose

Represents the income of a user in a specific month.

Income belongs to:

User + Month

This allows:

- variable income
- bonuses
- freelance payments
- commissions
- generated income from fixed salary templates
- generated income from recurring extra-income templates

### Fields

id
userId
monthId
recurringIncomeId
grossIncome
incomeType
notes
createdAt

### Relationships

MonthlyIncome
├── User
├── Month
├── RecurringIncome
└── IncomeTax

---

## RecurringIncome

### Purpose

Represents an income template owned by one user that keeps generating MonthlyIncome records from its start month onward while it remains active.

Examples:

- fixed salary
- recurring freelance contract
- recurring overtime allowance
- recurring profit sharing installment

### Fields

id
userId
description
grossIncome
incomeType
kind
startMonthId
status
createdAt

### Relationships

RecurringIncome
├── User
├── Month (startMonth)
└── MonthlyIncome

### Rules

Recurring income templates belong to the owner user of the month where they were created.

Recurring income templates generate MonthlyIncome records for all eligible owner months from the start month onward while active.

Recurring income may optionally define an upper bound through occurrences, but the default behavior is continuous generation until the template is inactivated.

Recurring income generation must not create duplicates for the same template and month.

Fixed salary is modeled as a recurring income template with a specific kind.

---

## IncomeTax

### Purpose

Represents taxes associated with a monthly income.

Taxes can be:

- automatically calculated
- manually entered

### Fields

id
monthlyIncomeId
taxType
value
isAuto

Examples of taxes:

INSS
FGTS
DAS
Custom

---

## Category

### Purpose

Represents a top-level expense classification.

Categories are customized per user.

Examples:

Essential
Necessary
Lifestyle
Investment

### Fields

id
userId
name
type

### Rules

A category must belong to a single user.

A category can be used by expenses and budget allocations owned by the same user.

---

## Subcategory

### Purpose

Represents a detailed classification within a category.

Examples:

Category: Essential
Subcategory: Food

Category: Lifestyle
Subcategory: Travel

### Fields

id
categoryId
name

---

## BudgetRule

### Purpose

Represents a reusable budgeting strategy for one user.

Examples:

50/30/20
Essentials First
Low Fixed Cost

### Fields

id
userId
name
createdAt

### Relationships

BudgetRule
├── User
├── BudgetAllocation
└── Category

### Rules

Budget rules are owned by one user.

Budget allocations inside a rule must reference categories owned by the same user.

---

## BudgetAllocation

### Purpose

Represents the planned percentage assigned to a category inside a budget rule.

### Fields

id
budgetRuleId
categoryId
percentage
createdAt

### Rules

Budget allocations must belong to a budget rule.

Each allocation must reference a category compatible with the same user-owned budget rule.

---

## Expense

### Purpose

Represents a financial expense.

Each expense belongs to:

User
Month
Category
Subcategory

Expenses are the core financial record of the system.

### Fields

id
userId
monthId
categoryId
subcategoryId
paidBy
responsibleUserId
installmentGroupId
recurringExpenseId
isPaid
description
value
expenseDate
paymentDate
expenseKind
plannedAmount
createdAt

### Rules

Every expense must belong to a month.

Every expense must belong to the same user as its month.

Month association defines when the expense belongs in the dashboard and monthly balance.

paymentDate records when the expense was actually paid.

expenseDate is optional operational metadata and must not be the central decision point for monthly belonging.

Every expense has a payment state for that monthly record.

Expense may be a standard expense or an envelope expense.

Envelope expenses keep the official current value in the same Expense record, but that value is derived from the sum of ExpenseItem records.

Envelope expenses may define a plannedAmount to compare the current monthly value against the original target.

Envelope expenses must not receive manual current-value editing in the primary flow.

Changes to the current value of an envelope expense happen through ExpenseItem records and may generate ExpenseAdjustment records as audit history.

Installment expenses may be generated automatically.

Recurring expenses may be generated automatically.

An expense may be removed from a month and recreated later when business rules allow it.

### Relationships

Expense
├── Month
├── Category
├── Subcategory
├── RecurringExpense
├── InstallmentGroup
├── ExpenseItem
└── ExpenseAdjustment

---

## ExpenseItem

### Purpose

Represents a named subitem inside an envelope expense.

### Fields

id
expenseId
description
amount
createdAt

### Rules

Expense items belong to exactly one envelope expense.

The current value of an envelope expense is the sum of its ExpenseItem amounts.

Expense items are the primary input used to change the current value of an envelope expense.

---

## ExpenseAdjustment

### Purpose

Represents the audit history of value changes applied to an envelope expense during the month.

### Fields

id
expenseId
changedBy
previousValue
newValue
createdAt

### Rules

Expense adjustments belong to exactly one expense.

Expense adjustments do not replace the current value stored in Expense.

Expense adjustments exist to preserve the timeline of value changes derived from ExpenseItem mutations.

---

## InstallmentGroup

### Purpose

Represents a purchase made in installments.

Example:

TV
Total: 2000
Installments: 10

The system automatically generates one monthly expense per installment.

If the user starts tracking the purchase later, the system generates only the remaining installments while preserving the original numbering.

### Fields

id
userId
description
totalValue
installments
startingInstallmentNumber
categoryId
subcategoryId
paidBy
responsibleUserId
startMonthId
createdAt

### Relationships

InstallmentGroup
├── User
├── Month (startMonth)
└── Expense

### Rules

Installment groups generate expense occurrences across future months.

Edits may apply to one occurrence, future occurrences, or the whole series depending on the requested scope.

---

## RecurringExpense

### Purpose

Represents a predictable expense that should appear automatically in future months.

Examples:

Rent
Gym
Internet subscription

### Fields

id
userId
description
value
expenseKind
plannedAmount
categoryId
subcategoryId
paidBy
responsibleUserId
startMonthId
status
createdAt

### Relationships

RecurringExpense
├── User
├── Month (startMonth)
└── Expense

### Rules

Recurring expenses generate expense occurrences across owner months from the start month onward while active.

Recurring expenses may also represent recurring envelope templates when expenseKind is envelope.

Recurring envelope expenses must propagate both the current value and the plannedAmount into generated monthly expenses.

Recurring expenses may optionally define an upper bound through occurrences, but the default behavior is continuous generation until the template is inactivated.

The system must not generate duplicate expenses for the same recurring definition and month.

Edits may apply to one occurrence, future occurrences, or the whole series depending on the requested scope.

---

## Debt

### Purpose

Debt is no longer a central aggregate of the active product direction.

During the migration away from collaborative finance, debt between family members is treated as legacy domain behavior.

### Decision

Debt must not define the ownership model of the new personal finance product.

If kept temporarily, it must be treated as:

- legacy data for migration or export
- or a future user-owned liability concept to be redesigned separately

It must not remain a family-scoped aggregate in the target model.

---

# Aggregate Boundaries

The main aggregate roots of the target model are:

- User as the financial owner
- Month as the monthly operational boundary
- Category as the expense classification boundary
- BudgetRule as the budgeting boundary
- Expense as the monthly expense and envelope boundary
- ExpenseItem as the envelope composition boundary
- ExpenseAdjustment as the envelope audit-history boundary
- RecurringExpense as a recurring expense series boundary
- InstallmentGroup as an installment series boundary
- RecurringIncome as an income series boundary

The system must no longer treat Family as the aggregate root for financial ownership.

---

## Estrutura de Entidade de Domínio

Toda entidade de domínio segue o padrão de interface + classe de implementação.

### Interface

Define o contrato do aggregate/entidade:

```ts
export interface XxxEntity {
  id: string;
  // campos de valor
  // associações como tipos de domínio (não IDs)
  user: User;
  // métodos de validação/comportamento
  validateSomething(): void;
}
```

### Classe

Implementa a interface. Aceita dados parciais no constructor via `Object.assign`:

```ts
export class XxxEntityImpl implements XxxEntity {
  id: string;
  user: User;

  constructor(data: Partial<XxxEntity>) {
    Object.assign(this, data);
  }

  validateSomething() {
    // lógica de negócio aqui
  }
}
```

### Regras

- **A interface é a fonte da verdade** para campos e comportamentos do domínio.
- **Validações pertencem à entidade**, não ao model Sequelize nem ao controller.
- **Associações são sempre tipadas como entidades de domínio** (`User`, `Month`, etc.), nunca como IDs (`userId: string`).
- **IDs de FK** existem apenas no Sequelize model, para mapeamento de banco.
- **A classe entity não depende de Sequelize**; é puramente de domínio.
