import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const FamilyMember = sequelize.define("FamilyMember", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  family_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  role: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "family_members",
  underscored: true,
  timestamps: true,
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ["family_id", "user_id"]
    }
  ]
})
