import { User } from "../../../domain/entities/user.entity";
import { IBudgetRuleRepository } from "../../../domain/repositories/budget-rule.repository";
import { BudgetRule } from "../../../domain/entities/budget-rule.entity";

export class ListBudgetRulesUseCase {
  constructor(private readonly budgetRuleRepository: IBudgetRuleRepository) {}

  async execute(requestingUser: User): Promise<BudgetRule[]> {
    return this.budgetRuleRepository.findByUserId(requestingUser.id);
  }
}
