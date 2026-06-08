import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import {
  Expense,
  ExpenseEntity,
  ExpenseKindType,
} from "../../../domain/entities/expense.entity";
import {
  InstallmentGroup,
  InstallmentGroupEntity,
  InstallmentGroupScope,
} from "../../../domain/entities/installment-group.entity";
import {
  Month,
  MonthEntity,
  MonthStatus,
} from "../../../domain/entities/month.entity";
import { User, UserEntity } from "../../../domain/entities/user.entity";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { IExpenseRepository } from "../../../domain/repositories/expense.repository";
import { IInstallmentGroupRepository } from "../../../domain/repositories/installment-group.repository";
import { IMonthRepository } from "../../../domain/repositories/month.repository";
import { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { Category } from "../../../domain/entities/category.entity";
import { Subcategory } from "../../../domain/entities/subcategory.entity";

type UpdateInstallmentGroupResult = InstallmentGroup | Expense;

export class UpdateInstallmentGroupUseCase {
  constructor(
    private readonly installmentGroupRepository: IInstallmentGroupRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly monthRepository: IMonthRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly subcategoryRepository: ISubcategoryRepository,
  ) {}

  async execute(
    installmentGroup: InstallmentGroup,
    requestingUser: User,
    effectiveMonth?: Month,
    scope: InstallmentGroupScope = InstallmentGroupScope.WHOLE_SERIES,
  ): Promise<UpdateInstallmentGroupResult> {
    const existingGroup = await this.installmentGroupRepository.findById(
      installmentGroup.id,
    );
    if (!existingGroup) {
      throw new NotFoundError("Installment group not found");
    }

    if (existingGroup.user.id !== requestingUser.id) {
      throw new ForbiddenError();
    }

    if (scope === InstallmentGroupScope.WHOLE_SERIES) {
      return this.updateWholeSeries(existingGroup, installmentGroup);
    }

    if (!effectiveMonth?.id) {
      throw new Error("effective_month_id is required for this scope");
    }

    const {
      effectiveDate,
      distance,
      effectiveMonth: resolvedEffectiveMonth,
    } = await this.getEffectiveMonthContext(
      existingGroup.startMonth.id,
      effectiveMonth.id,
    );
    const effectiveInstallmentNumber =
      existingGroup.startingInstallmentNumber + distance;

    if (effectiveInstallmentNumber > existingGroup.installments) {
      throw new Error("Effective month is outside the installment range");
    }

    if (scope === InstallmentGroupScope.SINGLE_OCCURRENCE) {
      return this.updateSingleOccurrence(
        existingGroup,
        installmentGroup,
        resolvedEffectiveMonth,
      );
    }

    if (distance === 0) {
      return this.updateWholeSeries(existingGroup, installmentGroup);
    }

    const nextState = this.resolveNextGroupState(
      existingGroup,
      installmentGroup,
    );

    this.validateBaseFields({
      totalValue: nextState.totalValue,
      installments: nextState.installments,
      startingInstallmentNumber: effectiveInstallmentNumber,
    });

    await this.validateCategoryAndSubcategory(
      existingGroup.user,
      nextState.category,
      nextState.subcategory,
    );

    const currentInstallmentValue =
      Number(existingGroup.totalValue) / existingGroup.installments;

    await this.expenseRepository.deleteByInstallmentGroupFromDate(
      existingGroup,
      effectiveDate,
    );

    existingGroup.installments = effectiveInstallmentNumber - 1;
    existingGroup.totalValue = Number(
      (currentInstallmentValue * (effectiveInstallmentNumber - 1)).toFixed(2),
    );

    await this.installmentGroupRepository.update(existingGroup);

    const newGroup = await this.installmentGroupRepository.create(
      new InstallmentGroupEntity({
        user: existingGroup.user,
        description: nextState.description,
        totalValue: nextState.totalValue,
        installments: nextState.installments,
        startingInstallmentNumber: effectiveInstallmentNumber,
        category: nextState.category,
        subcategory: nextState.subcategory,
        paidBy: nextState.paidBy,
        responsibleUser: nextState.responsibleUser,
        startMonth: resolvedEffectiveMonth,
      }),
    );

    await this.generateInstallmentExpenses(newGroup, resolvedEffectiveMonth);

    return newGroup;
  }

  private async updateWholeSeries(
    existingGroup: InstallmentGroup,
    installmentGroup: InstallmentGroup,
  ): Promise<InstallmentGroup> {
    const nextState = this.resolveNextGroupState(
      existingGroup,
      installmentGroup,
    );

    this.validateBaseFields({
      totalValue: nextState.totalValue,
      installments: nextState.installments,
      startingInstallmentNumber: existingGroup.startingInstallmentNumber,
    });

    await this.validateCategoryAndSubcategory(
      existingGroup.user,
      nextState.category,
      nextState.subcategory,
    );

    existingGroup.description = nextState.description;
    existingGroup.totalValue = nextState.totalValue;
    existingGroup.installments = nextState.installments;
    existingGroup.category = nextState.category;
    existingGroup.subcategory = nextState.subcategory ?? undefined;
    existingGroup.paidBy = nextState.paidBy ?? undefined;
    existingGroup.responsibleUser = nextState.responsibleUser ?? undefined;

    const group = await this.installmentGroupRepository.update(existingGroup);

    if (!group) {
      throw new NotFoundError("Installment group not found");
    }

    await this.expenseRepository.deleteByInstallmentGroup(existingGroup);
    await this.generateInstallmentExpenses(group, existingGroup.startMonth);

    return group;
  }

  private async updateSingleOccurrence(
    existingGroup: InstallmentGroup,
    installmentGroup: InstallmentGroup,
    effectiveMonth: Month,
  ): Promise<Expense> {
    const occurrence = await this.expenseRepository.findInstallmentExpenseEntry(
      existingGroup,
      effectiveMonth,
    );
    if (!occurrence) {
      throw new NotFoundError(
        "Installment occurrence not found for the selected month",
      );
    }

    const nextCategory = installmentGroup.category?.id
      ? installmentGroup.category
      : occurrence.category;
    const nextSubcategory = this.resolveOptionalField(
      installmentGroup,
      "subcategory",
      occurrence.subcategory,
    );
    const nextPaidBy = this.resolveOptionalField(
      installmentGroup,
      "paidBy",
      occurrence.paidBy,
    );
    const nextResponsibleUser = this.resolveOptionalField(
      installmentGroup,
      "responsibleUser",
      occurrence.responsibleUser,
    );

    await this.validateCategoryAndSubcategory(
      existingGroup.user,
      nextCategory,
      nextSubcategory,
    );

    const value =
      installmentGroup.totalValue !== undefined &&
      installmentGroup.installments !== undefined
        ? Number(
            (
              installmentGroup.totalValue / installmentGroup.installments
            ).toFixed(2),
          )
        : occurrence.value;

    return this.expenseRepository.update(
      new ExpenseEntity({
        ...occurrence,
        category: nextCategory,
        subcategory: nextSubcategory,
        paidBy: nextPaidBy,
        responsibleUser: nextResponsibleUser,
        description: installmentGroup.description ?? occurrence.description,
        value,
      }),
    );
  }

  private resolveNextGroupState(
    existingGroup: InstallmentGroup,
    installmentGroup: InstallmentGroup,
  ): InstallmentGroup {
    Object.assign(existingGroup, {
      description: installmentGroup.description ?? existingGroup.description,
      totalValue: installmentGroup.totalValue ?? existingGroup.totalValue,
      installments: installmentGroup.installments ?? existingGroup.installments,
      category: installmentGroup.category?.id
        ? installmentGroup.category
        : existingGroup.category,
      subcategory: this.resolveOptionalField(
        installmentGroup,
        "subcategory",
        existingGroup.subcategory,
      ),
      paidBy: this.resolveOptionalField(
        installmentGroup,
        "paidBy",
        existingGroup.paidBy,
      ),
      responsibleUser: this.resolveOptionalField(
        installmentGroup,
        "responsibleUser",
        existingGroup.responsibleUser,
      ),
    });

    return existingGroup;
  }

  private resolveOptionalField<T extends keyof InstallmentGroup>(
    installmentGroup: InstallmentGroup,
    field: T,
    fallback: InstallmentGroup[T],
  ) {
    if (Object.prototype.hasOwnProperty.call(installmentGroup, field)) {
      return installmentGroup[field];
    }

    return fallback;
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

  private async validateCategoryAndSubcategory(
    user: User,
    category: Category,
    subcategory?: Subcategory,
  ): Promise<void> {
    const categoryFound = await this.categoryRepository.findById(category.id);
    if (!categoryFound) {
      throw new NotFoundError("Category not found");
    }

    const categoryUserId = categoryFound.user?.id ?? null;
    const isSameOwner = !!user.id && categoryUserId === user.id;

    if (!isSameOwner) {
      throw new Error(
        "Category must belong to the same owner as the installment purchase",
      );
    }

    if (subcategory) {
      const subcategoryFound = await this.subcategoryRepository.findById(
        subcategory.id,
      );
      if (!subcategoryFound) {
        throw new NotFoundError("Subcategory not found");
      }

      if (subcategoryFound.category?.id !== categoryFound.id) {
        throw new ForbiddenError(
          "Subcategory must belong to the selected category",
        );
      }
    }
  }

  private async getEffectiveMonthContext(
    startMonthId: string,
    effectiveMonthId: string,
  ) {
    const startMonth = await this.findMonthByIdOrThrow(startMonthId);
    const effectiveMonth = await this.findMonthByIdOrThrow(effectiveMonthId);
    const distance = this.getMonthDistance(startMonth, effectiveMonth);

    return {
      startMonth,
      effectiveMonth,
      distance,
      effectiveDate: this.getMonthDate(effectiveMonth),
    };
  }

  private async findMonthByIdOrThrow(id: string): Promise<Month> {
    const month = await this.monthRepository.findById(id);
    if (!month) {
      throw new NotFoundError("Month not found");
    }

    return month;
  }

  private getMonthDistance(startMonth: Month, targetMonth: Month) {
    const distance =
      (targetMonth.year - startMonth.year) * 12 +
      (targetMonth.month - startMonth.month);

    if (distance < 0) {
      throw new Error("Effective month must be on or after the start month");
    }

    return distance;
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
    month: Month,
    installmentNumber: number,
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
        installmentGroup,
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
    effectiveMonth: Month,
  ): Promise<void> {
    const remainingInstallments =
      installmentGroup.installments -
      installmentGroup.startingInstallmentNumber +
      1;

    for (let i = 0; i < remainingInstallments; i++) {
      let targetMonth = effectiveMonth.month + i;
      let targetYear = effectiveMonth.year;
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
        month,
        installmentNumber,
      );
    }
  }
}
