import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import type { MonthlyIncome } from "../domain/entities/monthly-income.entity";

type MonthlyIncomeAttributes = MonthlyIncome;
type MonthlyIncomeCreationAttributes = Omit<
  MonthlyIncomeAttributes,
  "id" | "createdAt"
>;

export class MonthlyIncomeModel
  extends Model<MonthlyIncomeAttributes, MonthlyIncomeCreationAttributes>
  implements MonthlyIncomeAttributes
{
  id!: string;
  userId!: string;
  monthId!: string;
  recurringIncomeId?: string | null;
  grossIncome!: number;
  incomeType!: string;
  taxationMode!: "manual" | "automatic";
  taxationProfile?: string | null;
  taxationParameters?: Record<string, unknown> | null;
  notes?: string | null;
  createdAt!: Date;

  toDomain(): MonthlyIncome {
    return {
      id: this.id,
      userId: this.userId,
      monthId: this.monthId,
      recurringIncomeId: this.recurringIncomeId,
      grossIncome: Number(this.grossIncome),
      incomeType: this.incomeType,
      taxationMode: this.taxationMode,
      taxationProfile: this.taxationProfile,
      taxationParameters: this.taxationParameters,
      notes: this.notes,
      createdAt: this.createdAt,
    };
  }
}

MonthlyIncomeModel.init(
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
    monthId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    recurringIncomeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    grossIncome: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    incomeType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    taxationMode: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "manual",
    },
    taxationProfile: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    taxationParameters: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "monthly_incomes",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  },
);
