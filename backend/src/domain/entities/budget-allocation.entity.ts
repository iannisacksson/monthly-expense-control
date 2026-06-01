import { BudgetRule } from "./budget-rule.entity";
import { Category } from "./category.entity";

export interface BudgetAllocation {
  id: string;
  budgetRule: BudgetRule;
  category: Category;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;

  validatePercentage(): void;
  ensureTotalPercentageWithinLimit(
    currentTotal: number,
    nextPercentage: number,
  ): void;
}

export class BudgetAllocationEntity implements BudgetAllocation {
  id: string;
  budgetRule: BudgetRule;
  category: Category;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<BudgetAllocation>) {
    Object.assign(this, data);
  }

  validatePercentage() {
    if (this.percentage <= 0 || this.percentage > 100) {
      throw new Error("Percentage must be between 0 and 100");
    }
  }

  ensureTotalPercentageWithinLimit(
    currentTotal: number,
    nextPercentage: number,
  ) {
    if (currentTotal + nextPercentage > 100) {
      throw new Error("Total allocation percentage cannot exceed 100%");
    }
  }
}
