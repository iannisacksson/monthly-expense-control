import { ExpenseRepository } from "../repositories/expense.repository"
import { MonthRepository } from "../repositories/month.repository"
import { CategoryRepository } from "../repositories/category.repository"
import { SubcategoryRepository } from "../repositories/subcategory.repository"
import { BulkDeleteExpensesDTO, BulkMarkExpensesPaidDTO, CreateExpenseDTO, UpdateExpenseDTO } from "../dtos/expense.dto"
import { ForbiddenError } from "../utils/errors"

const expenseRepository = new ExpenseRepository()
const monthRepository = new MonthRepository()
const categoryRepository = new CategoryRepository()
const subcategoryRepository = new SubcategoryRepository()

export class ExpenseService {
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

  async createExpense(data: CreateExpenseDTO) {
    if (data.value <= 0) {
      throw new Error("Expense amount must be greater than zero")
    }

    if (!data.description || data.description.length > 255) {
      throw new Error("Description is required and must be at most 255 characters")
    }

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
      description: data.description,
      value: data.value,
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

  async updateExpense(id: string, data: UpdateExpenseDTO, requestingUserId: string) {
    if (data.value !== undefined && data.value <= 0) {
      throw new Error("Expense amount must be greater than zero")
    }

    if (data.is_paid !== undefined && typeof data.is_paid !== "boolean") {
      throw new Error("Expense paid state must be a boolean")
    }

    if (data.description !== undefined && data.description.length > 255) {
      throw new Error("Description must be at most 255 characters")
    }

    const existingExpense = await expenseRepository.findById(id)
    if (!existingExpense) {
      throw new Error("Expense not found")
    }

    const month = this.ensureMonthIsOpen(await monthRepository.findById(existingExpense.getDataValue("month_id") as string))

    if (month.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const nextCategoryId = data.category_id ?? (existingExpense.getDataValue("category_id") as string)
    const nextSubcategoryId = data.subcategory_id !== undefined
      ? data.subcategory_id
      : (existingExpense.getDataValue("subcategory_id") as string | undefined)
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

    if (data.is_paid === true && !data.payment_date) {
      nextData.payment_date = new Date().toISOString().split("T")[0]
    }

    if (data.is_paid === false) {
      nextData.payment_date = undefined
      nextData.paid_by = undefined
    }

    const expense = await expenseRepository.update(id, nextData)
    if (!expense) {
      throw new Error("Expense not found")
    }
    return expense
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
