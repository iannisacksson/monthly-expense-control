import { Op } from "sequelize"
import { Expense } from "../models/index"

export class ExpenseRepository {
  async create(data: {
    user_id?: string
    family_id?: string
    month_id: string
    category_id: string
    subcategory_id?: string
    paid_by?: string
    responsible_user_id?: string
    installment_group_id?: string
    recurring_expense_id?: string
    is_paid?: boolean
    description: string
    value: number
    expense_date?: string
    payment_date?: string
  }) {
    return Expense.create(data)
  }

  async findById(id: string) {
    return Expense.findByPk(id)
  }

  async findByMonthId(monthId: string) {
    return Expense.findAll({ where: { month_id: monthId } })
  }

  async findByIds(ids: string[]) {
    return Expense.findAll({ where: { id: ids } })
  }

  async findByCategoryId(categoryId: string) {
    return Expense.findAll({ where: { category_id: categoryId } })
  }

  async findByInstallmentGroupId(installmentGroupId: string) {
    return Expense.findAll({ where: { installment_group_id: installmentGroupId } })
  }

  async findByRecurringExpenseId(recurringExpenseId: string) {
    return Expense.findAll({ where: { recurring_expense_id: recurringExpenseId } })
  }

  async findRecurringExpenseEntry(recurringExpenseId: string, monthId: string) {
    return Expense.findOne({ where: { recurring_expense_id: recurringExpenseId, month_id: monthId } })
  }

  async findInstallmentExpenseEntry(installmentGroupId: string, monthId: string) {
    return Expense.findOne({ where: { installment_group_id: installmentGroupId, month_id: monthId } })
  }

  async update(id: string, data: Partial<{
    category_id: string
    subcategory_id: string
    paid_by: string
    responsible_user_id: string
    recurring_expense_id: string
    is_paid: boolean
    description: string
    value: number
    expense_date: string
    payment_date: string | null
  }>) {
    const expense = await Expense.findByPk(id)
    if (!expense) return null
    return expense.update(data)
  }

  async updateManyByIds(ids: string[], data: Partial<{
    paid_by: string | null
    is_paid: boolean
    payment_date: string | null
  }>) {
    return Expense.update(data, { where: { id: ids } })
  }

  async delete(id: string) {
    const expense = await Expense.findByPk(id)
    if (!expense) return null
    await expense.destroy()
    return expense
  }

  async deleteManyByIds(ids: string[]) {
    return Expense.destroy({ where: { id: ids } })
  }

  async deleteByInstallmentGroupId(installmentGroupId: string) {
    return Expense.destroy({ where: { installment_group_id: installmentGroupId } })
  }

  async deleteByInstallmentGroupIdFromDate(installmentGroupId: string, expenseDate: string) {
    return Expense.destroy({ where: { installment_group_id: installmentGroupId, expense_date: { [Op.gte]: expenseDate } } })
  }

  async deleteByRecurringExpenseId(recurringExpenseId: string) {
    return Expense.destroy({ where: { recurring_expense_id: recurringExpenseId } })
  }

  async deleteByRecurringExpenseIdFromDate(recurringExpenseId: string, expenseDate: string) {
    return Expense.destroy({ where: { recurring_expense_id: recurringExpenseId, expense_date: { [Op.gte]: expenseDate } } })
  }
}
