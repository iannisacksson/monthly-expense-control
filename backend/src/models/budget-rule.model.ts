import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  BudgetRule,
  BudgetRuleEntity,
} from "../domain/entities/budget-rule.entity";
import { User, UserEntity } from "../domain/entities/user.entity";

type BudgetRuleAttributes = BudgetRule & { userId?: string };
type BudgetRuleCreationAttributes = Omit<
  BudgetRuleAttributes,
  "id" | "validateName"
>;

export class BudgetRuleModel
  extends Model<BudgetRuleAttributes, BudgetRuleCreationAttributes>
  implements BudgetRuleAttributes
{
  id!: string;
  userId?: string;
  user!: User;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?: BudgetRuleCreationAttributes, options?: BuildOptions) {
    super(data, options);
    this.userId = data?.userId ?? data?.user?.id;
  }

  toDomain(): BudgetRule {
    const { userId, ...rest } = this.get();
    return new BudgetRuleEntity({
      ...rest,
      user: new UserEntity({ id: userId }),
    });
  }

  validateName() {
    this.toDomain().validateName();
  }
}

BudgetRuleModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    user: {
      type: DataTypes.VIRTUAL,
      get() {
        return new UserEntity({ id: this.getDataValue("userId") });
      },
    },
    name: {
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
    validateName: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.validateName;
      },
    },
  },
  {
    sequelize,
    tableName: "budget_rules",
    underscored: true,
    timestamps: true,
  },
);
