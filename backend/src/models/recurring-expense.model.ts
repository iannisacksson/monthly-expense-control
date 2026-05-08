import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const RecurringExpense = sequelize.define("RecurringExpense", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  expense_kind: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "standard"
  },
  planned_amount: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  subcategory_id: {
    type: DataTypes.UUID
  },
  paid_by: {
    type: DataTypes.UUID
  },
  responsible_user_id: {
    type: DataTypes.UUID
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
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "recurring_expenses",
  underscored: true,
  timestamps: true,
  updatedAt: false
})