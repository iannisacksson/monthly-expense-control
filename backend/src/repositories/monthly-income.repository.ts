import type { Transaction } from "sequelize"
import type { MeProLaboreTaxationParametersDTO } from "../dtos/monthly-income.dto"
import { MonthlyIncome } from "../models/index"

export class MonthlyIncomeRepository {
  async create(data: {
    user_id: string
    month_id: string
    recurring_income_id?: string
    gross_income: number
    income_type: string
    taxation_mode?: string
    taxation_profile?: string | null
    taxation_parameters?: MeProLaboreTaxationParametersDTO | null
    notes?: string
  }, options?: { transaction?: Transaction }) {
    return MonthlyIncome.create(data, options)
  }

  async findById(id: string) {
    return MonthlyIncome.findByPk(id)
  }

  async findByMonthId(monthId: string) {
    return MonthlyIncome.findAll({ where: { month_id: monthId } })
  }

  async findByUserId(userId: string) {
    return MonthlyIncome.findAll({ where: { user_id: userId } })
  }

  async findByRecurringIncomeId(recurringIncomeId: string) {
    return MonthlyIncome.findAll({ where: { recurring_income_id: recurringIncomeId } })
  }

  async findRecurringIncomeEntry(recurringIncomeId: string, monthId: string) {
    return MonthlyIncome.findOne({ where: { recurring_income_id: recurringIncomeId, month_id: monthId } })
  }

  async update(id: string, data: Partial<{
    gross_income: number
    income_type: string
    recurring_income_id: string
    taxation_mode: string
    taxation_profile: string | null
    taxation_parameters: MeProLaboreTaxationParametersDTO | null
    notes: string
  }>, options?: { transaction?: Transaction }) {
    const income = await MonthlyIncome.findByPk(id)
    if (!income) return null
    return income.update(data, options)
  }

  async delete(id: string) {
    const income = await MonthlyIncome.findByPk(id)
    if (!income) return null
    await income.destroy()
    return income
  }

  async deleteByRecurringIncomeId(recurringIncomeId: string) {
    return MonthlyIncome.destroy({ where: { recurring_income_id: recurringIncomeId } })
  }
}
