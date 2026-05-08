import { ExpenseRepository } from "../repositories/expense.repository"
import { ExpenseItemRepository } from "../repositories/expense-item.repository"
import { ExpenseAdjustmentRepository } from "../repositories/expense-adjustment.repository"
import { MonthRepository } from "../repositories/month.repository"
import { CategoryRepository } from "../repositories/category.repository"
import { SubcategoryRepository } from "../repositories/subcategory.repository"
import { BulkDeleteExpensesDTO, BulkMarkExpensesPaidDTO, CreateExpenseDTO, UpdateExpenseDTO } from "../dtos/expense.dto"
import { CreateExpenseItemDTO, UpdateExpenseItemDTO } from "../dtos/expense-item.dto"
import { ForbiddenError } from "../utils/errors"

const expenseRepository = new ExpenseRepository()
const expenseItemRepository = new ExpenseItemRepository()
const expenseAdjustmentRepository = new ExpenseAdjustmentRepository()
const monthRepository = new MonthRepository()
const categoryRepository = new CategoryRepository()
const subcategoryRepository = new SubcategoryRepository()

export class ExpenseService {
  private readonly allowedExpenseKinds = ["standard", "envelope"] as const

  private getMonthDate(month: Awaited<ReturnType<MonthRepository["findById"]>>) {
    if (!month) {
      throw new Error("Month not found")
    }

    const year = month.getDataValue("year") as number
    const monthNumber = month.getDataValue("month") as number
    return `${year}-${String(monthNumber).padStart(2, "0")}-01`
  }

  private ensureMonthIsOpen(month: Awaited<ReturnType<MonthRepository["findById"]>>) {
    if (!month) {
      throw new Error("Month not found")
    }

    if ((month.getDataValue("status") as string) === "closed") {
      throw new Error("Closed months do not allow this expense operation")
    }

    return month
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
      throw new Error("Category must belong to the same owner as the expense")
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

  private validateExpenseKind(kind?: string) {
    const normalizedKind = kind ?? "standard"

    if (!this.allowedExpenseKinds.includes(normalizedKind as typeof this.allowedExpenseKinds[number])) {
      throw new Error("Expense kind must be standard or envelope")
    }

    return normalizedKind
  }

  private validatePlannedAmount(params: {
    expenseKind: string
    plannedAmount?: number | null
  }) {
    if (params.expenseKind === "envelope") {
      if (params.plannedAmount === undefined || params.plannedAmount === null || params.plannedAmount <= 0) {
        throw new Error("Envelope expenses must define a planned amount greater than zero")
      }

      return params.plannedAmount
    }

    if (params.plannedAmount !== undefined && params.plannedAmount !== null && params.plannedAmount <= 0) {
      throw new Error("Planned amount must be greater than zero when provided")
    }

    return params.plannedAmount ?? null
  }

  private validateExpenseItem(data: CreateExpenseItemDTO | UpdateExpenseItemDTO) {
    if (data.description !== undefined && (!data.description || data.description.length > 255)) {
      throw new Error("Expense item description is required and must be at most 255 characters")
    }

    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("Expense item amount must be greater than zero")
    }
  }

  private async findEnvelopeExpenseOrThrow(expenseId: string, requestingUserId: string) {
    const expense = await this.findExpenseById(expenseId, requestingUserId)
    if ((expense.getDataValue("expense_kind") as string) !== "envelope") {
      throw new Error("Expense items are only available for envelope expenses")
    }

    return expense
  }

  private async syncEnvelopeExpenseValue(expenseId: string, requestingUserId?: string) {
    const expense = await expenseRepository.findById(expenseId)
    if (!expense) {
      throw new Error("Expense not found")
    }

    const previousValue = Number(expense.getDataValue("value"))
    const nextValue = await expenseItemRepository.sumAmountByExpenseId(expenseId)

    if (previousValue === nextValue) {
      return expense
    }

    const updatedExpense = await expenseRepository.update(expenseId, { value: nextValue })
    if (!updatedExpense) {
      throw new Error("Expense not found")
    }

    await expenseAdjustmentRepository.create({
      expense_id: expenseId,
      changed_by: requestingUserId,
      previous_value: previousValue,
      new_value: nextValue,
    })

    return updatedExpense
  }

  async createExpense(data: CreateExpenseDTO) {
    const expenseKind = this.validateExpenseKind(data.expense_kind)
    const resolvedValue = expenseKind === "envelope" ? 0 : data.value

    if (resolvedValue === undefined || (expenseKind !== "envelope" && resolvedValue <= 0)) {
      throw new Error("Expense amount must be greater than zero")
    }

    if (!data.description || data.description.length > 255) {
      throw new Error("Description is required and must be at most 255 characters")
    }

    const plannedAmount = this.validatePlannedAmount({
      expenseKind,
      plannedAmount: data.planned_amount,
    })

    const month = this.ensureMonthIsOpen(await monthRepository.findById(data.month_id))
    const monthUserId = month.getDataValue("user_id") as string | null
    const ownerUserId = data.user_id ?? monthUserId ?? undefined

    if (!ownerUserId) {
      throw new Error("Expense must belong to the owner user of the selected month")
    }

    if (ownerUserId && monthUserId !== ownerUserId) {
      throw new Error("Month must belong to the same user as the expense")
    }

    await this.validateCategoryAndSubcategory({
      userId: ownerUserId,
      categoryId: data.category_id,
      subcategoryId: data.subcategory_id,
    })

    const expenseDate = data.expense_date ?? this.getMonthDate(month)

    return expenseRepository.create({
      month_id: data.month_id,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      paid_by: data.paid_by,
      responsible_user_id: data.responsible_user_id,
      installment_group_id: data.installment_group_id,
      recurring_expense_id: data.recurring_expense_id,
      expense_kind: expenseKind,
      planned_amount: plannedAmount ?? undefined,
      description: data.description,
      value: resolvedValue,
      expense_date: expenseDate,
      payment_date: data.payment_date,
    })
  }

  async findExpenseById(id: string, requestingUserId: string) {
    const expense = await expenseRepository.findById(id)
    if (!expense) {
      throw new Error("Expense not found")
    }
    const month = await monthRepository.findById(expense.getDataValue("month_id") as string)
    if (!month || month.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
    return expense
  }

  async findExpensesByUserAndMonth(userId: string, monthId: string) {
    const month = await monthRepository.findById(monthId)
    if (!month) {
      throw new Error("Month not found")
    }

    if (month.getDataValue("user_id") !== userId) {
      throw new ForbiddenError()
    }

    return expenseRepository.findByMonthId(monthId)
  }

  async findExpensesByCategory(categoryId: string) {
    return expenseRepository.findByCategoryId(categoryId)
  }

  async listExpenseAdjustments(id: string, requestingUserId: string) {
    await this.findExpenseById(id, requestingUserId)
    return expenseAdjustmentRepository.findByExpenseId(id)
  }

  async updateExpense(id: string, data: UpdateExpenseDTO, requestingUserId: string) {
    const existingExpense = await expenseRepository.findById(id)
    if (!existingExpense) {
      throw new Error("Expense not found")
    }

    const currentExpenseKind = this.validateExpenseKind(existingExpense.getDataValue("expense_kind") as string | undefined)

    if (data.value !== undefined && currentExpenseKind !== "envelope" && data.value <= 0) {
      throw new Error("Expense amount must be greater than zero")
    }

    if (data.is_paid !== undefined && typeof data.is_paid !== "boolean") {
      throw new Error("Expense paid state must be a boolean")
    }

    if (data.description !== undefined && data.description.length > 255) {
      throw new Error("Description must be at most 255 characters")
    }

    const month = this.ensureMonthIsOpen(await monthRepository.findById(existingExpense.getDataValue("month_id") as string))

    if (month.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const nextCategoryId = data.category_id ?? (existingExpense.getDataValue("category_id") as string)
    const nextSubcategoryId = data.subcategory_id !== undefined
      ? data.subcategory_id
      : (existingExpense.getDataValue("subcategory_id") as string | undefined)
    const nextExpenseKind = this.validateExpenseKind(
      data.expense_kind ?? (existingExpense.getDataValue("expense_kind") as string | undefined)
    )

    if (currentExpenseKind === "envelope" && data.value !== undefined) {
      throw new Error("Envelope current value must be managed through expense items")
    }

    const nextPlannedAmount = this.validatePlannedAmount({
      expenseKind: nextExpenseKind,
      plannedAmount: data.planned_amount !== undefined
        ? data.planned_amount
        : (existingExpense.getDataValue("planned_amount") as number | null | undefined),
    })
    const ownerUserId = (month.getDataValue("user_id") as string | null) ?? undefined

    if (!ownerUserId) {
      throw new Error("Expense must belong to the owner user of the selected month")
    }

    await this.validateCategoryAndSubcategory({
      userId: ownerUserId,
      categoryId: nextCategoryId,
      subcategoryId: nextSubcategoryId,
    })

    const nextData: UpdateExpenseDTO = { ...data }
    nextData.expense_kind = nextExpenseKind
    nextData.planned_amount = nextPlannedAmount

    if (data.is_paid === true && !data.payment_date) {
      nextData.payment_date = new Date().toISOString().split("T")[0]
    }

    if (data.is_paid === false) {
      nextData.payment_date = undefined
      nextData.paid_by = undefined
    }

    const previousValue = Number(existingExpense.getDataValue("value"))
    const shouldCreateAdjustment = nextExpenseKind === "envelope"
      && data.value !== undefined
      && previousValue !== data.value

    const expense = await expenseRepository.update(id, nextData)
    if (!expense) {
      throw new Error("Expense not found")
    }

    if (shouldCreateAdjustment) {
      await expenseAdjustmentRepository.create({
        expense_id: id,
        changed_by: requestingUserId,
        previous_value: previousValue,
        new_value: data.value as number,
      })
    }

    return expense
  }

  async listExpenseItems(expenseId: string, requestingUserId: string) {
    await this.findEnvelopeExpenseOrThrow(expenseId, requestingUserId)
    return expenseItemRepository.findByExpenseId(expenseId)
  }

  async createExpenseItem(expenseId: string, data: CreateExpenseItemDTO, requestingUserId: string) {
    this.validateExpenseItem(data)

    const expense = await this.findEnvelopeExpenseOrThrow(expenseId, requestingUserId)
    this.ensureMonthIsOpen(await monthRepository.findById(expense.getDataValue("month_id") as string))

    const item = await expenseItemRepository.create({
      expense_id: expenseId,
      description: data.description,
      amount: data.amount,
    })

    await this.syncEnvelopeExpenseValue(expenseId, requestingUserId)
    return item
  }

  async updateExpenseItem(itemId: string, data: UpdateExpenseItemDTO, requestingUserId: string) {
    this.validateExpenseItem(data)

    const existingItem = await expenseItemRepository.findById(itemId)
    if (!existingItem) {
      throw new Error("Expense item not found")
    }

    const expenseId = existingItem.getDataValue("expense_id") as string
    const expense = await this.findEnvelopeExpenseOrThrow(expenseId, requestingUserId)
    this.ensureMonthIsOpen(await monthRepository.findById(expense.getDataValue("month_id") as string))

    const updatedItem = await expenseItemRepository.update(itemId, data)
    if (!updatedItem) {
      throw new Error("Expense item not found")
    }

    await this.syncEnvelopeExpenseValue(expenseId, requestingUserId)
    return updatedItem
  }

  async deleteExpenseItem(itemId: string, requestingUserId: string) {
    const existingItem = await expenseItemRepository.findById(itemId)
    if (!existingItem) {
      throw new Error("Expense item not found")
    }

    const expenseId = existingItem.getDataValue("expense_id") as string
    const expense = await this.findEnvelopeExpenseOrThrow(expenseId, requestingUserId)
    this.ensureMonthIsOpen(await monthRepository.findById(expense.getDataValue("month_id") as string))

    const deletedItem = await expenseItemRepository.delete(itemId)
    if (!deletedItem) {
      throw new Error("Expense item not found")
    }

    await this.syncEnvelopeExpenseValue(expenseId, requestingUserId)
    return deletedItem
  }

  async deleteExpense(id: string, requestingUserId: string) {
    const existingExpense = await expenseRepository.findById(id)
    if (!existingExpense) {
      throw new Error("Expense not found")
    }

    const month = this.ensureMonthIsOpen(await monthRepository.findById(existingExpense.getDataValue("month_id") as string))
    if (month.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const expense = await expenseRepository.delete(id)
    if (!expense) {
      throw new Error("Expense not found")
    }
    return expense
  }

  async bulkDeleteExpenses(data: BulkDeleteExpensesDTO, requestingUserId: string) {
    if (!data.month_id) {
      throw new Error("month_id is required")
    }

    if (!Array.isArray(data.expense_ids) || data.expense_ids.length === 0) {
      throw new Error("expense_ids must contain at least one expense")
    }

    const month = this.ensureMonthIsOpen(await monthRepository.findById(data.month_id))

    if (month.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    const expenses = await expenseRepository.findByIds(data.expense_ids)
    if (expenses.length !== data.expense_ids.length) {
      throw new Error("One or more expenses were not found")
    }

    const allBelongToMonth = expenses.every((expense) => expense.getDataValue("month_id") === data.month_id)
    if (!allBelongToMonth) {
      throw new Error("All selected expenses must belong to the same month")
    }

    const deletedCount = await expenseRepository.deleteManyByIds(data.expense_ids)

    return {
      success: true,
      deleted_count: deletedCount,
    }
  }

  async bulkMarkExpensesPaid(data: BulkMarkExpensesPaidDTO, requestingUserId: string) {
    if (!data.month_id) {
      throw new Error("month_id is required")
    }

    if (!Array.isArray(data.expense_ids) || data.expense_ids.length === 0) {
      throw new Error("expense_ids must contain at least one expense")
    }

    const month = this.ensureMonthIsOpen(await monthRepository.findById(data.month_id))

    if (month.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    const expenses = await expenseRepository.findByIds(data.expense_ids)
    if (expenses.length !== data.expense_ids.length) {
      throw new Error("One or more expenses were not found")
    }

    const allBelongToMonth = expenses.every((expense) => expense.getDataValue("month_id") === data.month_id)
    if (!allBelongToMonth) {
      throw new Error("All selected expenses must belong to the same month")
    }

    const paymentDate = data.payment_date ?? new Date().toISOString().split("T")[0]

    await expenseRepository.updateManyByIds(data.expense_ids, {
      is_paid: true,
      paid_by: data.paid_by ?? null,
      payment_date: paymentDate,
    })

    return {
      success: true,
      updated_count: data.expense_ids.length,
      payment_date: paymentDate,
    }
  }
}
