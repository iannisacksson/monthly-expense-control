import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  ExpenseAdjustment,
  ExpenseAdjustmentEntity,
} from "../domain/entities/expense-adjustment.entity";
import { Expense, ExpenseEntity } from "../domain/entities/expense.entity";
import { User, UserEntity } from "../domain/entities/user.entity";

type ExpenseAdjustmentAttributes = Omit<ExpenseAdjustment, "changedBy"> & {
  expenseId?: string;
  changedById?: string;
  changedBy?: User;
};
type ExpenseAdjustmentCreationAttributes = Omit<
  ExpenseAdjustmentAttributes,
  "id"
>;

export class ExpenseAdjustmentModel
  extends Model<
    ExpenseAdjustmentAttributes,
    ExpenseAdjustmentCreationAttributes
  >
  implements ExpenseAdjustmentAttributes
{
  id!: string;
  expenseId?: string;
  expense!: Expense;
  changedById?: string;
  changedBy?: User;
  previousValue!: number;
  newValue!: number;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    data?: ExpenseAdjustmentCreationAttributes,
    options?: BuildOptions,
  ) {
    super(data, options);
    this.expenseId = data?.expenseId ?? data?.expense?.id;
    this.changedById = data?.changedById ?? data?.changedBy?.id;
  }

  toDomain(): ExpenseAdjustment {
    const { expenseId, changedById, ...rest } = this.get();
    return new ExpenseAdjustmentEntity({
      ...rest,
      expense: new ExpenseEntity({ id: expenseId }),
      changedBy: changedById ? new UserEntity({ id: changedById }) : undefined,
    });
  }
}

ExpenseAdjustmentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    expenseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expense: {
      type: DataTypes.VIRTUAL,
      get() {
        return new ExpenseEntity({ id: this.getDataValue("expenseId") });
      },
    },
    changedById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "changed_by",
    },
    changedBy: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("changedById");
        return id ? new UserEntity({ id }) : undefined;
      },
    },
    previousValue: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    newValue: {
      type: DataTypes.DECIMAL,
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
  },
  {
    sequelize,
    tableName: "expense_adjustments",
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ["expense_id"] }],
  },
);
