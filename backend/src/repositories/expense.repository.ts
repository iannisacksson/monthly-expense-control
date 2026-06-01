import { Op } from "sequelize";
import type { Category } from "../domain/entities/category.entity";
import type {
  Expense,
  ExpenseKindType,
} from "../domain/entities/expense.entity";
import type { RecurringExpense } from "../domain/entities/recurring-expense.entity";
import type { Subcategory } from "../domain/entities/subcategory.entity";
import type { User } from "../domain/entities/user.entity";
import type { IExpenseRepository } from "../domain/repositories/expense.repository";
import { ExpenseModel } from "../models/expense.model";

export class ExpenseRepository implements IExpenseRepository {
  async create(
    data: Omit<Expense, "id" | "createdAt" | "updatedAt">,
  ): Promise<Expense> {
    const model = await ExpenseModel.create({
      month: data.month,
      category: data.category,
      subcategory: data.subcategory,
      paidBy: data.paidBy,
      responsibleUser: data.responsibleUser,
      installmentGroupId: data.installmentGroupId,
      recurringExpenseId: data.recurringExpenseId,
      expenseKind: data.expenseKind,
      plannedAmount: data.plannedAmount,
      isPaid: data.isPaid,
      description: data.description,
      value: data.value,
      expenseDate: data.expenseDate,
      paymentDate: data.paymentDate,
    });
    return model.toDomain();
  }

  async findById(id: string): Promise<Expense | null> {
    const model = await ExpenseModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByMonthId(monthId: string): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({ where: { monthId } });
    return models.map((m) => m.toDomain());
  }

  async findByMonthIdAndKind(
    monthId: string,
    expenseKind: ExpenseKindType,
  ): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({
      where: { monthId, expenseKind },
    });
    return models.map((m) => m.toDomain());
  }

  async findByIds(ids: string[]): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({ where: { id: ids } });
    return models.map((m) => m.toDomain());
  }

  async findByCategoryId(categoryId: string): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({ where: { categoryId } });
    return models.map((m) => m.toDomain());
  }

  async findByInstallmentGroupId(
    installmentGroupId: string,
  ): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({
      where: { installmentGroupFkId: installmentGroupId },
    });
    return models.map((m) => m.toDomain());
  }

  async findByRecurringExpenseId(
    recurringExpenseId: string,
  ): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({
      where: { recurringExpenseFkId: recurringExpenseId },
    });
    return models.map((m) => m.toDomain());
  }

  async findRecurringExpenseEntry(
    recurringExpenseId: string,
    monthId: string,
  ): Promise<Expense | null> {
    const model = await ExpenseModel.findOne({
      where: { recurringExpenseFkId: recurringExpenseId, monthId },
    });
    return model ? model.toDomain() : null;
  }

  async findInstallmentExpenseEntry(
    installmentGroupId: string,
    monthId: string,
  ): Promise<Expense | null> {
    const model = await ExpenseModel.findOne({
      where: { installmentGroupFkId: installmentGroupId, monthId },
    });
    return model ? model.toDomain() : null;
  }

  async update(
    id: string,
    data: Partial<{
      category: Category;
      subcategory: Subcategory | null;
      paidBy: User | null;
      responsibleUser: User | null;
      recurringExpenseId: RecurringExpense | null;
      expenseKind: ExpenseKindType;
      plannedAmount: number | null;
      isPaid: boolean;
      description: string;
      value: number;
      expenseDate: Date;
      paymentDate: Date | null;
    }>,
  ): Promise<Expense | null> {
    const model = await ExpenseModel.findByPk(id);
    if (!model) return null;
    const updateData: Record<string, unknown> = {};
    if (data.category !== undefined) updateData.categoryId = data.category.id;
    if (data.subcategory !== undefined)
      updateData.subcategoryId = data.subcategory?.id ?? null;
    if (data.paidBy !== undefined)
      updateData.paidById = data.paidBy?.id ?? null;
    if (data.responsibleUser !== undefined)
      updateData.responsibleUserId = data.responsibleUser?.id ?? null;
    if (data.recurringExpenseId !== undefined)
      updateData.recurringExpenseFkId = data.recurringExpenseId?.id ?? null;
    if (data.expenseKind !== undefined)
      updateData.expenseKind = data.expenseKind;
    if (data.plannedAmount !== undefined)
      updateData.plannedAmount = data.plannedAmount;
    if (data.isPaid !== undefined) updateData.isPaid = data.isPaid;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.value !== undefined) updateData.value = data.value;
    if (data.expenseDate !== undefined)
      updateData.expenseDate = data.expenseDate;
    if (data.paymentDate !== undefined)
      updateData.paymentDate = data.paymentDate;
    await model.update(updateData);
    return model.toDomain();
  }

  async updateManyByIds(
    ids: string[],
    data: Partial<{
      paidBy: User | null;
      isPaid: boolean;
      paymentDate: Date | null;
    }>,
  ): Promise<number> {
    const updateData: Record<string, unknown> = {};
    if (data.paidBy !== undefined)
      updateData.paidById = data.paidBy?.id ?? null;
    if (data.isPaid !== undefined) updateData.isPaid = data.isPaid;
    if (data.paymentDate !== undefined)
      updateData.paymentDate = data.paymentDate;
    const [count] = await ExpenseModel.update(updateData, {
      where: { id: ids },
    });
    return count;
  }

  async delete(expense: Expense): Promise<void> {
    const model = await ExpenseModel.findByPk(expense.id);
    if (!model) return;
    await model.destroy();
  }

  async deleteManyByIds(ids: string[]): Promise<number> {
    return ExpenseModel.destroy({ where: { id: ids } });
  }

  async deleteByInstallmentGroupId(
    installmentGroupId: string,
  ): Promise<number> {
    return ExpenseModel.destroy({
      where: { installmentGroupFkId: installmentGroupId },
    });
  }

  async deleteByInstallmentGroupIdFromDate(
    installmentGroupId: string,
    expenseDate: string,
  ): Promise<number> {
    return ExpenseModel.destroy({
      where: {
        installmentGroupFkId: installmentGroupId,
        expenseDate: { [Op.gte]: expenseDate },
      },
    });
  }

  async deleteByRecurringExpenseId(
    recurringExpenseId: string,
  ): Promise<number> {
    return ExpenseModel.destroy({
      where: { recurringExpenseFkId: recurringExpenseId },
    });
  }

  async deleteByRecurringExpenseIdFromDate(
    recurringExpenseId: string,
    expenseDate: string,
  ): Promise<number> {
    return ExpenseModel.destroy({
      where: {
        recurringExpenseFkId: recurringExpenseId,
        expenseDate: { [Op.gte]: expenseDate },
      },
    });
  }
}
