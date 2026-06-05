import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { User } from "../../../domain/entities/user.entity";
import { IBudgetRuleRepository } from "../../../domain/repositories/budget-rule.repository";
import { BudgetRule } from "../../../domain/entities/budget-rule.entity";

export class FindBudgetRuleByIdUseCase {
  constructor(private readonly budgetRuleRepository: IBudgetRuleRepository) {}

  async execute(
    budgetRule: BudgetRule,
    requestingUser: User,
  ): Promise<BudgetRule> {
    const rule = await this.budgetRuleRepository.findById(budgetRule.id);
    if (!rule) {
      throw new NotFoundError("Budget rule not found");
    }
    if (rule.user.id !== requestingUser.id) throw new ForbiddenError();
    return rule;
  }
}
