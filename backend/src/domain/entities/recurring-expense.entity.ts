import { Category } from "./category.entity";
import { Month } from "./month.entity";
import { Subcategory } from "./subcategory.entity";
import { User } from "./user.entity";

export enum ExpenseKindType {
  STANDARD = "standard",
  ENVELOPE = "envelope",
}

export enum RecurringExpenseStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface RecurringExpense {
  id: string;
  user: User;
  description: string;
  value: number;
  expenseKind?: ExpenseKindType;
  plannedAmount?: number;
  category: Category;
  subcategory?: Subcategory;
  paidBy?: User;
  responsibleUser?: User;
  startMonth: Month;
  occurrences?: number;
  status: RecurringExpenseStatus;
  createdAt: Date;
  updatedAt: Date;

  validateBaseFields(): void;
}

export class RecurringExpenseEntity implements RecurringExpense {
  id: string;
  user: User;
  description: string;
  value: number;
  expenseKind?: ExpenseKindType;
  plannedAmount?: number;
  category: Category;
  subcategory?: Subcategory;
  paidBy?: User;
  responsibleUser?: User;
  startMonth: Month;
  occurrences?: number;
  status: RecurringExpenseStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<RecurringExpense>) {
    Object.assign(this, data);
  }

  private static readonly allowedExpenseKinds = [
    "standard",
    "envelope",
  ] as const;

  validateBaseFields(): void {
    if (!this.description || this.description.length > 255) {
      throw new Error(
        "Description is required and must be at most 255 characters",
      );
    }

    if (!Object.values(RecurringExpenseStatus).includes(this.status)) {
      throw new Error("Status must be active or inactive");
    }

    const expenseKind = this.expenseKind ?? ExpenseKindType.STANDARD;
    if (!Object.values(ExpenseKindType).includes(expenseKind)) {
      throw new Error("Recurring expense kind must be standard or envelope");
    }

    if (expenseKind === ExpenseKindType.ENVELOPE) {
      if (this.value < 0) {
        throw new Error(
          "Recurring envelope expenses cannot define a negative current amount",
        );
      }

      if (
        this.plannedAmount === undefined ||
        this.plannedAmount === null ||
        this.plannedAmount <= 0
      ) {
        throw new Error(
          "Recurring envelope expenses must define a planned amount greater than zero",
        );
      }

      return;
    }

    if (this.value <= 0) {
      throw new Error("Recurring expense amount must be greater than zero");
    }

    if (
      this.plannedAmount !== undefined &&
      this.plannedAmount !== null &&
      this.plannedAmount <= 0
    ) {
      throw new Error("Planned amount must be greater than zero when provided");
    }
  }
}
