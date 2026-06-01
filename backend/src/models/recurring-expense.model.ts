import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  RecurringExpense,
  RecurringExpenseEntity,
  ExpenseKindType,
  RecurringExpenseStatus,
} from "../domain/entities/recurring-expense.entity";
import { Category, CategoryEntity } from "../domain/entities/category.entity";
import { Month, MonthEntity } from "../domain/entities/month.entity";
import {
  Subcategory,
  SubcategoryEntity,
} from "../domain/entities/subcategory.entity";
import { User, UserEntity } from "../domain/entities/user.entity";

type RecurringExpenseAttributes = Omit<
  RecurringExpense,
  "paidBy" | "responsibleUser"
> & {
  userId?: string;
  categoryId?: string;
  subcategoryId?: string;
  paidById?: string;
  paidBy?: User;
  responsibleUserId?: string;
  responsibleUser?: User;
  startMonthId?: string;
};
type RecurringExpenseCreationAttributes = Omit<
  RecurringExpenseAttributes,
  "id" | "validateBaseFields"
>;

export class RecurringExpenseModel
  extends Model<RecurringExpenseAttributes, RecurringExpenseCreationAttributes>
  implements RecurringExpenseAttributes
{
  id!: string;
  userId?: string;
  user!: User;
  description!: string;
  value!: number;
  expenseKind?: ExpenseKindType;
  plannedAmount?: number;
  categoryId?: string;
  category!: Category;
  subcategoryId?: string;
  subcategory?: Subcategory;
  paidById?: string;
  paidBy?: User;
  responsibleUserId?: string;
  responsibleUser?: User;
  startMonthId?: string;
  startMonth!: Month;
  occurrences?: number;
  status!: RecurringExpenseStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    data?: RecurringExpenseCreationAttributes,
    options?: BuildOptions,
  ) {
    super(data, options);
    this.userId = data?.userId ?? data?.user?.id;
    this.categoryId = data?.categoryId ?? data?.category?.id;
    this.subcategoryId = data?.subcategoryId ?? data?.subcategory?.id;
    this.paidById = data?.paidById ?? data?.paidBy?.id;
    this.responsibleUserId =
      data?.responsibleUserId ?? data?.responsibleUser?.id;
    this.startMonthId = data?.startMonthId ?? data?.startMonth?.id;
  }

  toDomain(): RecurringExpense {
    const {
      userId,
      categoryId,
      subcategoryId,
      paidById,
      responsibleUserId,
      startMonthId,
      ...rest
    } = this.get();
    return new RecurringExpenseEntity({
      ...rest,
      user: new UserEntity({ id: userId }),
      category: new CategoryEntity({ id: categoryId }),
      subcategory: subcategoryId
        ? new SubcategoryEntity({ id: subcategoryId })
        : undefined,
      paidBy: paidById ? new UserEntity({ id: paidById }) : undefined,
      responsibleUser: responsibleUserId
        ? new UserEntity({ id: responsibleUserId })
        : undefined,
      startMonth: new MonthEntity({ id: startMonthId }),
    });
  }

  validateBaseFields() {
    this.toDomain().validateBaseFields();
  }
}

RecurringExpenseModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user: {
      type: DataTypes.VIRTUAL,
      get() {
        return new UserEntity({ id: this.getDataValue("userId") });
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
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
    startMonthId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    startMonth: {
      type: DataTypes.VIRTUAL,
      get() {
        return new MonthEntity({ id: this.getDataValue("startMonthId") });
      },
    },
    occurrences: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
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
    validateBaseFields: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.validateBaseFields;
      },
    },
  },
  {
    sequelize,
    tableName: "recurring_expenses",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  },
);
