import type { Category } from "../domain/entities/category.entity";
import type { RecurringExpense } from "../domain/entities/recurring-expense.entity";
import type { Subcategory } from "../domain/entities/subcategory.entity";
import type { User } from "../domain/entities/user.entity";
import type { IRecurringExpenseRepository } from "../domain/repositories/recurring-expense.repository";
import { RecurringExpenseModel } from "../models/recurring-expense.model";

export class RecurringExpenseRepository implements IRecurringExpenseRepository {
  async create(
    data: Omit<
      RecurringExpense,
      "id" | "createdAt" | "updatedAt" | "validateBaseFields"
    >,
  ): Promise<RecurringExpense> {
    const model = await RecurringExpenseModel.create({
      user: data.user,
      description: data.description,
      value: data.value,
      expenseKind: data.expenseKind,
      plannedAmount: data.plannedAmount,
      category: data.category,
      subcategory: data.subcategory,
      paidBy: data.paidBy,
      responsibleUser: data.responsibleUser,
      startMonth: data.startMonth,
      occurrences: data.occurrences,
      status: data.status,
    });
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

  async update(
    id: string,
    data: Partial<{
      description: string;
      value: number;
      expenseKind: string;
      plannedAmount: number | null;
      category: Category;
      subcategory: Subcategory | null;
      paidBy: User | null;
      responsibleUser: User | null;
      occurrences: number | null;
      status: string;
    }>,
  ): Promise<RecurringExpense | null> {
    const model = await RecurringExpenseModel.findByPk(id);
    if (!model) return null;
    const updateData: Record<string, unknown> = { ...data };
    if (data.category !== undefined) {
      updateData.categoryId = data.category.id;
      delete updateData.category;
    }
    if (data.subcategory !== undefined) {
      updateData.subcategoryId = data.subcategory?.id ?? null;
      delete updateData.subcategory;
    }
    if (data.paidBy !== undefined) {
      updateData.paidById = data.paidBy?.id ?? null;
      delete updateData.paidBy;
    }
    if (data.responsibleUser !== undefined) {
      updateData.responsibleUserId = data.responsibleUser?.id ?? null;
      delete updateData.responsibleUser;
    }
    await model.update(updateData);
    return model.toDomain();
  }

  async delete(expense: RecurringExpense): Promise<void> {
    const model = await RecurringExpenseModel.findByPk(expense.id);
    if (!model) return;
    await model.destroy();
  }
}
