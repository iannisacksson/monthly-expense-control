import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { User } from "../../../domain/entities/user.entity";
import { IBudgetRuleRepository } from "../../../domain/repositories/budget-rule.repository";
import { BudgetRule } from "../../../domain/entities/budget-rule.entity";

export class DeleteBudgetRuleUseCase {
  constructor(private readonly budgetRuleRepository: IBudgetRuleRepository) {}

  async execute(budgetRule: BudgetRule, requestingUser: User): Promise<void> {
    const existing = await this.budgetRuleRepository.findById(budgetRule.id);
    if (!existing) throw new NotFoundError("Budget rule not found");
    if (existing.user.id !== requestingUser.id) throw new ForbiddenError();

    await this.budgetRuleRepository.delete(budgetRule);
  }
}
