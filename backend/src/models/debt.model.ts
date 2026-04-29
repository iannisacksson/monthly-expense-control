import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const Debt = sequelize.define("Debt", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  family_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  creditor_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  debtor_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  expense_id: {
    type: DataTypes.UUID
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "debts",
  underscored: true,
  timestamps: true,
  updatedAt: false
})
