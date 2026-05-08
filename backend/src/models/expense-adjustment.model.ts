import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const ExpenseAdjustment = sequelize.define("ExpenseAdjustment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  expense_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  changed_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  previous_value: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  new_value: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
}, {
  tableName: "expense_adjustments",
  underscored: true,
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ["expense_id"] },
  ],
})