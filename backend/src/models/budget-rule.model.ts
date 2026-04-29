import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const BudgetRule = sequelize.define("BudgetRule", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "budget_rules",
  underscored: true,
  timestamps: false
})
