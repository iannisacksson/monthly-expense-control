import { MonthlyIncomeRepository } from "../repositories/monthly-income.repository"
import { MonthRepository } from "../repositories/month.repository"
import { UserRepository } from "../repositories/user.repository"
import { IncomeTaxRepository } from "../repositories/income-tax.repository"
import { sequelize } from "../database/connection"
import { CreateMonthlyIncomeDTO, IncomeTaxationDTO, UpdateMonthlyIncomeDTO } from "../dtos/monthly-income.dto"
import { IncomeTaxationService } from "./income-taxation.service"

const monthlyIncomeRepository = new MonthlyIncomeRepository()
const monthRepository = new MonthRepository()
const userRepository = new UserRepository()
const incomeTaxRepository = new IncomeTaxRepository()
const incomeTaxationService = new IncomeTaxationService()

export class MonthlyIncomeService {
  async registerIncome(data: CreateMonthlyIncomeDTO) {
    if (data.gross_income <= 0) {
      throw new Error("Income amount must be greater than zero")
    }

    if (data.notes && data.notes.length > 255) {
      throw new Error("Income notes must be at most 255 characters")
    }

    const user = await userRepository.findById(data.user_id)
    if (!user) {
      throw new Error("User not found")
    }

    const month = await monthRepository.findById(data.month_id)
    if (!month) {
      throw new Error("Month not found")
    }

    const taxation = incomeTaxationService.normalizeTaxation(data.taxation)

    return sequelize.transaction(async (transaction) => {
      const income = await monthlyIncomeRepository.create({
        user_id: data.user_id,
        month_id: data.month_id,
        recurring_income_id: data.recurring_income_id,
        gross_income: data.gross_income,
        income_type: data.income_type,
        taxation_mode: taxation.mode,
        taxation_profile: taxation.profile,
        taxation_parameters: taxation.parameters,
        notes: data.notes,
      }, { transaction })

      const automaticTaxes = incomeTaxationService.calculateAutomaticTaxes(data.gross_income, taxation)

      if (automaticTaxes.length > 0) {
        await incomeTaxRepository.createMany(
          automaticTaxes.map((tax) => ({
            monthly_income_id: income.getDataValue("id") as string,
            tax_type: tax.tax_type,
            value: tax.value,
            is_auto: true,
          })),
          { transaction }
        )
      }

      return income
    })
  }

  async findIncomeById(id: string) {
    const income = await monthlyIncomeRepository.findById(id)
    if (!income) {
      throw new Error("Monthly income not found")
    }
    return income
  }

  async listIncomesByMonth(monthId: string) {
    return monthlyIncomeRepository.findByMonthId(monthId)
  }

  async listIncomesByUser(userId: string) {
    return monthlyIncomeRepository.findByUserId(userId)
  }

  async updateIncome(id: string, data: UpdateMonthlyIncomeDTO) {
    if (data.gross_income !== undefined && data.gross_income <= 0) {
      throw new Error("Income amount must be greater than zero")
    }

    const existingIncome = await monthlyIncomeRepository.findById(id)
    if (!existingIncome) {
      throw new Error("Monthly income not found")
    }

    const resolvedGrossIncome = data.gross_income ?? Number(existingIncome.getDataValue("gross_income"))
    const taxation = this.resolveUpdatedTaxation(existingIncome, data.taxation)

    return sequelize.transaction(async (transaction) => {
      const updatedIncome = await monthlyIncomeRepository.update(id, {
        gross_income: data.gross_income,
        income_type: data.income_type,
        notes: data.notes,
        taxation_mode: taxation.mode,
        taxation_profile: taxation.profile,
        taxation_parameters: taxation.parameters,
      }, { transaction })

      if (!updatedIncome) {
        throw new Error("Monthly income not found")
      }

      await incomeTaxRepository.deleteAutoByMonthlyIncomeId(id, { transaction })

      const automaticTaxes = incomeTaxationService.calculateAutomaticTaxes(resolvedGrossIncome, taxation)

      if (automaticTaxes.length > 0) {
        await incomeTaxRepository.createMany(
          automaticTaxes.map((tax) => ({
            monthly_income_id: id,
            tax_type: tax.tax_type,
            value: tax.value,
            is_auto: true,
          })),
          { transaction }
        )
      }

      return updatedIncome
    })
  }

  async deleteIncome(id: string) {
    const income = await monthlyIncomeRepository.delete(id)
    if (!income) {
      throw new Error("Monthly income not found")
    }
    return income
  }

  private resolveUpdatedTaxation(existingIncome: any, taxation?: IncomeTaxationDTO) {
    if (taxation) {
      return incomeTaxationService.normalizeTaxation(taxation)
    }

    return incomeTaxationService.normalizeTaxation({
      mode: (existingIncome.getDataValue("taxation_mode") as "manual" | "automatic" | null) ?? "manual",
      profile: existingIncome.getDataValue("taxation_profile") as "me_pro_labore" | undefined,
      parameters: existingIncome.getDataValue("taxation_parameters") as IncomeTaxationDTO["parameters"],
    })
  }
}
