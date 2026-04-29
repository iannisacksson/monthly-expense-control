import type { MeProLaboreTaxationParametersDTO } from "../dtos/monthly-income.dto"
import { RecurringIncome } from "../models/index"

export class RecurringIncomeRepository {
  async create(data: {
    family_id?: string
    user_id: string
    description: string
    gross_income: number
    income_type: string
    taxation_mode?: string
    taxation_profile?: string | null
    taxation_parameters?: MeProLaboreTaxationParametersDTO | null
    kind: string
    start_month_id: string
    occurrences?: number | null
    status: string
  }) {
    return RecurringIncome.create(data)
  }

  async findById(id: string) {
    return RecurringIncome.findByPk(id)
  }

  async findByFamilyId(familyId: string) {
    return RecurringIncome.findAll({ where: { family_id: familyId } })
  }

  async findByUserId(userId: string) {
    return RecurringIncome.findAll({ where: { user_id: userId } })
  }

  async update(id: string, data: Partial<{
    description: string
    gross_income: number
    income_type: string
    taxation_mode: string
    taxation_profile: string | null
    taxation_parameters: MeProLaboreTaxationParametersDTO | null
    kind: string
    occurrences: number | null
    status: string
  }>) {
    const recurringIncome = await RecurringIncome.findByPk(id)
    if (!recurringIncome) return null
    return recurringIncome.update(data)
  }

  async delete(id: string) {
    const recurringIncome = await RecurringIncome.findByPk(id)
    if (!recurringIncome) return null
    await recurringIncome.destroy()
    return recurringIncome
  }
}