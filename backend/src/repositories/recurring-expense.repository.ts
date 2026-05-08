import { RecurringExpense } from "../models/index"

export class RecurringExpenseRepository {
  async create(data: {
    user_id?: string
    description: string
    value: number
    expense_kind?: string
    planned_amount?: number | null
    category_id: string
    subcategory_id?: string
    paid_by?: string
    responsible_user_id?: string
    start_month_id: string
    occurrences?: number | null
    status: string
  }) {
    return RecurringExpense.create(data)
  }

  async findById(id: string) {
    return RecurringExpense.findByPk(id)
  }

  async findByUserId(userId: string) {
    return RecurringExpense.findAll({ where: { user_id: userId } })
  }

  async update(id: string, data: Partial<{
    description: string
    value: number
    expense_kind: string
    planned_amount: number | null
    category_id: string
    subcategory_id: string
    paid_by: string
    responsible_user_id: string
    start_month_id: string
    occurrences: number | null
    status: string
  }>) {
    const recurringExpense = await RecurringExpense.findByPk(id)
    if (!recurringExpense) return null
    return recurringExpense.update(data)
  }

  async delete(id: string) {
    const recurringExpense = await RecurringExpense.findByPk(id)
    if (!recurringExpense) return null
    await recurringExpense.destroy()
    return recurringExpense
  }
}