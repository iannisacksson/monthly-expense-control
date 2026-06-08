import type { UpdateIncomeTaxDTO } from "../../../dtos/income-tax.dto";
import type { IIncomeTaxRepository } from "../../../domain/repositories/income-tax.repository";
import type { IMonthlyIncomeRepository } from "../../../domain/repositories/monthly-income.repository";
import { ForbiddenError } from "../../../utils/errors";

export class UpdateIncomeTaxUseCase {
  constructor(
    private readonly incomeTaxRepository: IIncomeTaxRepository,
    private readonly monthlyIncomeRepository: IMonthlyIncomeRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateIncomeTaxDTO,
    requestingUserId: string,
  ) {
    const existingTax = await this.incomeTaxRepository.findById(id);
    if (!existingTax) {
      throw new Error("Income tax not found");
    }

    const income = await this.monthlyIncomeRepository.findById(
      existingTax.monthlyIncome.id,
    );
    if (!income || income.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    if (existingTax.isAuto) {
      throw new Error("Automatic income taxes cannot be edited manually");
    }

    const normalizedTaxType = data.tax_type?.trim();
    if (
      data.tax_type !== undefined &&
      (!normalizedTaxType || normalizedTaxType.length === 0)
    ) {
      throw new Error("Tax type is required");
    }

    if (data.value !== undefined && data.value < 0) {
      throw new Error("Tax value must be greater than or equal to zero");
    }

    const tax = await this.incomeTaxRepository.update(id, {
      isAuto: false,
      taxType: normalizedTaxType,
      value: data.value,
    });
    if (!tax) {
      throw new Error("Income tax not found");
    }

    return tax;
  }
}
