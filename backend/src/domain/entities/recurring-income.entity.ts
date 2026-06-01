import { Month } from "./month.entity";
import { IncomeType, TaxationModeType } from "./monthly-income.entity";
import { User } from "./user.entity";

export enum RecurringIncomeKind {
  FIXED_SALARY = "fixed_salary",
  RECURRING_EXTRA = "recurring_extra",
}

export enum RecurringIncomeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface RecurringIncome {
  id: string;
  user: User;
  description: string;
  grossIncome: number;
  incomeType: IncomeType;
  kind: RecurringIncomeKind;
  startMonth: Month;
  occurrences?: number;
  status: RecurringIncomeStatus;
  taxationMode: TaxationModeType;
  taxationProfile?: string; // todo: identificr valores.
  taxationParameters?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;

  validateBaseFields(): void;
}

export class RecurringIncomeEntity implements RecurringIncome {
  id: string;
  user: User;
  description: string;
  grossIncome: number;
  incomeType: IncomeType;
  kind: RecurringIncomeKind;
  startMonth: Month;
  occurrences?: number;
  status: RecurringIncomeStatus;
  taxationMode: TaxationModeType;
  taxationProfile?: string; // todo: identificr valores.
  taxationParameters?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<RecurringIncome>) {
    Object.assign(this, data);
  }

  validateBaseFields() {
    if (!this.description || this.description.length > 255) {
      throw new Error(
        "Description is required and must be at most 255 characters",
      );
    }

    if (this.grossIncome <= 0) {
      throw new Error("Recurring income amount must be greater than zero");
    }

    if (!this.incomeType) {
      throw new Error("Income type is required");
    }

    if (!Object.values(RecurringIncomeKind).includes(this.kind)) {
      throw new Error(
        "Recurring income kind must be fixed_salary or recurring_extra",
      );
    }

    if (!Object.values(RecurringIncomeStatus).includes(this.status)) {
      throw new Error("Status must be active or inactive");
    }
  }
}
