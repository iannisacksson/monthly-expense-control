import type { BudgetRule } from "../domain/entities/budget-rule.entity";
import type { Month, MonthStatus } from "../domain/entities/month.entity";
import type { IMonthRepository } from "../domain/repositories/month.repository";
import { MonthModel } from "../models/month.model";

export class MonthRepository implements IMonthRepository {
  async create(
    data: Omit<Month, "id" | "createdAt" | "updatedAt">,
  ): Promise<Month> {
    const model = await MonthModel.create({
      user: data.user,
      year: data.year,
      month: data.month,
      status: data.status,
      budgetRule: data.budgetRule,
    });
    return model.toDomain();
  }

  async findById(id: string): Promise<Month | null> {
    const model = await MonthModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByUserId(userId: string): Promise<Month[]> {
    const models = await MonthModel.findAll({ where: { userId } });
    return models.map((m) => m.toDomain());
  }

  async findByUserAndPeriod(
    userId: string,
    year: number,
    month: number,
  ): Promise<Month | null> {
    const model = await MonthModel.findOne({ where: { userId, year, month } });
    return model ? model.toDomain() : null;
  }

  async update(
    id: string,
    data: Partial<{ status: MonthStatus; budgetRule: BudgetRule | null }>,
  ): Promise<Month | null> {
    const model = await MonthModel.findByPk(id);
    if (!model) return null;
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if ("budgetRule" in data)
      updateData.budgetRuleId = data.budgetRule?.id ?? null;
    await model.update(updateData);
    return model.toDomain();
  }

  async delete(month: Month): Promise<void> {
    const model = await MonthModel.findByPk(month.id);
    if (!model) return;
    await model.destroy();
  }
}
