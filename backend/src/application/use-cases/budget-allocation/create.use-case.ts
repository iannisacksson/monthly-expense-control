import { Category } from "../../../domain/entities/category.entity";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { User } from "../../../domain/entities/user.entity";
import { BudgetAllocation } from "../../../domain/entities/budget-allocation.entity";
import { IBudgetAllocationRepository } from "../../../domain/repositories/budget-allocation.repository";
import { IBudgetRuleRepository } from "../../../domain/repositories/budget-rule.repository";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { BudgetRule } from "../../../domain/entities/budget-rule.entity";

export class CreateBudgetAllocationUseCase {
  constructor(
    private readonly budgetAllocationRepository: IBudgetAllocationRepository,
    private readonly budgetRuleRepository: IBudgetRuleRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    budgetAllocation: BudgetAllocation,
    requestingUser: User,
  ): Promise<BudgetAllocation> {
    budgetAllocation.validatePercentage();

    const rule = await this.budgetRuleRepository.findById(
      budgetAllocation.budgetRule.id,
    );
    if (!rule) {
      throw new NotFoundError("Budget rule not found");
    }
    if (rule.user.id !== requestingUser.id) throw new ForbiddenError();

    await this.ensureCategoryMatchesRuleOwner(budgetAllocation.category, rule);

    const existingAllocations =
      await this.budgetAllocationRepository.findByBudgetRuleId(
        budgetAllocation.budgetRule.id,
      );
    const currentTotal = existingAllocations.reduce(
      (sum, alloc) => sum + Number(alloc.percentage),
      0,
    );

    existingAllocations[0].ensureTotalPercentageWithinLimit(
      currentTotal,
      budgetAllocation.percentage,
    );

    return this.budgetAllocationRepository.create(budgetAllocation);
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
