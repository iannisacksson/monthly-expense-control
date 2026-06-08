import type { Transaction } from "sequelize";
import type { IncomeTax } from "../domain/entities/income-tax.entity";
import type { IIncomeTaxRepository } from "../domain/repositories/income-tax.repository";
import { IncomeTaxModel } from "../models/income-tax.model";
import { MonthlyIncome } from "../domain/entities/monthly-income.entity";

export class IncomeTaxRepository implements IIncomeTaxRepository {
  async create(
    data: IncomeTax,
    options?: { transaction?: Transaction },
  ): Promise<IncomeTax> {
    const model = await IncomeTaxModel.create(data, options);
    return model.toDomain();
  }

  async createMany(
    data: Array<IncomeTax>,
    options?: { transaction?: Transaction },
  ): Promise<IncomeTax[]> {
    const models = await IncomeTaxModel.bulkCreate(data, options);
    return models.map((m) => m.toDomain());
  }

  async findById(id: string): Promise<IncomeTax | null> {
    const model = await IncomeTaxModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByMonthlyIncome(
    monthlyIncome: MonthlyIncome,
  ): Promise<IncomeTax[]> {
    const models = await IncomeTaxModel.findAll({
      where: { monthlyIncomeId: monthlyIncome.id },
    });
    return models.map((m) => m.toDomain());
  }

  async deleteAutoByMonthlyIncome(
    monthlyIncome: MonthlyIncome,
    options?: { transaction?: Transaction },
  ): Promise<number> {
    return IncomeTaxModel.destroy({
      where: { monthlyIncomeId: monthlyIncome.id, isAuto: true },
      ...options,
    });
  }

  async update(incomeTax: IncomeTax): Promise<IncomeTax> {
    const [_, [model]] = await IncomeTaxModel.update(incomeTax, {
      where: { id: incomeTax.id },
      returning: true,
    });

    return model.toDomain();
  }

  async delete(tax: IncomeTax): Promise<void> {
    const model = await IncomeTaxModel.findByPk(tax.id);
    if (!model) return;
    await model.destroy();
  }
}
