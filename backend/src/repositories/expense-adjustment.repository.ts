import type { ExpenseAdjustment } from "../domain/entities/expense-adjustment.entity";
import { Expense } from "../domain/entities/expense.entity";
import type { IExpenseAdjustmentRepository } from "../domain/repositories/expense-adjustment.repository";
import { ExpenseAdjustmentModel } from "../models/expense-adjustment.model";

export class ExpenseAdjustmentRepository implements IExpenseAdjustmentRepository {
  async create(data: ExpenseAdjustment): Promise<ExpenseAdjustment> {
    const model = await ExpenseAdjustmentModel.create(data);
    return model.toDomain();
  }

  async findByExpense(expense: Expense): Promise<ExpenseAdjustment[]> {
    const models = await ExpenseAdjustmentModel.findAll({
      where: { expenseId: expense.id },
      order: [["createdAt", "DESC"]],
    });
    return models.map((m) => m.toDomain());
  }
}
