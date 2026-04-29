import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  month_id: {
    type: DataTypes.UUID,
    allowNull: false
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
  installment_group_id: {
    type: DataTypes.UUID
  },
  recurring_expense_id: {
    type: DataTypes.UUID
  },
  is_paid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  expense_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: "expenses",
  underscored: true,
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ["month_id"] },
    { fields: ["category_id"] }
  ]
})
