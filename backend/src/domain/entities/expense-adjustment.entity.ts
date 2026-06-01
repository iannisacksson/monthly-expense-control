import { Expense } from "./expense.entity";
import { User } from "./user.entity";

export interface ExpenseAdjustment {
  id: string;
  expense: Expense;
  changedBy?: User;
  previousValue: number;
  newValue: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ExpenseAdjustmentEntity implements ExpenseAdjustment {
  id: string;
  expense: Expense;
  changedBy?: User;
  previousValue: number;
  newValue: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ExpenseAdjustment>) {
    Object.assign(this, data);
  }
}
