import type { UpdateIncomeTaxDTO } from "../../../dtos/income-tax.dto"
import { IncomeTaxRepository } from "../../../repositories/income-tax.repository"
import { MonthlyIncomeRepository } from "../../../repositories/monthly-income.repository"
import { ForbiddenError } from "../../../utils/errors"

export class UpdateIncomeTaxUseCase {
  constructor(
    private readonly incomeTaxRepository: Pick<IncomeTaxRepository, "findById" | "update"> = new IncomeTaxRepository(),
    private readonly monthlyIncomeRepository: Pick<MonthlyIncomeRepository, "findById"> = new MonthlyIncomeRepository(),
  ) {}

  async execute(id: string, data: UpdateIncomeTaxDTO, requestingUserId: string) {
    const existingTax = await this.incomeTaxRepository.findById(id)
    if (!existingTax) {
      throw new Error("Income tax not found")
    }

    const income = await this.monthlyIncomeRepository.findById(
      existingTax.getDataValue("monthly_income_id") as string,
    )
    if (!income || income.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    if (existingTax.getDataValue("is_auto") as boolean) {
      throw new Error("Automatic income taxes cannot be edited manually")
    }

    const normalizedTaxType = data.tax_type?.trim()
    if (data.tax_type !== undefined && (!normalizedTaxType || normalizedTaxType.length === 0)) {
      throw new Error("Tax type is required")
    }

    if (data.value !== undefined && data.value < 0) {
      throw new Error("Tax value must be greater than or equal to zero")
    }

    const tax = await this.incomeTaxRepository.update(id, {
      ...data,
      is_auto: false,
      tax_type: normalizedTaxType,
    })
    if (!tax) {
      throw new Error("Income tax not found")
    }

    return tax
  }
}