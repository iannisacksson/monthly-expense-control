import type { Transaction } from "sequelize";
import type { IncomeTax } from "../domain/entities/income-tax.entity";
import type { IIncomeTaxRepository } from "../domain/repositories/income-tax.repository";
import { IncomeTaxModel } from "../models/income-tax.model";

export class IncomeTaxRepository implements IIncomeTaxRepository {
  async create(
    data: {
      monthlyIncomeId: string;
      taxType: string;
      value: number;
      isAuto: boolean;
    },
    options?: { transaction?: Transaction },
  ): Promise<IncomeTax> {
    const model = await IncomeTaxModel.create(data, options);
    return model.toDomain();
  }

  async createMany(
    data: Array<{
      monthlyIncomeId: string;
      taxType: string;
      value: number;
      isAuto: boolean;
    }>,
    options?: { transaction?: Transaction },
  ): Promise<IncomeTax[]> {
    const models = await IncomeTaxModel.bulkCreate(data, options);
    return models.map((m) => m.toDomain());
  }

  async findById(id: string): Promise<IncomeTax | null> {
    const model = await IncomeTaxModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByMonthlyIncomeId(monthlyIncomeId: string): Promise<IncomeTax[]> {
    const models = await IncomeTaxModel.findAll({ where: { monthlyIncomeId } });
    return models.map((m) => m.toDomain());
  }

  async deleteAutoByMonthlyIncomeId(
    monthlyIncomeId: string,
    options?: { transaction?: Transaction },
  ): Promise<number> {
    return IncomeTaxModel.destroy({
      where: { monthlyIncomeId, isAuto: true },
      ...options,
    });
  }

  async update(
    id: string,
    data: Partial<{ taxType: string; value: number; isAuto: boolean }>,
  ): Promise<IncomeTax | null> {
    const model = await IncomeTaxModel.findByPk(id);
    if (!model) return null;
    await model.update(data);
    return model.toDomain();
  }

  async delete(tax: IncomeTax): Promise<void> {
    const model = await IncomeTaxModel.findByPk(tax.id);
    if (!model) return;
    await model.destroy();
  }
}
