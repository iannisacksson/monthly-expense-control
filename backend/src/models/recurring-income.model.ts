import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const RecurringIncome = sequelize.define("RecurringIncome", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  family_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
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
  kind: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  start_month_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  occurrences: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "recurring_incomes",
  underscored: true,
  timestamps: true,
  updatedAt: false
})