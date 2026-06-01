import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  Month,
  MonthEntity,
  MonthStatus,
} from "../domain/entities/month.entity";
import {
  BudgetRule,
  BudgetRuleEntity,
} from "../domain/entities/budget-rule.entity";
import { User, UserEntity } from "../domain/entities/user.entity";

type MonthAttributes = Month & { userId?: string; budgetRuleId?: string };
type MonthCreationAttributes = Omit<MonthAttributes, "id">;

export class MonthModel
  extends Model<MonthAttributes, MonthCreationAttributes>
  implements MonthAttributes
{
  id!: string;
  userId?: string;
  user!: User;
  budgetRuleId?: string;
  budgetRule?: BudgetRule;
  year!: number;
  month!: number;
  status!: MonthStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?: MonthCreationAttributes, options?: BuildOptions) {
    super(data, options);
    this.userId = data?.userId ?? data?.user?.id;
    this.budgetRuleId = data?.budgetRuleId ?? data?.budgetRule?.id;
  }

  toDomain(): Month {
    const { userId, budgetRuleId, ...rest } = this.get();
    return new MonthEntity({
      ...rest,
      user: new UserEntity({ id: userId }),
      budgetRule: budgetRuleId
        ? new BudgetRuleEntity({ id: budgetRuleId })
        : undefined,
    });
  }
}

MonthModel.init(
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
    budgetRuleId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    budgetRule: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("budgetRuleId");
        return id ? new BudgetRuleEntity({ id }) : undefined;
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TEXT,
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
    tableName: "months",
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "year", "month"],
      },
    ],
  },
);
