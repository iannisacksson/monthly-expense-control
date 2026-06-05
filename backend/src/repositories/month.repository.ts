import type { BudgetRule } from "../domain/entities/budget-rule.entity";
import type { Month, MonthStatus } from "../domain/entities/month.entity";
import type { IMonthRepository } from "../domain/repositories/month.repository";
import { MonthModel } from "../models/month.model";

export class MonthRepository implements IMonthRepository {
  async create(data: Month): Promise<Month> {
    const model = await MonthModel.create(data);
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

  async update(month: Month): Promise<Month> {
    const [, [updatedModel]] = await MonthModel.update(month, {
      where: { id: month.id },
      returning: true,
    });
    return updatedModel.toDomain();
  }

  async delete(month: Month): Promise<void> {
    const model = await MonthModel.findByPk(month.id);
    if (!model) return;
    await model.destroy();
  }
}
