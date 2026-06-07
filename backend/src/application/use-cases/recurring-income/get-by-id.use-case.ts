import { User } from "../../../domain/entities/user.entity";
import { IRecurringIncomeRepository } from "../../../domain/repositories/recurring-income.repository";

export class ListRecurringIncomesUseCase {
  constructor(
    private readonly recurringIncomeRepository: IRecurringIncomeRepository,
  ) {}

  async execute(requestingUser: User) {
    const recurringIncomes = await this.recurringIncomeRepository.findByUserId(
      requestingUser.id,
    );

    return recurringIncomes;
  }
}
