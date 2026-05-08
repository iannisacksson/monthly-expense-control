import { ExpenseItem } from "../models"

export class ExpenseItemRepository {
  async create(data: {
    expense_id: string
    description: string
    amount: number
  }) {
    return ExpenseItem.create(data)
  }

  async findById(id: string) {
    return ExpenseItem.findByPk(id)
  }

  async findByExpenseId(expenseId: string) {
    return ExpenseItem.findAll({ where: { expense_id: expenseId }, order: [["created_at", "DESC"]] })
  }

  async update(id: string, data: Partial<{
    description: string
    amount: number
  }>) {
    const expenseItem = await ExpenseItem.findByPk(id)
    if (!expenseItem) return null
    return expenseItem.update(data)
  }

  async delete(id: string) {
    const expenseItem = await ExpenseItem.findByPk(id)
    if (!expenseItem) return null
    await expenseItem.destroy()
    return expenseItem
  }

  async sumAmountByExpenseId(expenseId: string) {
    const items = await this.findByExpenseId(expenseId)
    return items.reduce((sum, item) => sum + Number(item.getDataValue("amount")), 0)
  }
}