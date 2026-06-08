import { ForbiddenError } from "../../../utils/errors";
import { User } from "../../../domain/entities/user.entity";
import { BudgetAllocation } from "../../../domain/entities/budget-allocation.entity";
import { IBudgetAllocationRepository } from "../../../domain/repositories/budget-allocation.repository";
import { IBudgetRuleRepository } from "../../../domain/repositories/budget-rule.repository";
import { BudgetRule } from "../../../domain/entities/budget-rule.entity";

export class ListBudgetAllocationsByRuleUseCase {
  constructor(
    private readonly budgetAllocationRepository: IBudgetAllocationRepository,
    private readonly budgetRuleRepository: IBudgetRuleRepository,
  ) {}

  async execute(
    budgetRule: BudgetRule,
    requestingUser: User,
  ): Promise<BudgetAllocation[]> {
    const rule = await this.budgetRuleRepository.findById(budgetRule.id);
    if (!rule || rule.user?.id !== requestingUser.id)
      throw new ForbiddenError();
    return this.budgetAllocationRepository.findByBudgetRule(budgetRule);
  }
}
