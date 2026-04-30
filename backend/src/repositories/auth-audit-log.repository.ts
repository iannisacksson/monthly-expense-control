import { AuthAuditLog } from "../models"

type AuthAuditLogCreateInput = {
  user_id: string | null
  session_id: string | null
  event_type: string
  email: string | null
  ip_address: string | null
  user_agent: string | null
  metadata: Record<string, unknown> | null
}

export class AuthAuditLogRepository {
  async create(data: AuthAuditLogCreateInput) {
    return AuthAuditLog.create(data)
  }
}