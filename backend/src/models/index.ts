import { User } from "./user.model";
import { Month } from "./month.model";
import { MonthlyIncome } from "./monthly-income.model";
import { RecurringIncome } from "./recurring-income.model";
import { IncomeTax } from "./income-tax.model";
import { CategoryModel } from "./category.model";
import { Subcategory } from "./subcategory.model";
import { Expense } from "./expense.model";
import { ExpenseItem } from "./expense-item.model";
import { ExpenseAdjustment } from "./expense-adjustment.model";
import { InstallmentGroup } from "./installment-group.model";
import { RecurringExpense } from "./recurring-expense.model";
import { BudgetRule } from "./budget-rule.model";
import { BudgetAllocation } from "./budget-allocation.model";
import { AuthSession } from "./auth-session.model";
import { AuthAuditLog } from "./auth-audit-log.model";

// User -> Month
User.hasMany(Month, { foreignKey: "user_id" });
Month.belongsTo(User, { foreignKey: "user_id" });

// Month -> MonthlyIncome
Month.hasMany(MonthlyIncome, { foreignKey: "month_id" });
MonthlyIncome.belongsTo(Month, { foreignKey: "month_id" });

// User -> MonthlyIncome
User.hasMany(MonthlyIncome, { foreignKey: "user_id" });
MonthlyIncome.belongsTo(User, { foreignKey: "user_id" });

// RecurringIncome -> MonthlyIncome
RecurringIncome.hasMany(MonthlyIncome, { foreignKey: "recurring_income_id" });
MonthlyIncome.belongsTo(RecurringIncome, { foreignKey: "recurring_income_id" });

// User -> RecurringIncome
User.hasMany(RecurringIncome, { foreignKey: "user_id" });
RecurringIncome.belongsTo(User, { foreignKey: "user_id" });

// MonthlyIncome -> IncomeTax
MonthlyIncome.hasMany(IncomeTax, { foreignKey: "monthly_income_id" });
IncomeTax.belongsTo(MonthlyIncome, { foreignKey: "monthly_income_id" });

// User -> Category
User.hasMany(CategoryModel, { foreignKey: "user_id" });
CategoryModel.belongsTo(User, { foreignKey: "user_id" });

// Category -> Subcategory
CategoryModel.hasMany(Subcategory, { foreignKey: "category_id" });
Subcategory.belongsTo(CategoryModel, { foreignKey: "category_id" });

// Month -> Expense
Month.hasMany(Expense, { foreignKey: "month_id" });
Expense.belongsTo(Month, { foreignKey: "month_id" });

// Category -> Expense
CategoryModel.hasMany(Expense, { foreignKey: "category_id" });
Expense.belongsTo(CategoryModel, { foreignKey: "category_id" });

// Subcategory -> Expense
Subcategory.hasMany(Expense, { foreignKey: "subcategory_id" });
Expense.belongsTo(Subcategory, { foreignKey: "subcategory_id" });

// User -> Expense (paid_by)
User.hasMany(Expense, { foreignKey: "paid_by", as: "paidExpenses" });
Expense.belongsTo(User, { foreignKey: "paid_by", as: "payer" });

// User -> Expense (responsible_user_id)
User.hasMany(Expense, {
  foreignKey: "responsible_user_id",
  as: "responsibleExpenses",
});
Expense.belongsTo(User, {
  foreignKey: "responsible_user_id",
  as: "responsibleUser",
});

// InstallmentGroup -> Expense
InstallmentGroup.hasMany(Expense, { foreignKey: "installment_group_id" });
Expense.belongsTo(InstallmentGroup, { foreignKey: "installment_group_id" });

// Expense -> ExpenseAdjustment
Expense.hasMany(ExpenseAdjustment, { foreignKey: "expense_id" });
ExpenseAdjustment.belongsTo(Expense, { foreignKey: "expense_id" });

// Expense -> ExpenseItem
Expense.hasMany(ExpenseItem, { foreignKey: "expense_id" });
ExpenseItem.belongsTo(Expense, { foreignKey: "expense_id" });

// User -> InstallmentGroup
User.hasMany(InstallmentGroup, { foreignKey: "user_id" });
InstallmentGroup.belongsTo(User, { foreignKey: "user_id" });

// RecurringExpense -> Expense
RecurringExpense.hasMany(Expense, { foreignKey: "recurring_expense_id" });
Expense.belongsTo(RecurringExpense, { foreignKey: "recurring_expense_id" });

// User -> RecurringExpense
User.hasMany(RecurringExpense, { foreignKey: "user_id" });
RecurringExpense.belongsTo(User, { foreignKey: "user_id" });

// User -> BudgetRule
User.hasMany(BudgetRule, { foreignKey: "user_id" });
BudgetRule.belongsTo(User, { foreignKey: "user_id" });

// BudgetRule -> Month
BudgetRule.hasMany(Month, { foreignKey: "budget_rule_id" });
Month.belongsTo(BudgetRule, { foreignKey: "budget_rule_id" });

// BudgetRule -> BudgetAllocation
BudgetRule.hasMany(BudgetAllocation, { foreignKey: "budget_rule_id" });
BudgetAllocation.belongsTo(BudgetRule, { foreignKey: "budget_rule_id" });

// Category -> BudgetAllocation
CategoryModel.hasMany(BudgetAllocation, { foreignKey: "category_id" });
BudgetAllocation.belongsTo(CategoryModel, { foreignKey: "category_id" });

// User -> AuthSession
User.hasMany(AuthSession, { foreignKey: "user_id" });
AuthSession.belongsTo(User, { foreignKey: "user_id" });

// User -> AuthAuditLog
User.hasMany(AuthAuditLog, { foreignKey: "user_id" });
AuthAuditLog.belongsTo(User, { foreignKey: "user_id" });

// AuthSession -> AuthAuditLog
AuthSession.hasMany(AuthAuditLog, { foreignKey: "session_id" });
AuthAuditLog.belongsTo(AuthSession, { foreignKey: "session_id" });

export {
  User,
  Month,
  MonthlyIncome,
  RecurringIncome,
  IncomeTax,
  CategoryModel,
  Subcategory,
  Expense,
  ExpenseItem,
  ExpenseAdjustment,
  InstallmentGroup,
  RecurringExpense,
  BudgetRule,
  BudgetAllocation,
  AuthSession,
  AuthAuditLog,
};
