import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class DeleteMonthlyIncomeUseCase {
  constructor(
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
  ) {}

  async execute(id: string, requestingUserId: string): Promise<void> {
    const existing = await this.monthlyIncomeRepository.findById(id);
    if (!existing) throw new NotFoundError("Monthly income not found");
    if (existing.user.id !== requestingUserId) throw new ForbiddenError();
    await this.monthlyIncomeRepository.delete(existing);
  }
}
