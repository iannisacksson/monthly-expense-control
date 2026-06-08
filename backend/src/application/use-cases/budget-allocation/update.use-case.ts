import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { User } from "../../../domain/entities/user.entity";
import { BudgetAllocation } from "../../../domain/entities/budget-allocation.entity";
import { IBudgetAllocationRepository } from "../../../domain/repositories/budget-allocation.repository";
import { IBudgetRuleRepository } from "../../../domain/repositories/budget-rule.repository";
import { BudgetRule } from "../../../domain/entities/budget-rule.entity";
import { Category } from "../../../domain/entities/category.entity";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";

export class UpdateBudgetAllocationUseCase {
  constructor(
    private readonly budgetAllocationRepository: IBudgetAllocationRepository,
    private readonly budgetRuleRepository: IBudgetRuleRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    budgetAllocation: BudgetAllocation,
    requestingUser: User,
  ): Promise<BudgetAllocation> {
    if (budgetAllocation.percentage !== undefined)
      budgetAllocation.validatePercentage();

    const existingAllocation = await this.budgetAllocationRepository.findById(
      budgetAllocation.id,
    );
    if (!existingAllocation) {
      throw new NotFoundError("Budget allocation not found");
    }

    const ruleId = existingAllocation.budgetRule.id;
    const rule = await this.budgetRuleRepository.findById(ruleId);
    if (!rule) {
      throw new NotFoundError("Budget rule not found");
    }
    if (rule.user?.id !== requestingUser.id) throw new ForbiddenError();

    if (budgetAllocation.category) {
      await this.ensureCategoryMatchesRuleOwner(
        budgetAllocation.category,
        rule,
      );
    }

    if (budgetAllocation.percentage !== undefined) {
      const existingAllocations =
        await this.budgetAllocationRepository.findByBudgetRule(rule);
      const currentTotal = existingAllocations
        .filter((alloc) => alloc.id !== budgetAllocation.id)
        .reduce((sum, alloc) => sum + Number(alloc.percentage), 0);

      budgetAllocation.ensureTotalPercentageWithinLimit(
        currentTotal,
        budgetAllocation.percentage,
      );
    }

    const allocation =
      await this.budgetAllocationRepository.update(budgetAllocation);

    return allocation;
  }

  private async ensureCategoryMatchesRuleOwner(
    category: Category,
    rule: BudgetRule,
  ): Promise<Category> {
    const categoryFound = await this.categoryRepository.findById(category.id);
    if (!categoryFound) {
      throw new NotFoundError("Category not found");
    }

    const categoryUserId = category.user?.id ?? null;
    const ruleUserId = rule.user?.id ?? null;
    const isSameOwner =
      !!categoryUserId && !!ruleUserId && categoryUserId === ruleUserId;

    if (!isSameOwner) {
      throw new ForbiddenError(
        "Category must belong to the same owner as the budget rule",
      );
    }

    return categoryFound;
  }
}
