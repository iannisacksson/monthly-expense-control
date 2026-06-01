import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  IncomeTax,
  IncomeTaxEntity,
} from "../domain/entities/income-tax.entity";
import {
  MonthlyIncome,
  MonthlyIncomeEntity,
} from "../domain/entities/monthly-income.entity";

type IncomeTaxAttributes = IncomeTax & { monthlyIncomeId?: string };
type IncomeTaxCreationAttributes = Omit<IncomeTaxAttributes, "id">;

export class IncomeTaxModel
  extends Model<IncomeTaxAttributes, IncomeTaxCreationAttributes>
  implements IncomeTaxAttributes
{
  id!: string;
  monthlyIncomeId?: string;
  monthlyIncome!: MonthlyIncome;
  taxType!: string;
  value!: number;
  isAuto!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?: IncomeTaxCreationAttributes, options?: BuildOptions) {
    super(data, options);
    this.monthlyIncomeId = data?.monthlyIncomeId ?? data?.monthlyIncome?.id;
  }

  toDomain(): IncomeTax {
    const { monthlyIncomeId, ...rest } = this.get();
    return new IncomeTaxEntity({
      ...rest,
      monthlyIncome: new MonthlyIncomeEntity({ id: monthlyIncomeId }),
    });
  }
}

IncomeTaxModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    monthlyIncomeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    monthlyIncome: {
      type: DataTypes.VIRTUAL,
      get() {
        return new MonthlyIncomeEntity({
          id: this.getDataValue("monthlyIncomeId"),
        });
      },
    },
    taxType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    isAuto: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "income_taxes",
    underscored: true,
    timestamps: true,
  },
);
