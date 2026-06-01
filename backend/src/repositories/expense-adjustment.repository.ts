import type { ExpenseAdjustment } from "../domain/entities/expense-adjustment.entity";
import type { IExpenseAdjustmentRepository } from "../domain/repositories/expense-adjustment.repository";
import { ExpenseAdjustmentModel } from "../models/expense-adjustment.model";

export class ExpenseAdjustmentRepository implements IExpenseAdjustmentRepository {
  async create(
    data: Omit<ExpenseAdjustment, "id" | "createdAt" | "updatedAt">,
  ): Promise<ExpenseAdjustment> {
    const model = await ExpenseAdjustmentModel.create({
      expense: data.expense,
      changedBy: data.changedBy,
      previousValue: data.previousValue,
      newValue: data.newValue,
    });
    return model.toDomain();
  }

  async findByExpenseId(expenseId: string): Promise<ExpenseAdjustment[]> {
    const models = await ExpenseAdjustmentModel.findAll({
      where: { expenseId },
      order: [["createdAt", "DESC"]],
    });
    return models.map((m) => m.toDomain());
  }
}
