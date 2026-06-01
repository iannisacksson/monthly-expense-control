import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  ExpenseItem,
  ExpenseItemEntity,
} from "../domain/entities/expense-item.entity";
import { Expense, ExpenseEntity } from "../domain/entities/expense.entity";

type ExpenseItemAttributes = ExpenseItem & { expenseId?: string };
type ExpenseItemCreationAttributes = Omit<ExpenseItemAttributes, "id">;

export class ExpenseItemModel
  extends Model<ExpenseItemAttributes, ExpenseItemCreationAttributes>
  implements ExpenseItemAttributes
{
  id!: string;
  expenseId?: string;
  expense!: Expense;
  description!: string;
  amount!: number;
  createdAt!: Date;

  constructor(data?: ExpenseItemCreationAttributes, options?: BuildOptions) {
    super(data, options);
    this.expenseId = data?.expenseId ?? data?.expense?.id;
  }

  toDomain(): ExpenseItem {
    const { expenseId, ...rest } = this.get();
    return new ExpenseItemEntity({
      ...rest,
      expense: new ExpenseEntity({ id: expenseId }),
    });
  }
}

ExpenseItemModel.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "expense_items",
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ["expense_id"] }],
  },
);
