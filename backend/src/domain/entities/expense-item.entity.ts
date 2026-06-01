import { Expense } from "./expense.entity";

export interface ExpenseItem {
  id: string;
  expense: Expense;
  description: string;
  amount: number;
  createdAt: Date;
}

export class ExpenseItemEntity implements ExpenseItem {
  id: string;
  expense: Expense;
  description: string;
  amount: number;
  createdAt: Date;

  constructor(data: Partial<ExpenseItem>) {
    Object.assign(this, data);
  }
}
