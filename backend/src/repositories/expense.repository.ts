import { Op } from "sequelize";
import type {
  Expense,
  ExpenseKindType,
} from "../domain/entities/expense.entity";
import type { User } from "../domain/entities/user.entity";
import type { IExpenseRepository } from "../domain/repositories/expense.repository";
import { ExpenseModel } from "../models/expense.model";
import { InstallmentGroup } from "../domain/entities/installment-group.entity";

export class ExpenseRepository implements IExpenseRepository {
  async create(data: Expense): Promise<Expense> {
    const model = await ExpenseModel.create(data);
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
      where: { installmentGroupFkId: installmentGroup.id },
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
