import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  BudgetAllocation,
  BudgetAllocationEntity,
} from "../domain/entities/budget-allocation.entity";
import {
  BudgetRule,
  BudgetRuleEntity,
} from "../domain/entities/budget-rule.entity";
import { Category, CategoryEntity } from "../domain/entities/category.entity";

type BudgetAllocationAttributes = BudgetAllocation & {
  budgetRuleId?: string;
  categoryId?: string;
};
type BudgetAllocationCreationAttributes = Omit<
  BudgetAllocationAttributes,
  "id" | "validatePercentage" | "ensureTotalPercentageWithinLimit"
>;

export class BudgetAllocationModel
  extends Model<BudgetAllocationAttributes, BudgetAllocationCreationAttributes>
  implements BudgetAllocationAttributes
{
  id!: string;
  budgetRuleId?: string;
  budgetRule!: BudgetRule;
  categoryId!: string;
  category!: Category;
  percentage!: number;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    data?: BudgetAllocationCreationAttributes,
    options?: BuildOptions,
  ) {
    super(data, options);
    this.budgetRuleId = data?.budgetRuleId ?? data?.budgetRule?.id;
  }

  toDomain(): BudgetAllocation {
    const { budgetRuleId, categoryId, ...rest } = this.get();
    return new BudgetAllocationEntity({
      ...rest,
      budgetRule: new BudgetRuleEntity({ id: budgetRuleId }),
      category: new CategoryEntity({ id: categoryId }),
    });
  }

  validatePercentage() {
    this.toDomain().validatePercentage();
  }

  ensureTotalPercentageWithinLimit(
    currentTotal: number,
    nextPercentage: number,
  ) {
    this.toDomain().ensureTotalPercentageWithinLimit(
      currentTotal,
      nextPercentage,
    );
  }
}

BudgetAllocationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    budgetRuleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    budgetRule: {
      type: DataTypes.VIRTUAL,
      get() {
        return new BudgetRuleEntity({ id: this.getDataValue("budgetRuleId") });
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
    percentage: {
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
    validatePercentage: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.validatePercentage();
      },
    },
    ensureTotalPercentageWithinLimit: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.ensureTotalPercentageWithinLimit;
      },
    },
  },
  {
    sequelize,
    tableName: "budget_allocations",
    underscored: true,
    timestamps: false,
  },
);
