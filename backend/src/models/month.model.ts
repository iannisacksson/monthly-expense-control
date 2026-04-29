import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const Month = sequelize.define("Month", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  budget_rule_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "months",
  underscored: true,
  timestamps: true,
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ["user_id", "year", "month"]
    }
  ]
})
