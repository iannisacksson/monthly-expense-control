import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  MonthlyIncome,
  MonthlyIncomeEntity,
  IncomeType,
  TaxationModeType,
} from "../domain/entities/monthly-income.entity";
import { Month, MonthEntity } from "../domain/entities/month.entity";
import {
  RecurringIncome,
  RecurringIncomeEntity,
} from "../domain/entities/recurring-income.entity";
import { User, UserEntity } from "../domain/entities/user.entity";

type MonthlyIncomeAttributes = MonthlyIncome & {
  userId?: string;
  monthId?: string;
  recurringIncomeId?: string | null;
};
type MonthlyIncomeCreationAttributes = Omit<
  MonthlyIncomeAttributes,
  "id" | "validateGrossIncome" | "validateNotes"
>;

export class MonthlyIncomeModel
  extends Model<MonthlyIncomeAttributes, MonthlyIncomeCreationAttributes>
  implements MonthlyIncomeAttributes
{
  id!: string;
  userId?: string;
  user!: User;
  monthId?: string;
  month!: Month;
  recurringIncomeId?: string | null;
  recurringIncome?: RecurringIncome;
  grossIncome!: number;
  incomeType!: IncomeType;
  taxationMode!: TaxationModeType;
  taxationProfile?: string | null;
  taxationParameters?: Record<string, unknown> | null;
  notes?: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?: MonthlyIncomeCreationAttributes, options?: BuildOptions) {
    super(data, options);
    this.userId = data?.userId ?? data?.user?.id;
    this.monthId = data?.monthId ?? data?.month?.id;
    this.recurringIncomeId =
      data?.recurringIncomeId ?? data?.recurringIncome?.id;
  }

  toDomain(): MonthlyIncome {
    const { userId, monthId, recurringIncomeId, ...rest } = this.get();
    return new MonthlyIncomeEntity({
      ...rest,
      user: new UserEntity({ id: userId }),
      month: new MonthEntity({ id: monthId }),
      recurringIncome: recurringIncomeId
        ? new RecurringIncomeEntity({ id: recurringIncomeId })
        : undefined,
    });
  }

  validateGrossIncome() {
    this.toDomain().validateGrossIncome();
  }

  validateNotes() {
    this.toDomain().validateNotes();
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
    user: {
      type: DataTypes.VIRTUAL,
      get() {
        return new UserEntity({ id: this.getDataValue("userId") });
      },
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
    recurringIncomeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    recurringIncome: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("recurringIncomeId");
        return id ? new RecurringIncomeEntity({ id }) : undefined;
      },
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
    validateGrossIncome: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.validateGrossIncome;
      },
    },
    validateNotes: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.validateNotes;
      },
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
