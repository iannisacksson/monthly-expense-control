import type { Transaction } from "sequelize";
import type { MonthlyIncome } from "../domain/entities/monthly-income.entity";
import type { IMonthlyIncomeRepository } from "../domain/repositories/monthly-income.repository";
import { MonthlyIncomeModel } from "../models/monthly-income.model";

export class MonthlyIncomeRepository implements IMonthlyIncomeRepository {
  async create(
    income: Omit<MonthlyIncome, "id" | "createdAt">,
    options?: { transaction?: Transaction },
  ): Promise<MonthlyIncome> {
    const model = await MonthlyIncomeModel.create(
      {
        userId: income.user?.id,
        monthId: income.month?.id,
        recurringIncomeId: income.recurringIncome?.id,
        grossIncome: income.grossIncome,
        incomeType: income.incomeType,
        taxationMode: income.taxationMode,
        taxationProfile: income.taxationProfile,
        taxationParameters: income.taxationParameters,
        notes: income.notes,
      },
      options,
    );
    return model.toDomain();
  }

  async findById(id: string): Promise<MonthlyIncome | null> {
    const model = await MonthlyIncomeModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByMonthId(monthId: string): Promise<MonthlyIncome[]> {
    const models = await MonthlyIncomeModel.findAll({ where: { monthId } });
    return models.map((m) => m.toDomain());
  }

  async findByUserId(userId: string): Promise<MonthlyIncome[]> {
    const models = await MonthlyIncomeModel.findAll({ where: { userId } });
    return models.map((m) => m.toDomain());
  }

  async findByRecurringIncomeId(
    recurringIncomeId: string,
  ): Promise<MonthlyIncome[]> {
    const models = await MonthlyIncomeModel.findAll({
      where: { recurringIncomeId },
    });
    return models.map((m) => m.toDomain());
  }

  async findRecurringIncomeEntry(
    recurringIncomeId: string,
    monthId: string,
  ): Promise<MonthlyIncome | null> {
    const model = await MonthlyIncomeModel.findOne({
      where: { recurringIncomeId, monthId },
    });
    return model ? model.toDomain() : null;
  }

  async update(
    id: string,
    data: {
      grossIncome?: number;
      incomeType?: string;
      taxationMode?: "manual" | "automatic";
      taxationProfile?: string | null;
      taxationParameters?: Record<string, unknown> | null;
      notes?: string | null;
    },
    options?: { transaction?: Transaction },
  ): Promise<MonthlyIncome | null> {
    const model = await MonthlyIncomeModel.findByPk(id);
    if (!model) return null;
    await model.update(data, options);
    return model.toDomain();
  }

  async delete(income: MonthlyIncome): Promise<void> {
    await MonthlyIncomeModel.destroy({ where: { id: income.id } });
  }

  async deleteByRecurringIncomeId(recurringIncomeId: string): Promise<number> {
    return MonthlyIncomeModel.destroy({ where: { recurringIncomeId } });
  }
}
