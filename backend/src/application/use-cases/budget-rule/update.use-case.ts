import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { User } from "../../../domain/entities/user.entity";
import { IBudgetRuleRepository } from "../../../domain/repositories/budget-rule.repository";
import { BudgetRule } from "../../../domain/entities/budget-rule.entity";

export class UpdateBudgetRuleUseCase {
  constructor(private readonly budgetRuleRepository: IBudgetRuleRepository) {}

  async execute(
    budgetRule: BudgetRule,
    requestingUser: User,
  ): Promise<BudgetRule> {
    if (budgetRule.name !== undefined) budgetRule.validateName();

    const existing = await this.budgetRuleRepository.findById(budgetRule.id);
    if (!existing) throw new NotFoundError("Budget rule not found");
    if (existing.user.id !== requestingUser.id) throw new ForbiddenError();

    const rule = await this.budgetRuleRepository.update(budgetRule);
    if (!rule) {
      throw new NotFoundError("Budget rule not found");
    }
    return rule;
  }
}
