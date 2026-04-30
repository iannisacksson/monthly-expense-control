import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const AuthAuditLog = sequelize.define("AuthAuditLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  session_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  event_type: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
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
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: "auth_audit_logs",
  underscored: true,
  timestamps: true,
  updatedAt: false,
})