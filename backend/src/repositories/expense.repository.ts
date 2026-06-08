import { Op } from "sequelize";
import type {
  Expense,
  ExpenseKindType,
} from "../domain/entities/expense.entity";
import type { User } from "../domain/entities/user.entity";
import type { IExpenseRepository } from "../domain/repositories/expense.repository";
import { ExpenseModel } from "../models/expense.model";
import { InstallmentGroup } from "../domain/entities/installment-group.entity";
import { Month } from "../domain/entities/month.entity";
import { Category } from "../domain/entities/category.entity";
import { RecurringExpense } from "../domain/entities/recurring-expense.entity";

export class ExpenseRepository implements IExpenseRepository {
  async create(data: Expense): Promise<Expense> {
    const model = await ExpenseModel.create(data);
    return model.toDomain();
  }

  async findById(id: string): Promise<Expense | null> {
    const model = await ExpenseModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  async findByMonth(month: Month): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({ where: { monthId: month.id } });
    return models.map((m) => m.toDomain());
  }

  async findByMonthAndKind(
    month: Month,
    expenseKind: ExpenseKindType,
  ): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({
      where: { monthId: month.id, expenseKind },
    });
    return models.map((m) => m.toDomain());
  }

  async findByIds(ids: string[]): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({ where: { id: ids } });
    return models.map((m) => m.toDomain());
  }

  async findByCategory(category: Category): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({
      where: { categoryId: category.id },
    });
    return models.map((m) => m.toDomain());
  }

  async findByInstallmentGroup(
    installmentGroup: InstallmentGroup,
  ): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({
      where: { installmentGroupId: installmentGroup.id },
    });
    return models.map((m) => m.toDomain());
  }

  async findByRecurringExpense(
    recurringExpense: RecurringExpense,
  ): Promise<Expense[]> {
    const models = await ExpenseModel.findAll({
      where: { recurringExpenseId: recurringExpense.id },
    });
    return models.map((m) => m.toDomain());
  }

  async findRecurringExpenseEntry(
    recurringExpense: RecurringExpense,
    month: Month,
  ): Promise<Expense | null> {
    const model = await ExpenseModel.findOne({
      where: { recurringExpenseId: recurringExpense.id, monthId: month.id },
    });
    return model ? model.toDomain() : null;
  }

  async findInstallmentExpenseEntry(
    installmentGroup: InstallmentGroup,
    month: Month,
  ): Promise<Expense | null> {
    const model = await ExpenseModel.findOne({
      where: { installmentGroupId: installmentGroup.id, monthId: month.id },
    });
    return model ? model.toDomain() : null;
  }

  async update(expense: Expense): Promise<Expense> {
    const [_, [updatedModel]] = await ExpenseModel.update(expense, {
      where: { id: expense.id },
      returning: true,
    });
    return updatedModel.toDomain();
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
    await ExpenseModel.destroy({ where: { id: expense.id } });
  }

  async deleteMany(expenses: Expense[]): Promise<number> {
    return ExpenseModel.destroy({ where: { id: expenses.map((e) => e.id) } });
  }

  async deleteByInstallmentGroup(
    installmentGroup: InstallmentGroup,
  ): Promise<void> {
    await ExpenseModel.destroy({
      where: { installmentGroupId: installmentGroup.id },
    });
  }

  async deleteByInstallmentGroupFromDate(
    installmentGroup: InstallmentGroup,
    expenseDate: string,
  ): Promise<number> {
    return ExpenseModel.destroy({
      where: {
        installmentGroupId: installmentGroup.id,
        expenseDate: { [Op.gte]: expenseDate },
      },
    });
  }

  async deleteByRecurringExpense(
    recurringExpense: RecurringExpense,
  ): Promise<number> {
    return ExpenseModel.destroy({
      where: { recurringExpenseId: recurringExpense.id },
    });
  }

  async deleteByRecurringExpenseFromDate(
    recurringExpense: RecurringExpense,
    expenseDate: string,
  ): Promise<number> {
    return ExpenseModel.destroy({
      where: {
        recurringExpenseId: recurringExpense.id,
        expenseDate: { [Op.gte]: expenseDate },
      },
    });
  }
}
