import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const Subcategory = sequelize.define("Subcategory", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "subcategories",
  underscored: true,
  timestamps: false
})
