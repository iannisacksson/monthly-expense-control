import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const Family = sequelize.define("Family", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "families",
  underscored: true,
  timestamps: true
})
