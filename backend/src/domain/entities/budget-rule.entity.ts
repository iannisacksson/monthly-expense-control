import { User } from "./user.entity";

export interface BudgetRule {
  id: string;
  user: User;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  validateName(): void;
}

export class BudgetRuleEntity implements BudgetRule {
  id: string;
  user: User;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<BudgetRule>) {
    Object.assign(this, data);
  }

  validateName(): void {
    const normalizedName = this.name?.trim();

    if (
      !normalizedName ||
      normalizedName.length < 2 ||
      normalizedName.length > 100
    ) {
      throw new Error("Budget rule name must be between 2 and 100 characters");
    }

    this.name = normalizedName;
  }
}
