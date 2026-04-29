import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const IncomeTax = sequelize.define("IncomeTax", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  monthly_income_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  tax_type: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  is_auto: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: "income_taxes",
  underscored: true,
  timestamps: false
})
