import type { RecurringIncome } from "../domain/entities/recurring-income.entity";
import type { IRecurringIncomeRepository } from "../domain/repositories/recurring-income.repository";
import { RecurringIncomeModel } from "../models/recurring-income.model";

export class RecurringIncomeRepository implements IRecurringIncomeRepository {
  async create(
    data: Omit<
      RecurringIncome,
      "id" | "createdAt" | "updatedAt" | "validateBaseFields"
    >,
  ): Promise<RecurringIncome> {
    const model = await RecurringIncomeModel.create({
      user: data.user,
      description: data.description,
      grossIncome: data.grossIncome,
      incomeType: data.incomeType,
      taxationMode: data.taxationMode,
      taxationProfile: data.taxationProfile,
      taxationParameters: data.taxationParameters,
      kind: data.kind,
      startMonth: data.startMonth,
      occurrences: data.occurrences,
      status: data.status,
    });
    return model.toDomain();
  }

  async findById(id: string): Promise<RecurringIncome | null> {
    const model = await RecurringIncomeModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByUserId(userId: string): Promise<RecurringIncome[]> {
    const models = await RecurringIncomeModel.findAll({ where: { userId } });
    return models.map((m) => m.toDomain());
  }

  async update(
    id: string,
    data: Partial<{
      description: string;
      grossIncome: number;
      incomeType: string;
      taxationMode: string;
      taxationProfile: string | null;
      taxationParameters: Record<string, unknown> | null;
      kind: string;
      occurrences: number | null;
      status: string;
    }>,
  ): Promise<RecurringIncome | null> {
    const model = await RecurringIncomeModel.findByPk(id);
    if (!model) return null;
    await model.update(data);
    return model.toDomain();
  }

  async delete(income: RecurringIncome): Promise<void> {
    const model = await RecurringIncomeModel.findByPk(income.id);
    if (!model) return;
    await model.destroy();
  }
}
