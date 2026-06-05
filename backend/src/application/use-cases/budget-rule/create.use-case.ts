import { NotFoundError } from "../../../utils/errors";
import { User } from "../../../domain/entities/user.entity";
import { IBudgetRuleRepository } from "../../../domain/repositories/budget-rule.repository";
import { BudgetRule } from "../../../domain/entities/budget-rule.entity";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class CreateBudgetRuleUseCase {
  constructor(
    private readonly budgetRuleRepository: IBudgetRuleRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    budgetRule: BudgetRule,
    requestingUser: User,
  ): Promise<BudgetRule> {
    budgetRule.validateName();

    const user = await this.userRepository.findById(requestingUser.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    budgetRule.user = requestingUser;

    return this.budgetRuleRepository.create(budgetRule);
  }
}
