import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const InstallmentGroup = sequelize.define("InstallmentGroup", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  total_value: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  installments: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  starting_installment_number: {
    type: DataTypes.INTEGER
  },
  category_id: {
    type: DataTypes.UUID
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
    type: DataTypes.UUID
  }
}, {
  tableName: "installment_groups",
  underscored: true,
  timestamps: true,
  updatedAt: false
})
