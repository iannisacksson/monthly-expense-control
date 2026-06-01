import { BadRequestError } from "../../utils/errors";
import { Month } from "./month.entity";
import { RecurringIncome } from "./recurring-income.entity";
import { User } from "./user.entity";

export enum IncomeType {
  SALARY = "salary",
  BUSINESS = "business",
  INVESTMENT = "investment",
  OTHER = "other",
}

export enum TaxationModeType {
  MANUAL = "manual",
  AUTOMATIC = "automatic",
}

export interface MonthlyIncome {
  id: string;
  user: User;
  month: Month;
  recurringIncome?: RecurringIncome;
  grossIncome: number;
  incomeType: IncomeType;
  taxationMode: TaxationModeType;
  taxationProfile?: string; // todo: identificr valores.
  taxationParameters?: Record<string, unknown>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  validateGrossIncome(): void;
  validateNotes(): void;
}

export class MonthlyIncomeEntity implements MonthlyIncome {
  id: string;
  user: User;
  month: Month;
  recurringIncome?: RecurringIncome;
  grossIncome: number;
  incomeType: IncomeType;
  taxationMode: TaxationModeType;
  taxationProfile?: string; // todo: identificr valores.
  taxationParameters?: Record<string, unknown>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<MonthlyIncome>) {
    Object.assign(this, data);
  }

  validateGrossIncome() {
    if (this.grossIncome <= 0) {
      throw new BadRequestError("Income amount must be greater than zero");
    }
  }

  validateNotes() {
    if (this.notes && this.notes.length > 255) {
      throw new BadRequestError("Income notes must be at most 255 characters");
    }
  }
}
