import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  Expense,
  ExpenseEntity,
  ExpenseKindType,
} from "../domain/entities/expense.entity";
import { Category, CategoryEntity } from "../domain/entities/category.entity";
import {
  InstallmentGroup,
  InstallmentGroupEntity,
} from "../domain/entities/installment-group.entity";
import { Month, MonthEntity } from "../domain/entities/month.entity";
import {
  RecurringExpense,
  RecurringExpenseEntity,
} from "../domain/entities/recurring-expense.entity";
import {
  Subcategory,
  SubcategoryEntity,
} from "../domain/entities/subcategory.entity";
import { User, UserEntity } from "../domain/entities/user.entity";

type ExpenseAttributes = Omit<
  Expense,
  "paidBy" | "responsibleUser" | "installmentGroupId" | "recurringExpenseId"
> & {
  monthId?: string;
  categoryId?: string;
  subcategoryId?: string;
  paidById?: string;
  paidBy?: User;
  responsibleUserId?: string;
  responsibleUser?: User;
  installmentGroupFkId?: string;
  installmentGroupId?: InstallmentGroup;
  recurringExpenseFkId?: string;
  recurringExpenseId?: RecurringExpense;
};
type ExpenseCreationAttributes = Omit<ExpenseAttributes, "id">;

export class ExpenseModel
  extends Model<ExpenseAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes
{
  id!: string;
  monthId?: string;
  month!: Month;
  categoryId?: string;
  category!: Category;
  subcategoryId?: string;
  subcategory?: Subcategory;
  paidById?: string;
  paidBy?: User;
  responsibleUserId?: string;
  responsibleUser?: User;
  installmentGroupFkId?: string;
  installmentGroupId?: InstallmentGroup;
  recurringExpenseFkId?: string;
  recurringExpenseId?: RecurringExpense;
  expenseKind!: ExpenseKindType;
  plannedAmount!: number;
  isPaid!: boolean;
  description!: string;
  value!: number;
  expenseDate!: Date;
  paymentDate!: Date;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?: ExpenseCreationAttributes, options?: BuildOptions) {
    super(data, options);
    this.monthId = data?.monthId ?? data?.month?.id;
    this.categoryId = data?.categoryId ?? data?.category?.id;
    this.subcategoryId = data?.subcategoryId ?? data?.subcategory?.id;
    this.paidById = data?.paidById ?? data?.paidBy?.id;
    this.responsibleUserId =
      data?.responsibleUserId ?? data?.responsibleUser?.id;
    this.installmentGroupFkId =
      data?.installmentGroupFkId ?? data?.installmentGroupId?.id;
    this.recurringExpenseFkId =
      data?.recurringExpenseFkId ?? data?.recurringExpenseId?.id;
  }

  toDomain(): Expense {
    const {
      monthId,
      categoryId,
      subcategoryId,
      paidById,
      responsibleUserId,
      installmentGroupFkId,
      recurringExpenseFkId,
      ...rest
    } = this.get();
    return new ExpenseEntity({
      ...rest,
      month: new MonthEntity({ id: monthId }),
      category: new CategoryEntity({ id: categoryId }),
      subcategory: subcategoryId
        ? new SubcategoryEntity({ id: subcategoryId })
        : undefined,
      paidBy: paidById ? new UserEntity({ id: paidById }) : undefined,
      responsibleUser: responsibleUserId
        ? new UserEntity({ id: responsibleUserId })
        : undefined,
      installmentGroupId: installmentGroupFkId
        ? new InstallmentGroupEntity({ id: installmentGroupFkId })
        : undefined,
      recurringExpenseId: recurringExpenseFkId
        ? new RecurringExpenseEntity({ id: recurringExpenseFkId })
        : undefined,
    });
  }
}

ExpenseModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    monthId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    month: {
      type: DataTypes.VIRTUAL,
      get() {
        return new MonthEntity({ id: this.getDataValue("monthId") });
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    category: {
      type: DataTypes.VIRTUAL,
      get() {
        return new CategoryEntity({ id: this.getDataValue("categoryId") });
      },
    },
    subcategoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    subcategory: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("subcategoryId");
        return id ? new SubcategoryEntity({ id }) : undefined;
      },
    },
    paidById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "paid_by",
    },
    paidBy: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("paidById");
        return id ? new UserEntity({ id }) : undefined;
      },
    },
    responsibleUserId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    responsibleUser: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("responsibleUserId");
        return id ? new UserEntity({ id }) : undefined;
      },
    },
    installmentGroupFkId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "installment_group_id",
    },
    installmentGroupId: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("installmentGroupFkId");
        return id ? new InstallmentGroupEntity({ id }) : undefined;
      },
    },
    recurringExpenseFkId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "recurring_expense_id",
    },
    recurringExpenseId: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("recurringExpenseFkId");
        return id ? new RecurringExpenseEntity({ id }) : undefined;
      },
    },
    expenseKind: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard",
    },
    plannedAmount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    expenseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "expenses",
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ["month_id"] },
      { fields: ["category_id"] },
      { fields: ["expense_kind"] },
    ],
  },
);
