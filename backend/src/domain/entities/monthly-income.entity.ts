import { BadRequestError } from "../../utils/errors";

export interface MonthlyIncome {
  id: string;
  userId: string;
  monthId: string;
  recurringIncomeId?: string | null;
  grossIncome: number;
  incomeType: string;
  taxationMode: "manual" | "automatic";
  taxationProfile?: string | null;
  taxationParameters?: Record<string, unknown> | null;
  notes?: string | null;
  createdAt: Date;
}

export class MonthlyIncomeEntity implements MonthlyIncome {
  id!: string;
  userId!: string;
  monthId!: string;
  recurringIncomeId?: string | null;
  grossIncome!: number;
  incomeType!: string;
  taxationMode!: "manual" | "automatic";
  taxationProfile?: string | null;
  taxationParameters?: Record<string, unknown> | null;
  notes?: string | null;
  createdAt!: Date;

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
