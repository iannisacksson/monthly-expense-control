import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import {
  Expense,
  ExpenseEntity,
  ExpenseKindType,
} from "../../../domain/entities/expense.entity";
import {
  Month,
  MonthEntity,
  MonthStatus,
} from "../../../domain/entities/month.entity";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { UserEntity, User } from "../../../domain/entities/user.entity";
import {
  InstallmentGroup,
  InstallmentGroupEntity,
} from "../../../domain/entities/installment-group.entity";
import { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IInstallmentGroupRepository } from "../../../domain/repositories/installment-group.repository";

export class CreateInstallmentGroupUseCase {
  constructor(
    private readonly installmentGroupRepository: IInstallmentGroupRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly subcategoryRepository: ISubcategoryRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    installmentGroup: InstallmentGroup,
    requestingUser: User,
  ): Promise<InstallmentGroup> {
    this.validateBaseFields({
      totalValue: installmentGroup.totalValue,
      installments: installmentGroup.installments,
      startingInstallmentNumber: installmentGroup.startingInstallmentNumber,
    });

    const startMonth = await this.monthRepository.findById(
      installmentGroup.startMonth?.id as string,
    );
    if (!startMonth) {
      throw new NotFoundError("Start month not found");
    }

    if (startMonth.user.id !== requestingUser.id) {
      throw new ForbiddenError();
    }

    await this.validateCategoryAndSubcategory({
      userId: requestingUser.id,
      categoryId: installmentGroup.category?.id as string,
      subcategoryId: installmentGroup.subcategory?.id,
    });

    const user = await this.userRepository.findById(requestingUser.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const newInstallmentGroup = new InstallmentGroupEntity({
      user,
      description: installmentGroup.description,
      totalValue: installmentGroup.totalValue,
      installments: installmentGroup.installments,
      startingInstallmentNumber: installmentGroup.startingInstallmentNumber,
      category: installmentGroup.category,
      subcategory: installmentGroup.subcategory,
      paidBy: installmentGroup.paidBy,
      responsibleUser: installmentGroup.responsibleUser,
      startMonth,
    });

    const group =
      await this.installmentGroupRepository.create(newInstallmentGroup);

    await this.generateInstallmentExpenses(group);

    return group;
  }

  private validateBaseFields(params: {
    totalValue: number;
    installments: number;
    startingInstallmentNumber: number;
  }) {
    if (params.totalValue <= 0) {
      throw new Error("Total value must be greater than zero");
    }

    if (params.installments < 2) {
      throw new Error("Installments must be at least 2");
    }

    if (
      params.startingInstallmentNumber < 1 ||
      params.startingInstallmentNumber > params.installments
    ) {
      throw new Error(
        "Starting installment number must be between 1 and total installments",
      );
    }
  }

  private async validateCategoryAndSubcategory(params: {
    userId?: string;
    categoryId: string;
    subcategoryId?: string;
  }) {
    const category = await this.categoryRepository.findById(params.categoryId);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const categoryUserId = category.user?.id ?? null;
    const isSameOwner = !!params.userId && categoryUserId === params.userId;

    if (!isSameOwner) {
      throw new Error("Category must belong to the same owner as the expense");
    }

    if (params.subcategoryId) {
      const subcategory = await this.subcategoryRepository.findById(
        params.subcategoryId,
      );
      if (!subcategory) {
        throw new NotFoundError("Subcategory not found");
      }

      if (subcategory.category?.id !== params.categoryId) {
        throw new ForbiddenError(
          "Subcategory must belong to the selected category",
        );
      }
    }
  }

  private async findMonthByIdOrThrow(id: string): Promise<Month> {
    const month = await this.monthRepository.findById(id);
    if (!month) {
      throw new NotFoundError("Month not found");
    }

    return month;
  }

  private getMonthDate(month: Month): string {
    return `${month.year}-${String(month.month).padStart(2, "0")}-01`;
  }

  private async ensureMonth(params: {
    userId: string;
    year: number;
    month: number;
  }): Promise<Month> {
    const existingMonth = await this.monthRepository.findByUserAndPeriod(
      params.userId,
      params.year,
      params.month,
    );

    if (existingMonth) {
      return existingMonth;
    }

    return this.monthRepository.create(
      new MonthEntity({
        user: new UserEntity({ id: params.userId }),
        year: params.year,
        month: params.month,
        status: MonthStatus.OPEN,
      }),
    );
  }

  private async createInstallmentExpenseEntry(
    installmentGroup: InstallmentGroup,
    installmentNumber: number,
    month: Month,
  ): Promise<Expense | null> {
    const existingExpense =
      await this.expenseRepository.findInstallmentExpenseEntry(
        installmentGroup,
        month,
      );

    if (existingExpense) {
      return existingExpense;
    }

    await this.expenseRepository.create(
      new ExpenseEntity({
        month,
        category: installmentGroup.category,
        subcategory: installmentGroup.subcategory,
        paidBy: installmentGroup.paidBy,
        responsibleUser: installmentGroup.responsibleUser,
        installmentGroup: installmentGroup,
        expenseKind: ExpenseKindType.STANDARD,
        isPaid: false,
        description: `${installmentGroup.description} (${installmentNumber}/${installmentGroup.installments})`,
        value: Number(
          (installmentGroup.totalValue / installmentGroup.installments).toFixed(
            2,
          ),
        ),
        expenseDate: new Date(this.getMonthDate(month)),
      }),
    );

    return this.expenseRepository.findInstallmentExpenseEntry(
      installmentGroup,
      month,
    );
  }

  private async generateInstallmentExpenses(
    installmentGroup: InstallmentGroup,
  ): Promise<void> {
    const startMonth = await this.findMonthByIdOrThrow(
      installmentGroup.startMonth.id,
    );
    const startYear = startMonth.year;
    const startMonthNum = startMonth.month;
    const remainingInstallments =
      installmentGroup.installments -
      installmentGroup.startingInstallmentNumber +
      1;

    for (let i = 0; i < remainingInstallments; i++) {
      let targetMonth = startMonthNum + i;
      let targetYear = startYear;
      const installmentNumber = installmentGroup.startingInstallmentNumber + i;

      while (targetMonth > 12) {
        targetMonth -= 12;
        targetYear += 1;
      }

      const month = await this.ensureMonth({
        userId: installmentGroup.user.id,
        year: targetYear,
        month: targetMonth,
      });

      await this.createInstallmentExpenseEntry(
        installmentGroup,
        installmentNumber,
        month,
      );
    }
  }
}
