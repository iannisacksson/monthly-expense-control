import type { RecurringExpense } from "../domain/entities/recurring-expense.entity";
import type { IRecurringExpenseRepository } from "../domain/repositories/recurring-expense.repository";
import { RecurringExpenseModel } from "../models/recurring-expense.model";

export class RecurringExpenseRepository implements IRecurringExpenseRepository {
  async create(data: RecurringExpense): Promise<RecurringExpense> {
    const model = await RecurringExpenseModel.create(data);
    return model.toDomain();
  }

  async findById(id: string): Promise<RecurringExpense | null> {
    const model = await RecurringExpenseModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByUserId(userId: string): Promise<RecurringExpense[]> {
    const models = await RecurringExpenseModel.findAll({ where: { userId } });
    return models.map((m) => m.toDomain());
  }

  async update(recurringExpense: RecurringExpense): Promise<RecurringExpense> {
    const [, [updatedModel]] = await RecurringExpenseModel.update(
      recurringExpense,
      {
        where: { id: recurringExpense.id },
        returning: true,
      },
    );
    return updatedModel.toDomain();
  }

  async delete(expense: RecurringExpense): Promise<void> {
    const model = await RecurringExpenseModel.findByPk(expense.id);
    if (!model) return;
    await model.destroy();
  }
}
