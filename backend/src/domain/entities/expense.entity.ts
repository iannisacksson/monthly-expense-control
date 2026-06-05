import { Category } from "./category.entity";
import { InstallmentGroup } from "./installment-group.entity";
import { Month } from "./month.entity";
import { RecurringExpense } from "./recurring-expense.entity";
import { Subcategory } from "./subcategory.entity";
import { User } from "./user.entity";

export enum ExpenseKindType {
  STANDARD = "standard",
  ENVELOPE = "envelope",
}

export interface Expense {
  id: string;
  month: Month;
  category: Category;
  subcategory?: Subcategory;
  paidBy?: User;
  responsibleUser?: User;
  installmentGroupId?: InstallmentGroup;
  recurringExpenseId?: RecurringExpense;
  expenseKind: ExpenseKindType;
  plannedAmount: number;
  isPaid: boolean;
  description: string;
  value: number;
  expenseDate: Date;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ExpenseEntity implements Expense {
  id: string;
  month: Month;
  category: Category;
  subcategory?: Subcategory;
  paidBy?: User;
  responsibleUser?: User;
  installmentGroupId?: InstallmentGroup;
  recurringExpenseId?: RecurringExpense;
  expenseKind: ExpenseKindType;
  plannedAmount: number;
  isPaid: boolean;
  description: string;
  value: number;
  expenseDate: Date;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Expense>) {
    Object.assign(this, data);
  }
}
