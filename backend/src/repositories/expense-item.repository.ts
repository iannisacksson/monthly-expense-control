import type { ExpenseItem } from "../domain/entities/expense-item.entity";
import { Expense } from "../domain/entities/expense.entity";
import type { IExpenseItemRepository } from "../domain/repositories/expense-item.repository";
import { ExpenseItemModel } from "../models/expense-item.model";

export class ExpenseItemRepository implements IExpenseItemRepository {
  async create(data: ExpenseItem): Promise<ExpenseItem> {
    const model = await ExpenseItemModel.create(data);
    return model.toDomain();
  }

  async findById(id: string): Promise<ExpenseItem | null> {
    const model = await ExpenseItemModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByExpense(expense: Expense): Promise<ExpenseItem[]> {
    const models = await ExpenseItemModel.findAll({
      where: { expenseId: expense.id },
      order: [["createdAt", "DESC"]],
    });
    return models.map((m) => m.toDomain());
  }

  async update(expenseItem: ExpenseItem): Promise<ExpenseItem> {
    const [_, [model]] = await ExpenseItemModel.update(expenseItem, {
      where: { id: expenseItem.id },
      returning: true,
    });
    return model.toDomain();
  }

  async delete(item: ExpenseItem): Promise<void> {
    const model = await ExpenseItemModel.findByPk(item.id);
    if (!model) return;
    await model.destroy();
  }

  async sumAmountByExpense(expense: Expense): Promise<number> {
    const items = await this.findByExpense(expense);
    return items.reduce((sum, item) => sum + Number(item.amount), 0);
  }
}
