import { CreateRecurringIncomeDTO, UpdateRecurringIncomeDTO } from "../dtos/recurring-income.dto"
import { IncomeTaxRepository } from "../repositories/income-tax.repository"
import { MonthRepository } from "../repositories/month.repository"
import { MonthlyIncomeRepository } from "../repositories/monthly-income.repository"
import { RecurringIncomeRepository } from "../repositories/recurring-income.repository"
import { UserRepository } from "../repositories/user.repository"
import { IncomeTaxationDTO } from "../dtos/monthly-income.dto"
import { IncomeTaxationService } from "./income-taxation.service"
import { ForbiddenError } from "../utils/errors"
import { RecurringIncomeEntity } from "../domain/entities/recurring-income.entity";
import {
  getMonthDistance,
  isMonthWithinRecurringRange,
  type MonthPeriod,
} from "../domain/value-objects/month-period";

const recurringIncomeRepository = new RecurringIncomeRepository()
const monthlyIncomeRepository = new MonthlyIncomeRepository()
const incomeTaxRepository = new IncomeTaxRepository()
const monthRepository = new MonthRepository()
const userRepository = new UserRepository()
const incomeTaxationService = new IncomeTaxationService()

export class RecurringIncomeService {
  private getMonthDistance(startMonth: any, targetMonth: any) {
    return getMonthDistance(
      {
        year: startMonth.getDataValue("year") as number,
        month: startMonth.getDataValue("month") as number,
      } satisfies MonthPeriod,
      {
        year: targetMonth.getDataValue("year") as number,
        month: targetMonth.getDataValue("month") as number,
      } satisfies MonthPeriod,
    );
  }

  private validateBaseFields(params: {
    description: string
    grossIncome: number
    incomeType: string
    kind: string
    status: string
  }) {
    RecurringIncomeEntity.validateBaseFields(params);
  }

  private isMonthWithinRecurringRange(startMonth: any, targetMonth: any, occurrences?: number | null) {
    return isMonthWithinRecurringRange(
      {
        year: startMonth.getDataValue("year") as number,
        month: startMonth.getDataValue("month") as number,
      },
      {
        year: targetMonth.getDataValue("year") as number,
        month: targetMonth.getDataValue("month") as number,
      },
      occurrences,
    );
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

  private async ensureMonth(params: { userId: string; year: number; month: number }) {
    let targetMonth = await monthRepository.findByUserAndPeriod(params.userId, params.year, params.month)

    if (!targetMonth) {
      targetMonth = await monthRepository.create({
        user_id: params.userId,
        year: params.year,
        month: params.month,
        status: "open"
      })
    }

    return targetMonth
  }

  private async generateMonthlyIncomes(data: {
    recurringIncomeId: string
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
        userId: data.userId,
        monthId,
        recurringIncomeId: data.recurringIncomeId,
        grossIncome: data.grossIncome,
        incomeType: data.incomeType,
        taxationMode: normalizedTaxation.mode,
        taxationProfile: normalizedTaxation.profile,
        taxationParameters: normalizedTaxation.parameters as Record<
          string,
          unknown
        > | null,
        notes: data.description,
      });

      const automaticTaxes = incomeTaxationService.calculateAutomaticTaxes(data.grossIncome, normalizedTaxation)

      if (automaticTaxes.length > 0) {
        await incomeTaxRepository.createMany(
          automaticTaxes.map((tax) => ({
            monthly_income_id: income.id,
            tax_type: tax.tax_type,
            value: tax.value,
            is_auto: true,
          })),
        );
      }
    }
  }

  private async syncRecurringIncomeToOwnerMonths(data: {
    recurringIncomeId: string
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

  async createRecurringIncome(data: CreateRecurringIncomeDTO, requestingUserId: string) {
    this.validateBaseFields({
      description: data.description,
      grossIncome: data.gross_income,
      incomeType: data.income_type,
      kind: data.kind,
      status: data.status,
    })

    const startMonth = await this.validateUserAndMonth({
      userId: requestingUserId,
      startMonthId: data.start_month_id,
    })

    const taxation = incomeTaxationService.normalizeTaxation(data.taxation)

    const recurringIncome = await recurringIncomeRepository.create({
      ...data,
      user_id: requestingUserId,
      taxation_mode: taxation.mode,
      taxation_profile: taxation.profile,
      taxation_parameters: taxation.parameters,
    })

    if (data.status === "active") {
      await this.syncRecurringIncomeToOwnerMonths({
        recurringIncomeId: recurringIncome.getDataValue("id") as string,
        userId: requestingUserId,
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

  async findRecurringIncomeById(id: string, requestingUserId: string) {
    const recurringIncome = await recurringIncomeRepository.findById(id)
    if (!recurringIncome) {
      throw new Error("Recurring income not found")
    }
    if (recurringIncome.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
    return recurringIncome
  }

  async findMonthlyIncomesByRecurringIncome(id: string, requestingUserId: string) {
    await this.findRecurringIncomeById(id, requestingUserId)
    return monthlyIncomeRepository.findByRecurringIncomeId(id)
  }

  async updateRecurringIncome(id: string, data: UpdateRecurringIncomeDTO, requestingUserId: string) {
    const existingRecurringIncome = await recurringIncomeRepository.findById(id)
    if (!existingRecurringIncome) {
      throw new Error("Recurring income not found")
    }
    if (existingRecurringIncome.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

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

  async deleteRecurringIncome(id: string, requestingUserId: string) {
    const recurringIncome = await recurringIncomeRepository.findById(id)
    if (!recurringIncome) {
      throw new Error("Recurring income not found")
    }
    if (recurringIncome.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    await monthlyIncomeRepository.deleteByRecurringIncomeId(id)
    await recurringIncomeRepository.delete(id)
    return recurringIncome
  }
}