import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  RecurringIncome,
  RecurringIncomeEntity,
  RecurringIncomeKind,
  RecurringIncomeStatus,
} from "../domain/entities/recurring-income.entity";
import {
  IncomeType,
  TaxationModeType,
} from "../domain/entities/monthly-income.entity";
import { Month, MonthEntity } from "../domain/entities/month.entity";
import { User, UserEntity } from "../domain/entities/user.entity";

type RecurringIncomeAttributes = RecurringIncome & {
  userId?: string;
  startMonthId?: string;
};
type RecurringIncomeCreationAttributes = Omit<
  RecurringIncomeAttributes,
  "id" | "validateBaseFields"
>;

export class RecurringIncomeModel
  extends Model<RecurringIncomeAttributes, RecurringIncomeCreationAttributes>
  implements RecurringIncomeAttributes
{
  id!: string;
  userId?: string;
  user!: User;
  description!: string;
  grossIncome!: number;
  incomeType!: IncomeType;
  kind!: RecurringIncomeKind;
  startMonthId?: string;
  startMonth!: Month;
  occurrences?: number;
  status!: RecurringIncomeStatus;
  taxationMode!: TaxationModeType;
  taxationProfile?: string;
  taxationParameters?: Record<string, unknown>;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    data?: RecurringIncomeCreationAttributes,
    options?: BuildOptions,
  ) {
    super(data, options);
    this.userId = data?.userId ?? data?.user?.id;
    this.startMonthId = data?.startMonthId ?? data?.startMonth?.id;
  }

  toDomain(): RecurringIncome {
    const { userId, startMonthId, ...rest } = this.get();
    return new RecurringIncomeEntity({
      ...rest,
      user: new UserEntity({ id: userId }),
      startMonth: new MonthEntity({ id: startMonthId }),
    });
  }

  validateBaseFields() {
    this.toDomain().validateBaseFields();
  }
}

RecurringIncomeModel.init(
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
    grossIncome: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    incomeType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    kind: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: "recurring_incomes",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  },
);
