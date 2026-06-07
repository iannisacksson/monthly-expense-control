import type { RecurringIncome } from "../domain/entities/recurring-income.entity";
import type { IRecurringIncomeRepository } from "../domain/repositories/recurring-income.repository";
import { RecurringIncomeModel } from "../models/recurring-income.model";

export class RecurringIncomeRepository implements IRecurringIncomeRepository {
  async create(data: RecurringIncome): Promise<RecurringIncome> {
    const model = await RecurringIncomeModel.create(data);
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

  async update(data: RecurringIncome): Promise<RecurringIncome> {
    const [_, [updatedModel]] = await RecurringIncomeModel.update(data, {
      where: { id: data.id },
      returning: true,
    });
    return updatedModel.toDomain();
  }

  async delete(income: RecurringIncome): Promise<void> {
    await RecurringIncomeModel.destroy({ where: { id: income.id } });
  }
}
