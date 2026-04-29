import { CreateRecurringExpenseDTO, RecurringExpenseScope, UpdateRecurringExpenseDTO } from "../dtos/recurring-expense.dto"
import { CategoryRepository } from "../repositories/category.repository"
import { ExpenseRepository } from "../repositories/expense.repository"
import { MonthRepository } from "../repositories/month.repository"
import { RecurringExpenseRepository } from "../repositories/recurring-expense.repository"
import { ForbiddenError } from "../utils/errors"
import { SubcategoryRepository } from "../repositories/subcategory.repository"
import { UserRepository } from "../repositories/user.repository"

const recurringExpenseRepository = new RecurringExpenseRepository()
const expenseRepository = new ExpenseRepository()
const monthRepository = new MonthRepository()
const categoryRepository = new CategoryRepository()
const subcategoryRepository = new SubcategoryRepository()
const userRepository = new UserRepository()

export class RecurringExpenseService {
  private async findMonthByIdOrThrow(id: string) {
    const month = await monthRepository.findById(id)
    if (!month) {
      throw new Error("Month not found")
    }
    return month
  }

  private getMonthDistance(startMonth: any, targetMonth: any) {
    const startYear = startMonth.getDataValue("year") as number
    const startMonthNumber = startMonth.getDataValue("month") as number
    const targetYear = targetMonth.getDataValue("year") as number
    const targetMonthNumber = targetMonth.getDataValue("month") as number
    return ((targetYear - startYear) * 12) + (targetMonthNumber - startMonthNumber)
  }

  private getMonthDate(month: any) {
    const year = month.getDataValue("year") as number
    const monthNumber = month.getDataValue("month") as number
    return `${year}-${String(monthNumber).padStart(2, "0")}-01`
  }

  private async getEffectiveMonthContext(startMonthId: string, effectiveMonthId?: string) {
    if (!effectiveMonthId) {
      throw new Error("effective_month_id is required for this scope")
    }

    const startMonth = await this.findMonthByIdOrThrow(startMonthId)
    const effectiveMonth = await this.findMonthByIdOrThrow(effectiveMonthId)
    const distance = this.getMonthDistance(startMonth, effectiveMonth)

    if (distance < 0) {
      throw new Error("Effective month must be on or after the start month")
    }

    return {
      startMonth,
      effectiveMonth,
      distance,
      effectiveDate: this.getMonthDate(effectiveMonth),
    }
  }

  private async validateCategoryAndSubcategory(params: {
    userId?: string
    categoryId: string
    subcategoryId?: string
  }) {
    const category = await categoryRepository.findById(params.categoryId)
    if (!category) {
      throw new Error("Category not found")
    }

    const categoryUserId = category.getDataValue("user_id") as string | null
    const isSameOwner = !!params.userId && categoryUserId === params.userId

    if (!isSameOwner) {
      throw new Error("Category must belong to the same owner as the recurring expense")
    }

    if (params.subcategoryId) {
      const subcategory = await subcategoryRepository.findById(params.subcategoryId)
      if (!subcategory) {
        throw new Error("Subcategory not found")
      }

      if (subcategory.getDataValue("category_id") !== params.categoryId) {
        throw new Error("Subcategory must belong to the selected category")
      }
    }
  }

  private validateBaseFields(params: {
    description: string
    value: number
    status: string
  }) {
    if (!params.description || params.description.length > 255) {
      throw new Error("Description is required and must be at most 255 characters")
    }

    if (params.value <= 0) {
      throw new Error("Recurring expense amount must be greater than zero")
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

  private async createRecurringExpenseEntry(data: {
    recurringExpenseId: string
    userId?: string
    description: string
    value: number
    categoryId: string
    subcategoryId?: string
    paidBy?: string
    responsibleUserId?: string
    monthId: string
  }) {
    const month = await this.findMonthByIdOrThrow(data.monthId)
    const existingExpense = await expenseRepository.findRecurringExpenseEntry(data.recurringExpenseId, data.monthId)

    if (existingExpense) {
      return existingExpense
    }

    await expenseRepository.create({
      month_id: data.monthId,
      category_id: data.categoryId,
      subcategory_id: data.subcategoryId,
      paid_by: data.paidBy,
      responsible_user_id: data.responsibleUserId,
      recurring_expense_id: data.recurringExpenseId,
      description: data.description,
      value: data.value,
      expense_date: this.getMonthDate(month)
    })

    return expenseRepository.findRecurringExpenseEntry(data.recurringExpenseId, data.monthId)
  }

  private async generateRecurringExpenses(data: {
    recurringExpenseId: string
    userId?: string
    description: string
    value: number
    categoryId: string
    subcategoryId?: string
    paidBy?: string
    responsibleUserId?: string
    monthIds: string[]
  }) {
    for (const monthId of data.monthIds) {
      const existingExpense = await expenseRepository.findRecurringExpenseEntry(data.recurringExpenseId, monthId)

      if (existingExpense) {
        continue
      }

      const month = await this.findMonthByIdOrThrow(monthId)

      await expenseRepository.create({
        month_id: monthId,
        category_id: data.categoryId,
        subcategory_id: data.subcategoryId,
        paid_by: data.paidBy,
        responsible_user_id: data.responsibleUserId,
        recurring_expense_id: data.recurringExpenseId,
        description: data.description,
        value: data.value,
        expense_date: this.getMonthDate(month)
      })
    }
  }

  private async syncRecurringExpenseToOwnerMonths(data: {
    recurringExpenseId: string
    userId: string
    description: string
    value: number
    categoryId: string
    subcategoryId?: string
    paidBy?: string
    responsibleUserId?: string
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

    await this.generateRecurringExpenses({
      recurringExpenseId: data.recurringExpenseId,
      userId: data.userId,
      description: data.description,
      value: data.value,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId,
      paidBy: data.paidBy,
      responsibleUserId: data.responsibleUserId,
      monthIds: eligibleMonthIds,
    })
  }

  async syncRecurringExpensesForMonth(monthId: string) {
    const month = await monthRepository.findById(monthId)
    if (!month) {
      throw new Error("Month not found")
    }

    const userId = month.getDataValue("user_id") as string | null
    if (!userId) {
      return
    }

    const recurringExpenses = await recurringExpenseRepository.findByUserId(userId)

    for (const recurringExpense of recurringExpenses) {
      if ((recurringExpense.getDataValue("status") as string) !== "active") {
        continue
      }

      const startMonth = await monthRepository.findById(recurringExpense.getDataValue("start_month_id") as string)
      if (!startMonth || !this.isMonthWithinRecurringRange(startMonth, month, recurringExpense.getDataValue("occurrences") as number | null)) {
        continue
      }

      await this.generateRecurringExpenses({
        recurringExpenseId: recurringExpense.getDataValue("id") as string,
        userId: recurringExpense.getDataValue("user_id") as string | undefined,
        description: recurringExpense.getDataValue("description") as string,
        value: Number(recurringExpense.getDataValue("value")),
        categoryId: recurringExpense.getDataValue("category_id") as string,
        subcategoryId: recurringExpense.getDataValue("subcategory_id") as string | undefined,
        paidBy: recurringExpense.getDataValue("paid_by") as string | undefined,
        responsibleUserId: recurringExpense.getDataValue("responsible_user_id") as string | undefined,
        monthIds: [monthId],
      })
    }
  }

  async createRecurringExpense(data: CreateRecurringExpenseDTO, requestingUserId: string) {
    this.validateBaseFields({
      description: data.description,
      value: data.value,
      status: data.status,
    })

    const startMonth = await monthRepository.findById(data.start_month_id)
    if (!startMonth) {
      throw new Error("Start month not found")
    }

    const monthUserId = startMonth.getDataValue("user_id") as string | null
    if (monthUserId !== requestingUserId) {
      throw new ForbiddenError()
    }

    const user = await userRepository.findById(requestingUserId)
    if (!user) {
      throw new Error("User not found")
    }

    await this.validateCategoryAndSubcategory({
      userId: requestingUserId,
      categoryId: data.category_id,
      subcategoryId: data.subcategory_id,
    })

    const recurringExpense = await recurringExpenseRepository.create({
      user_id: requestingUserId,
      description: data.description,
      value: data.value,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      paid_by: data.paid_by,
      responsible_user_id: data.responsible_user_id,
      start_month_id: data.start_month_id,
      occurrences: data.occurrences,
      status: data.status,
    })

    if (data.status === "active") {
      await this.syncRecurringExpenseToOwnerMonths({
        recurringExpenseId: recurringExpense.getDataValue("id") as string,
        userId: requestingUserId,
        description: data.description,
        value: data.value,
        categoryId: data.category_id,
        subcategoryId: data.subcategory_id,
        paidBy: data.paid_by,
        responsibleUserId: data.responsible_user_id,
        startMonthId: data.start_month_id,
        occurrences: data.occurrences ?? null,
      })
    }

    return recurringExpense
  }

  async listRecurringExpensesByUser(requestingUserId: string) {
    return recurringExpenseRepository.findByUserId(requestingUserId)
  }

  async findRecurringExpenseById(id: string, requestingUserId: string) {
    const recurringExpense = await recurringExpenseRepository.findById(id)
    if (!recurringExpense) {
      throw new Error("Recurring expense not found")
    }
    if (recurringExpense.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
    return recurringExpense
  }

  async findExpensesByRecurringExpense(id: string, requestingUserId: string) {
    await this.findRecurringExpenseById(id, requestingUserId)
    return expenseRepository.findByRecurringExpenseId(id)
  }

  private async updateWholeSeries(id: string, existingRecurringExpense: any, data: UpdateRecurringExpenseDTO) {
    const nextDescription = data.description ?? (existingRecurringExpense.getDataValue("description") as string)
    const nextValue = data.value ?? Number(existingRecurringExpense.getDataValue("value"))
    const nextCategoryId = data.category_id ?? (existingRecurringExpense.getDataValue("category_id") as string)
    const nextSubcategoryId = data.subcategory_id !== undefined
      ? data.subcategory_id
      : (existingRecurringExpense.getDataValue("subcategory_id") as string | undefined)
    const nextOccurrences = data.occurrences ?? null
    const nextStatus = data.status ?? (existingRecurringExpense.getDataValue("status") as string)
    const nextPaidBy = data.paid_by !== undefined ? data.paid_by : (existingRecurringExpense.getDataValue("paid_by") as string | undefined)
    const nextResponsibleUserId = data.responsible_user_id !== undefined
      ? data.responsible_user_id
      : (existingRecurringExpense.getDataValue("responsible_user_id") as string | undefined)
    const userId = existingRecurringExpense.getDataValue("user_id") as string | undefined

    if (!userId) {
      throw new Error("Recurring expense must belong to a user")
    }

    this.validateBaseFields({
      description: nextDescription,
      value: nextValue,
      status: nextStatus,
    })

    await this.validateCategoryAndSubcategory({
      userId,
      categoryId: nextCategoryId,
      subcategoryId: nextSubcategoryId,
    })

    const recurringExpense = await recurringExpenseRepository.update(id, {
      description: nextDescription,
      value: nextValue,
      category_id: nextCategoryId,
      subcategory_id: nextSubcategoryId,
      paid_by: nextPaidBy,
      responsible_user_id: nextResponsibleUserId,
      occurrences: nextOccurrences,
      status: nextStatus,
    })

    if (!recurringExpense) {
      throw new Error("Recurring expense not found")
    }

    await expenseRepository.deleteByRecurringExpenseId(id)

    if (nextStatus === "active") {
      await this.syncRecurringExpenseToOwnerMonths({
        recurringExpenseId: id,
        userId,
        description: nextDescription,
        value: nextValue,
        categoryId: nextCategoryId,
        subcategoryId: nextSubcategoryId,
        paidBy: nextPaidBy,
        responsibleUserId: nextResponsibleUserId,
        startMonthId: recurringExpense.getDataValue("start_month_id") as string,
        occurrences: nextOccurrences,
      })
    }

    return recurringExpense
  }

  async updateRecurringExpense(id: string, data: UpdateRecurringExpenseDTO, requestingUserId: string) {
    const existingRecurringExpense = await recurringExpenseRepository.findById(id)
    if (!existingRecurringExpense) {
      throw new Error("Recurring expense not found")
    }
    if (existingRecurringExpense.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const scope: RecurringExpenseScope = data.scope ?? "whole_series"

    if (scope === "whole_series") {
      return this.updateWholeSeries(id, existingRecurringExpense, data)
    }

    const startMonthId = existingRecurringExpense.getDataValue("start_month_id") as string
    const { distance, effectiveDate } = await this.getEffectiveMonthContext(startMonthId, data.effective_month_id)
    const existingOccurrences = existingRecurringExpense.getDataValue("occurrences") as number | null

    if (existingOccurrences != null && distance >= existingOccurrences) {
      throw new Error("Effective month is outside the recurring expense range")
    }

    if (scope === "single_occurrence") {
      const occurrence = await expenseRepository.findRecurringExpenseEntry(id, data.effective_month_id as string)
      if (!occurrence) {
        throw new Error("Recurring expense occurrence not found for the selected month")
      }

      const nextCategoryId = data.category_id ?? (occurrence.getDataValue("category_id") as string)
      const nextSubcategoryId = data.subcategory_id !== undefined
        ? data.subcategory_id
        : (occurrence.getDataValue("subcategory_id") as string | undefined)

      await this.validateCategoryAndSubcategory({
        userId: existingRecurringExpense.getDataValue("user_id") as string | undefined,
        categoryId: nextCategoryId,
        subcategoryId: nextSubcategoryId,
      })

      return expenseRepository.update(occurrence.getDataValue("id") as string, {
        description: data.description ?? (occurrence.getDataValue("description") as string),
        value: data.value ?? Number(occurrence.getDataValue("value")),
        category_id: nextCategoryId,
        subcategory_id: nextSubcategoryId,
        paid_by: data.paid_by !== undefined ? data.paid_by : (occurrence.getDataValue("paid_by") as string | undefined),
        responsible_user_id: data.responsible_user_id !== undefined
          ? data.responsible_user_id
          : (occurrence.getDataValue("responsible_user_id") as string | undefined),
      })
    }

    if (distance === 0) {
      return this.updateWholeSeries(id, existingRecurringExpense, data)
    }

    const nextDescription = data.description ?? (existingRecurringExpense.getDataValue("description") as string)
    const nextValue = data.value ?? Number(existingRecurringExpense.getDataValue("value"))
    const nextCategoryId = data.category_id ?? (existingRecurringExpense.getDataValue("category_id") as string)
    const nextSubcategoryId = data.subcategory_id !== undefined
      ? data.subcategory_id
      : (existingRecurringExpense.getDataValue("subcategory_id") as string | undefined)
    const nextStatus = data.status ?? (existingRecurringExpense.getDataValue("status") as string)
    const nextPaidBy = data.paid_by !== undefined ? data.paid_by : (existingRecurringExpense.getDataValue("paid_by") as string | undefined)
    const nextResponsibleUserId = data.responsible_user_id !== undefined
      ? data.responsible_user_id
      : (existingRecurringExpense.getDataValue("responsible_user_id") as string | undefined)
    const futureOccurrences = data.occurrences ?? (existingOccurrences != null ? existingOccurrences - distance : null)
    const userId = existingRecurringExpense.getDataValue("user_id") as string | undefined

    if (!userId) {
      throw new Error("Recurring expense must belong to a user")
    }

    this.validateBaseFields({
      description: nextDescription,
      value: nextValue,
      status: nextStatus,
    })

    await this.validateCategoryAndSubcategory({
      userId,
      categoryId: nextCategoryId,
      subcategoryId: nextSubcategoryId,
    })

    await expenseRepository.deleteByRecurringExpenseIdFromDate(id, effectiveDate)
    await recurringExpenseRepository.update(id, { occurrences: distance })

    const newRecurringExpense = await recurringExpenseRepository.create({
      user_id: userId,
      description: nextDescription,
      value: nextValue,
      category_id: nextCategoryId,
      subcategory_id: nextSubcategoryId,
      paid_by: nextPaidBy,
      responsible_user_id: nextResponsibleUserId,
      start_month_id: data.effective_month_id as string,
      occurrences: futureOccurrences,
      status: nextStatus,
    })

    if (nextStatus === "active") {
      await this.syncRecurringExpenseToOwnerMonths({
        recurringExpenseId: newRecurringExpense.getDataValue("id") as string,
        userId,
        description: nextDescription,
        value: nextValue,
        categoryId: nextCategoryId,
        subcategoryId: nextSubcategoryId,
        paidBy: nextPaidBy,
        responsibleUserId: nextResponsibleUserId,
        startMonthId: data.effective_month_id as string,
        occurrences: futureOccurrences,
      })
    }

    return newRecurringExpense
  }

  async deleteRecurringExpense(id: string, params?: { scope?: RecurringExpenseScope; effective_month_id?: string }, requestingUserId?: string) {
    const recurringExpense = await recurringExpenseRepository.findById(id)
    if (!recurringExpense) {
      throw new Error("Recurring expense not found")
    }
    if (requestingUserId && recurringExpense.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const scope = params?.scope ?? "whole_series"

    if (scope === "whole_series") {
      await expenseRepository.deleteByRecurringExpenseId(id)
      await recurringExpenseRepository.delete(id)
      return recurringExpense
    }

    const startMonthId = recurringExpense.getDataValue("start_month_id") as string
    const { distance, effectiveDate } = await this.getEffectiveMonthContext(startMonthId, params?.effective_month_id)
    const existingOccurrences = recurringExpense.getDataValue("occurrences") as number | null

    if (existingOccurrences != null && distance >= existingOccurrences) {
      throw new Error("Effective month is outside the recurring expense range")
    }

    if (scope === "single_occurrence") {
      const deletedOccurrence = await expenseRepository.findRecurringExpenseEntry(id, params?.effective_month_id as string)
      if (!deletedOccurrence) {
        throw new Error("Recurring expense occurrence not found for the selected month")
      }

      await expenseRepository.delete(deletedOccurrence.getDataValue("id") as string)
      return recurringExpense
    }

    if (distance === 0) {
      await expenseRepository.deleteByRecurringExpenseId(id)
      await recurringExpenseRepository.delete(id)
      return recurringExpense
    }

    await expenseRepository.deleteByRecurringExpenseIdFromDate(id, effectiveDate)
    await recurringExpenseRepository.update(id, { occurrences: distance })
    return recurringExpenseRepository.findById(id)
  }

  async restoreRecurringExpenseOccurrence(id: string, monthId: string, requestingUserId: string) {
    const recurringExpense = await recurringExpenseRepository.findById(id)
    if (!recurringExpense) {
      throw new Error("Recurring expense not found")
    }
    if (recurringExpense.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    if ((recurringExpense.getDataValue("status") as string) !== "active") {
      throw new Error("Only active recurring expenses can restore occurrences")
    }

    const startMonthId = recurringExpense.getDataValue("start_month_id") as string
    const { distance } = await this.getEffectiveMonthContext(startMonthId, monthId)
    const occurrences = recurringExpense.getDataValue("occurrences") as number | null

    if (occurrences != null && distance >= occurrences) {
      throw new Error("Selected month is outside the recurring expense range")
    }

    return this.createRecurringExpenseEntry({
      recurringExpenseId: id,
      userId: recurringExpense.getDataValue("user_id") as string | undefined,
      description: recurringExpense.getDataValue("description") as string,
      value: Number(recurringExpense.getDataValue("value")),
      categoryId: recurringExpense.getDataValue("category_id") as string,
      subcategoryId: recurringExpense.getDataValue("subcategory_id") as string | undefined,
      paidBy: recurringExpense.getDataValue("paid_by") as string | undefined,
      responsibleUserId: recurringExpense.getDataValue("responsible_user_id") as string | undefined,
      monthId,
    })
  }
}