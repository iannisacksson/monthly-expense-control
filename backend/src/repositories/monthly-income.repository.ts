import type { Transaction } from "sequelize";
import type { MonthlyIncome } from "../domain/entities/monthly-income.entity";
import type { IMonthlyIncomeRepository } from "../domain/repositories/monthly-income.repository";
import { MonthlyIncomeModel } from "../models/monthly-income.model";
import { User } from "../domain/entities/user.entity";
import { Month } from "../domain/entities/month.entity";
import { RecurringIncome } from "../domain/entities/recurring-income.entity";

export class MonthlyIncomeRepository implements IMonthlyIncomeRepository {
  async create(
    income: MonthlyIncome,
    options?: { transaction?: Transaction },
  ): Promise<MonthlyIncome> {
    const model = await MonthlyIncomeModel.create(income, options);
    return model.toDomain();
  }

  async findById(id: string): Promise<MonthlyIncome | null> {
    const model = await MonthlyIncomeModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByMonth(month: Month): Promise<MonthlyIncome[]> {
    const models = await MonthlyIncomeModel.findAll({
      where: { monthId: month.id },
    });
    return models.map((m) => m.toDomain());
  }

  async findByUser(user: User): Promise<MonthlyIncome[]> {
    const models = await MonthlyIncomeModel.findAll({
      where: { userId: user.id },
    });
    return models.map((m) => m.toDomain());
  }

  async findByRecurringIncome(
    recurringIncome: RecurringIncome,
  ): Promise<MonthlyIncome[]> {
    const models = await MonthlyIncomeModel.findAll({
      where: { recurringIncomeId: recurringIncome.id },
    });
    return models.map((m) => m.toDomain());
  }

  async findRecurringIncomeEntry(
    recurringIncome: RecurringIncome,
    month: Month,
  ): Promise<MonthlyIncome | null> {
    const model = await MonthlyIncomeModel.findOne({
      where: { recurringIncomeId: recurringIncome.id, monthId: month.id },
    });
    return model ? model.toDomain() : null;
  }

  async update(
    monthlyIncome: MonthlyIncome,
    options?: { transaction?: Transaction },
  ): Promise<MonthlyIncome> {
    const model = await MonthlyIncomeModel.update(monthlyIncome, {
      where: { id: monthlyIncome.id },
      returning: true,
      ...options,
    });
    return model[1][0].toDomain();
  }

  async delete(income: MonthlyIncome): Promise<void> {
    await MonthlyIncomeModel.destroy({ where: { id: income.id } });
  }

  async deleteByRecurringIncome(
    recurringIncome: RecurringIncome,
  ): Promise<number> {
    return MonthlyIncomeModel.destroy({
      where: { recurringIncomeId: recurringIncome.id },
    });
  }
}
