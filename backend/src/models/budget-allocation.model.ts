import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const BudgetAllocation = sequelize.define("BudgetAllocation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  budget_rule_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  percentage: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  tableName: "budget_allocations",
  underscored: true,
  timestamps: false
})
