import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { User } from "../../../domain/entities/user.entity";
import { BudgetAllocation } from "../../../domain/entities/budget-allocation.entity";
import { IBudgetAllocationRepository } from "../../../domain/repositories/budget-allocation.repository";
import { IBudgetRuleRepository } from "../../../domain/repositories/budget-rule.repository";

export class DeleteBudgetAllocationUseCase {
  constructor(
    private readonly budgetAllocationRepository: IBudgetAllocationRepository,
    private readonly budgetRuleRepository: IBudgetRuleRepository,
  ) {}

  async execute(
    budgetAllocation: BudgetAllocation,
    requestingUser: User,
  ): Promise<void> {
    const existing = await this.budgetAllocationRepository.findById(
      budgetAllocation.id,
    );
    if (!existing) throw new NotFoundError("Budget allocation not found");
    const rule = await this.budgetRuleRepository.findById(
      existing.budgetRule.id,
    );
    if (!rule || rule.user?.id !== requestingUser.id)
      throw new ForbiddenError();

    await this.budgetAllocationRepository.delete(existing);
  }
}
