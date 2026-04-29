import { CreateRecurringIncomeDTO, UpdateRecurringIncomeDTO } from "../dtos/recurring-income.dto"
import { FamilyRepository } from "../repositories/family.repository"
import { IncomeTaxRepository } from "../repositories/income-tax.repository"
import { MonthRepository } from "../repositories/month.repository"
import { MonthlyIncomeRepository } from "../repositories/monthly-income.repository"
import { RecurringIncomeRepository } from "../repositories/recurring-income.repository"
import { UserRepository } from "../repositories/user.repository"
import { IncomeTaxationDTO } from "../dtos/monthly-income.dto"
import { IncomeTaxationService } from "./income-taxation.service"

const recurringIncomeRepository = new RecurringIncomeRepository()
const monthlyIncomeRepository = new MonthlyIncomeRepository()
const incomeTaxRepository = new IncomeTaxRepository()
const familyRepository = new FamilyRepository()
const monthRepository = new MonthRepository()
const userRepository = new UserRepository()
const incomeTaxationService = new IncomeTaxationService()

export class RecurringIncomeService {
  private getLegacyFamilyId(userId?: string | null, familyId?: string | null) {
    return userId ? undefined : familyId ?? undefined
  }

  private getMonthDistance(startMonth: any, targetMonth: any) {
    const startYear = startMonth.getDataValue("year") as number
    const startMonthNumber = startMonth.getDataValue("month") as number
    const targetYear = targetMonth.getDataValue("year") as number
    const targetMonthNumber = targetMonth.getDataValue("month") as number
    return ((targetYear - startYear) * 12) + (targetMonthNumber - startMonthNumber)
  }

  private validateBaseFields(params: {
    description: string
    grossIncome: number
    incomeType: string
    kind: string
    status: string
  }) {
    if (!params.description || params.description.length > 255) {
      throw new Error("Description is required and must be at most 255 characters")
    }

    if (params.grossIncome <= 0) {
      throw new Error("Recurring income amount must be greater than zero")
    }

    if (!params.incomeType) {
      throw new Error("Income type is required")
    }

    if (!["fixed_salary", "recurring_extra"].includes(params.kind)) {
      throw new Error("Recurring income kind must be fixed_salary or recurring_extra")
    }

    if (!["active", "inactive"].includes(params.status)) {
      throw new Error("Status must be active or inactive")
    }
  }

  private isMonthWithinRecurringRange(startMonth: any, targetMonth: any, occurrences?: number | null) {
    const distance = this.getMonthDistance(startMonth, targetMonth)
    if (distance < 0) {
      return false
    }

    if (occurrences != null && distance >= occurrences) {
      return false
    }

    return true
  }

  private async validateUserAndMonth(params: {
    userId: string
    startMonthId: string
  }) {
    const user = await userRepository.findById(params.userId)
    if (!user) {
      throw new Error("User not found")
    }

    const startMonth = await monthRepository.findById(params.startMonthId)
    if (!startMonth) {
      throw new Error("Start month not found")
    }

    const startMonthUserId = startMonth.getDataValue("user_id") as string | null
    if (startMonthUserId && startMonthUserId !== params.userId) {
      throw new Error("Start month must belong to the same user as the recurring income definition")
    }

    return startMonth
  }

  private async ensureMonth(params: { userId: string; familyId?: string; year: number; month: number }) {
    let targetMonth = await monthRepository.findByUserAndPeriod(params.userId, params.year, params.month)

    if (!targetMonth) {
      targetMonth = await monthRepository.create({
        user_id: params.userId,
        family_id: params.familyId,
        year: params.year,
        month: params.month,
        status: "open"
      })
    }

    return targetMonth
  }

  private async generateMonthlyIncomes(data: {
    recurringIncomeId: string
    familyId?: string
    userId: string
    description: string
    grossIncome: number
    incomeType: string
    taxation?: IncomeTaxationDTO
    monthIds: string[]
  }) {
    const normalizedTaxation = incomeTaxationService.normalizeTaxation(data.taxation)

    for (const monthId of data.monthIds) {
      const existingIncome = await monthlyIncomeRepository.findRecurringIncomeEntry(data.recurringIncomeId, monthId)

      if (existingIncome) {
        continue
      }

      const income = await monthlyIncomeRepository.create({
        user_id: data.userId,
        month_id: monthId,
        recurring_income_id: data.recurringIncomeId,
        gross_income: data.grossIncome,
        income_type: data.incomeType,
        taxation_mode: normalizedTaxation.mode,
        taxation_profile: normalizedTaxation.profile,
        taxation_parameters: normalizedTaxation.parameters,
        notes: data.description,
      })

      const automaticTaxes = incomeTaxationService.calculateAutomaticTaxes(data.grossIncome, normalizedTaxation)

      if (automaticTaxes.length > 0) {
        await incomeTaxRepository.createMany(
          automaticTaxes.map((tax) => ({
            monthly_income_id: income.getDataValue("id") as string,
            tax_type: tax.tax_type,
            value: tax.value,
            is_auto: true,
          }))
        )
      }
    }
  }

  private async syncRecurringIncomeToOwnerMonths(data: {
    recurringIncomeId: string
    familyId?: string
    userId: string
    description: string
    grossIncome: number
    incomeType: string
    taxation?: IncomeTaxationDTO
    startMonthId: string
    occurrences?: number | null
  }) {
    const startMonth = await monthRepository.findById(data.startMonthId)
    if (!startMonth) {
      throw new Error("Start month not found")
    }

    const ownerMonths = await monthRepository.findByUserId(data.userId)
    const eligibleMonthIds = ownerMonths
      .filter((month) => this.isMonthWithinRecurringRange(startMonth, month, data.occurrences))
      .map((month) => month.getDataValue("id") as string)

    await this.generateMonthlyIncomes({
      recurringIncomeId: data.recurringIncomeId,
      familyId: data.familyId,
      userId: data.userId,
      description: data.description,
      grossIncome: data.grossIncome,
      incomeType: data.incomeType,
      taxation: data.taxation,
      monthIds: eligibleMonthIds,
    })
  }

  async syncRecurringIncomesForMonth(monthId: string) {
    const month = await monthRepository.findById(monthId)
    if (!month) {
      throw new Error("Month not found")
    }

    const userId = month.getDataValue("user_id") as string | null
    if (!userId) {
      return
    }

    const recurringIncomes = await recurringIncomeRepository.findByUserId(userId)

    for (const recurringIncome of recurringIncomes) {
      if ((recurringIncome.getDataValue("status") as string) !== "active") {
        continue
      }

      const startMonth = await monthRepository.findById(recurringIncome.getDataValue("start_month_id") as string)
      if (!startMonth || !this.isMonthWithinRecurringRange(startMonth, month, recurringIncome.getDataValue("occurrences") as number | null)) {
        continue
      }

      await this.generateMonthlyIncomes({
        recurringIncomeId: recurringIncome.getDataValue("id") as string,
        familyId: recurringIncome.getDataValue("family_id") as string | undefined,
        userId,
        description: recurringIncome.getDataValue("description") as string,
        grossIncome: Number(recurringIncome.getDataValue("gross_income")),
        incomeType: recurringIncome.getDataValue("income_type") as string,
        taxation: {
          mode: (recurringIncome.getDataValue("taxation_mode") as "manual" | "automatic" | null) ?? "manual",
          profile: recurringIncome.getDataValue("taxation_profile") as "me_pro_labore" | undefined,
          parameters: recurringIncome.getDataValue("taxation_parameters") as IncomeTaxationDTO["parameters"],
        },
        monthIds: [monthId],
      })
    }
  }

  async createRecurringIncome(data: CreateRecurringIncomeDTO) {
    this.validateBaseFields({
      description: data.description,
      grossIncome: data.gross_income,
      incomeType: data.income_type,
      kind: data.kind,
      status: data.status,
    })

    const startMonth = await this.validateUserAndMonth({
      userId: data.user_id,
      startMonthId: data.start_month_id,
    })

    const legacyFamilyId = this.getLegacyFamilyId(
      data.user_id,
      startMonth.getDataValue("family_id") as string | null
    )

    if (legacyFamilyId) {
      const family = await familyRepository.findById(legacyFamilyId)
      if (!family) {
        throw new Error("Family not found")
      }
    }

    const taxation = incomeTaxationService.normalizeTaxation(data.taxation)

    const recurringIncome = await recurringIncomeRepository.create({
      ...data,
      family_id: legacyFamilyId,
      taxation_mode: taxation.mode,
      taxation_profile: taxation.profile,
      taxation_parameters: taxation.parameters,
    })

    if (data.status === "active") {
      await this.syncRecurringIncomeToOwnerMonths({
        recurringIncomeId: recurringIncome.getDataValue("id") as string,
        familyId: legacyFamilyId,
        userId: data.user_id,
        description: data.description,
        grossIncome: data.gross_income,
        incomeType: data.income_type,
        taxation: data.taxation,
        startMonthId: data.start_month_id,
        occurrences: data.occurrences ?? null,
      })
    }

    return recurringIncome
  }

  async listRecurringIncomesByUser(userId: string) {
    return recurringIncomeRepository.findByUserId(userId)
  }

  async findRecurringIncomeById(id: string) {
    const recurringIncome = await recurringIncomeRepository.findById(id)
    if (!recurringIncome) {
      throw new Error("Recurring income not found")
    }
    return recurringIncome
  }

  async findMonthlyIncomesByRecurringIncome(id: string) {
    await this.findRecurringIncomeById(id)
    return monthlyIncomeRepository.findByRecurringIncomeId(id)
  }

  async updateRecurringIncome(id: string, data: UpdateRecurringIncomeDTO) {
    const existingRecurringIncome = await recurringIncomeRepository.findById(id)
    if (!existingRecurringIncome) {
      throw new Error("Recurring income not found")
    }

    const nextDescription = data.description ?? (existingRecurringIncome.getDataValue("description") as string)
    const nextGrossIncome = data.gross_income ?? Number(existingRecurringIncome.getDataValue("gross_income"))
    const nextIncomeType = data.income_type ?? (existingRecurringIncome.getDataValue("income_type") as string)
    const nextKind = data.kind ?? (existingRecurringIncome.getDataValue("kind") as string)
    const nextOccurrences = data.occurrences ?? null
    const nextStatus = data.status ?? (existingRecurringIncome.getDataValue("status") as string)
    const nextTaxation = data.taxation ?? {
      mode: (existingRecurringIncome.getDataValue("taxation_mode") as "manual" | "automatic" | null) ?? "manual",
      profile: existingRecurringIncome.getDataValue("taxation_profile") as "me_pro_labore" | undefined,
      parameters: existingRecurringIncome.getDataValue("taxation_parameters") as IncomeTaxationDTO["parameters"],
    }

    this.validateBaseFields({
      description: nextDescription,
      grossIncome: nextGrossIncome,
      incomeType: nextIncomeType,
      kind: nextKind,
      status: nextStatus,
    })

    const normalizedTaxation = incomeTaxationService.normalizeTaxation(nextTaxation)

    const recurringIncome = await recurringIncomeRepository.update(id, {
      ...data,
      taxation_mode: normalizedTaxation.mode,
      taxation_profile: normalizedTaxation.profile,
      taxation_parameters: normalizedTaxation.parameters,
    })
    if (!recurringIncome) {
      throw new Error("Recurring income not found")
    }

    await monthlyIncomeRepository.deleteByRecurringIncomeId(id)

    if (nextStatus === "active") {
      await this.syncRecurringIncomeToOwnerMonths({
        recurringIncomeId: id,
        familyId: existingRecurringIncome.getDataValue("family_id") as string,
        userId: existingRecurringIncome.getDataValue("user_id") as string,
        description: nextDescription,
        grossIncome: nextGrossIncome,
        incomeType: nextIncomeType,
        taxation: nextTaxation,
        startMonthId: existingRecurringIncome.getDataValue("start_month_id") as string,
        occurrences: nextOccurrences,
      })
    }

    return recurringIncome
  }

  async deleteRecurringIncome(id: string) {
    const recurringIncome = await recurringIncomeRepository.findById(id)
    if (!recurringIncome) {
      throw new Error("Recurring income not found")
    }

    await monthlyIncomeRepository.deleteByRecurringIncomeId(id)
    await recurringIncomeRepository.delete(id)
    return recurringIncome
  }
}