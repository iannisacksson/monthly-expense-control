import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const MonthlyIncome = sequelize.define("MonthlyIncome", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  month_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  recurring_income_id: {
    type: DataTypes.UUID
  },
  gross_income: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  income_type: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taxation_mode: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "manual"
  },
  taxation_profile: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  taxation_parameters: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: "monthly_incomes",
  underscored: true,
  timestamps: true,
  updatedAt: false
})
