import { User } from "../../../domain/entities/user.entity";
import { InstallmentGroup } from "../../../domain/entities/installment-group.entity";
import { IInstallmentGroupRepository } from "../../../domain/repositories/installment-group.repository";
import { ForbiddenError } from "../../../utils/errors";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { Expense } from "../../../domain/entities/expense.entity";

export class ListInstallmentGroupsByUserUseCase {
  constructor(
    private readonly installmentGroupRepository: IInstallmentGroupRepository,
    private readonly expenseRepository: IExpenseRepository,
  ) {}

  async execute(
    installmentGroup: InstallmentGroup,
    user: User,
  ): Promise<Expense[]> {
    const group = await this.installmentGroupRepository.findById(
      installmentGroup.id,
    );
    if (!group || group.user.id !== user.id) throw new ForbiddenError();
    return this.expenseRepository.findByInstallmentGroup(group);
  }
}
