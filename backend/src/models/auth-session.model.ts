import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const AuthSession = sequelize.define("AuthSession", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  refresh_token_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  refresh_expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  revoked_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  last_seen_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "auth_sessions",
  underscored: true,
  timestamps: true,
})