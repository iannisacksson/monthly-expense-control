import { BudgetRule } from "../../../domain/entities/budget-rule.entity";
import { Month } from "../../../domain/entities/month.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { IBudgetRuleRepository } from "../../../domain/repositories/budget-rule.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class DeleteMonthUseCase {
  constructor(
    private readonly monthRepository: IMonthRepository,
    private readonly budgetRuleRepository: IBudgetRuleRepository,
  ) {}

  async execute(month: Month, requestingUser: UserEntity): Promise<void> {
    const monthFound = await this.monthRepository.findById(month.id);
    if (!monthFound) {
      throw new NotFoundError("Month not found");
    }
    if (monthFound.user.id !== requestingUser.id) {
      throw new ForbiddenError("Month not found");
    }

    if (monthFound.budgetRule?.id !== month.budgetRule?.id) {
      await this.validateBudgetRuleOwnership(month, month.budgetRule);
    }

    monthFound.ensureDeletionAllowed();
  }

  private async validateBudgetRuleOwnership(
    month: Month,
    budgetRule?: BudgetRule,
  ) {
    if (!budgetRule?.id) return;

    const rule = await this.budgetRuleRepository.findById(budgetRule.id);
    if (!rule) {
      throw new NotFoundError("Budget rule not found");
    }

    const monthUserId = month.user?.id;
    const ruleUserId = rule.user?.id;

    const sameOwner =
      !!monthUserId && !!ruleUserId && monthUserId === ruleUserId;

    if (!sameOwner) {
      throw new ForbiddenError(
        "Budget rule must belong to the same owner as the month",
      );
    }
  }
}
