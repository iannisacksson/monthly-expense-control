import { User } from "./user.model"
import { Family } from "./family.model"
import { FamilyMember } from "./family-member.model"
import { Month } from "./month.model"
import { MonthlyIncome } from "./monthly-income.model"
import { RecurringIncome } from "./recurring-income.model"
import { IncomeTax } from "./income-tax.model"
import { Category } from "./category.model"
import { Subcategory } from "./subcategory.model"
import { Expense } from "./expense.model"
import { InstallmentGroup } from "./installment-group.model"
import { RecurringExpense } from "./recurring-expense.model"
import { Debt } from "./debt.model"
import { BudgetRule } from "./budget-rule.model"
import { BudgetAllocation } from "./budget-allocation.model"

// Family <-> User (many-to-many through FamilyMember)
Family.hasMany(FamilyMember, { foreignKey: "family_id" })
FamilyMember.belongsTo(Family, { foreignKey: "family_id" })

User.hasMany(FamilyMember, { foreignKey: "user_id" })
FamilyMember.belongsTo(User, { foreignKey: "user_id" })

// Family -> Month
Family.hasMany(Month, { foreignKey: "family_id" })
Month.belongsTo(Family, { foreignKey: "family_id" })

// User -> Month
User.hasMany(Month, { foreignKey: "user_id" })
Month.belongsTo(User, { foreignKey: "user_id" })

// Month -> MonthlyIncome
Month.hasMany(MonthlyIncome, { foreignKey: "month_id" })
MonthlyIncome.belongsTo(Month, { foreignKey: "month_id" })

// User -> MonthlyIncome
User.hasMany(MonthlyIncome, { foreignKey: "user_id" })
MonthlyIncome.belongsTo(User, { foreignKey: "user_id" })

// RecurringIncome -> MonthlyIncome
RecurringIncome.hasMany(MonthlyIncome, { foreignKey: "recurring_income_id" })
MonthlyIncome.belongsTo(RecurringIncome, { foreignKey: "recurring_income_id" })

// Family -> RecurringIncome
Family.hasMany(RecurringIncome, { foreignKey: "family_id" })
RecurringIncome.belongsTo(Family, { foreignKey: "family_id" })

// User -> RecurringIncome
User.hasMany(RecurringIncome, { foreignKey: "user_id" })
RecurringIncome.belongsTo(User, { foreignKey: "user_id" })

// MonthlyIncome -> IncomeTax
MonthlyIncome.hasMany(IncomeTax, { foreignKey: "monthly_income_id" })
IncomeTax.belongsTo(MonthlyIncome, { foreignKey: "monthly_income_id" })

// Family -> Category
Family.hasMany(Category, { foreignKey: "family_id" })
Category.belongsTo(Family, { foreignKey: "family_id" })

// User -> Category
User.hasMany(Category, { foreignKey: "user_id" })
Category.belongsTo(User, { foreignKey: "user_id" })

// Category -> Subcategory
Category.hasMany(Subcategory, { foreignKey: "category_id" })
Subcategory.belongsTo(Category, { foreignKey: "category_id" })

// Family -> Expense
Family.hasMany(Expense, { foreignKey: "family_id" })
Expense.belongsTo(Family, { foreignKey: "family_id" })

// Month -> Expense
Month.hasMany(Expense, { foreignKey: "month_id" })
Expense.belongsTo(Month, { foreignKey: "month_id" })

// Category -> Expense
Category.hasMany(Expense, { foreignKey: "category_id" })
Expense.belongsTo(Category, { foreignKey: "category_id" })

// Subcategory -> Expense
Subcategory.hasMany(Expense, { foreignKey: "subcategory_id" })
Expense.belongsTo(Subcategory, { foreignKey: "subcategory_id" })

// User -> Expense (paid_by)
User.hasMany(Expense, { foreignKey: "paid_by", as: "paidExpenses" })
Expense.belongsTo(User, { foreignKey: "paid_by", as: "payer" })

// User -> Expense (responsible_user_id)
User.hasMany(Expense, { foreignKey: "responsible_user_id", as: "responsibleExpenses" })
Expense.belongsTo(User, { foreignKey: "responsible_user_id", as: "responsibleUser" })

// InstallmentGroup -> Expense
InstallmentGroup.hasMany(Expense, { foreignKey: "installment_group_id" })
Expense.belongsTo(InstallmentGroup, { foreignKey: "installment_group_id" })

// Family -> InstallmentGroup
Family.hasMany(InstallmentGroup, { foreignKey: "family_id" })
InstallmentGroup.belongsTo(Family, { foreignKey: "family_id" })

// User -> InstallmentGroup
User.hasMany(InstallmentGroup, { foreignKey: "user_id" })
InstallmentGroup.belongsTo(User, { foreignKey: "user_id" })

// RecurringExpense -> Expense
RecurringExpense.hasMany(Expense, { foreignKey: "recurring_expense_id" })
Expense.belongsTo(RecurringExpense, { foreignKey: "recurring_expense_id" })

// Family -> RecurringExpense
Family.hasMany(RecurringExpense, { foreignKey: "family_id" })
RecurringExpense.belongsTo(Family, { foreignKey: "family_id" })

// User -> RecurringExpense
User.hasMany(RecurringExpense, { foreignKey: "user_id" })
RecurringExpense.belongsTo(User, { foreignKey: "user_id" })

// Family -> Debt
Family.hasMany(Debt, { foreignKey: "family_id" })
Debt.belongsTo(Family, { foreignKey: "family_id" })

// User -> Debt (creditor)
User.hasMany(Debt, { foreignKey: "creditor_id", as: "creditorDebts" })
Debt.belongsTo(User, { foreignKey: "creditor_id", as: "creditor" })

// User -> Debt (debtor)
User.hasMany(Debt, { foreignKey: "debtor_id", as: "debtorDebts" })
Debt.belongsTo(User, { foreignKey: "debtor_id", as: "debtor" })

// Expense -> Debt
Expense.hasMany(Debt, { foreignKey: "expense_id" })
Debt.belongsTo(Expense, { foreignKey: "expense_id" })

// Family -> BudgetRule
Family.hasMany(BudgetRule, { foreignKey: "family_id" })
BudgetRule.belongsTo(Family, { foreignKey: "family_id" })

// User -> BudgetRule
User.hasMany(BudgetRule, { foreignKey: "user_id" })
BudgetRule.belongsTo(User, { foreignKey: "user_id" })

// BudgetRule -> Month
BudgetRule.hasMany(Month, { foreignKey: "budget_rule_id" })
Month.belongsTo(BudgetRule, { foreignKey: "budget_rule_id" })

// BudgetRule -> BudgetAllocation
BudgetRule.hasMany(BudgetAllocation, { foreignKey: "budget_rule_id" })
BudgetAllocation.belongsTo(BudgetRule, { foreignKey: "budget_rule_id" })

// Category -> BudgetAllocation
Category.hasMany(BudgetAllocation, { foreignKey: "category_id" })
BudgetAllocation.belongsTo(Category, { foreignKey: "category_id" })

export {
  User,
  Family,
  FamilyMember,
  Month,
  MonthlyIncome,
  RecurringIncome,
  IncomeTax,
  Category,
  Subcategory,
  Expense,
  InstallmentGroup,
  RecurringExpense,
  Debt,
  BudgetRule,
  BudgetAllocation
}
