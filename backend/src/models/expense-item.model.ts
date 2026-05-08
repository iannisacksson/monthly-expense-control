import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const ExpenseItem = sequelize.define("ExpenseItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  expense_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
}, {
  tableName: "expense_items",
  underscored: true,
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ["expense_id"] },
  ],
})