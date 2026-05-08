import { ExpenseAdjustment } from "../models"

export class ExpenseAdjustmentRepository {
  async create(data: {
    expense_id: string
    changed_by?: string
    previous_value: number
    new_value: number
  }) {
    return ExpenseAdjustment.create(data)
  }

  async findByExpenseId(expenseId: string) {
    return ExpenseAdjustment.findAll({
      where: { expense_id: expenseId },
      order: [["created_at", "DESC"]],
    })
  }
}