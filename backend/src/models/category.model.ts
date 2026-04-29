import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const Category = sequelize.define("Category", {
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
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "categories",
  underscored: true,
  timestamps: false
})
