import { BudgetRule } from "./budget-rule.entity";
import { User } from "./user.entity";

export enum MonthStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export interface Month {
  id: string;
  user: User;
  year: number;
  month: number;
  status: MonthStatus;
  budgetRule?: BudgetRule;
  createdAt: Date;
  updatedAt: Date;

  isClosed(): boolean;
  validatePeriod(year: number, month: number): void;
  validateStatus(status: MonthStatus): void;
  ensureDeletionAllowed(): void;
}

export class MonthEntity implements Month {
  id: string;
  user: User;
  year: number;
  month: number;
  status: MonthStatus;
  budgetRule?: BudgetRule;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Month>) {
    Object.assign(this, data);
  }

  isClosed(): boolean {
    return this.status === MonthStatus.CLOSED;
  }

  validatePeriod(year: number, month: number) {
    if (month < 1 || month > 12) {
      throw new Error("Month must be between 1 and 12");
    }

    if (year < 2000 || year > 2100) {
      throw new Error("Year must be between 2000 and 2100");
    }
  }

  validateStatus(status: MonthStatus) {
    if (!Object.values(MonthStatus).includes(status)) {
      throw new Error("Status must be open or closed");
    }
  }

  ensureDeletionAllowed() {
    throw new Error("Month deletion is not allowed");
  }
}
