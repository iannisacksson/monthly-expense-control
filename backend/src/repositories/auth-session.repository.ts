import { Op } from "sequelize"
import { AuthSession } from "../models"

type AuthSessionCreateInput = {
  user_id: string
  refresh_token_hash: string
  refresh_expires_at: Date
  ip_address: string | null
  user_agent: string | null
  last_seen_at: Date
}

type AuthSessionRotateInput = {
  refresh_token_hash: string
  refresh_expires_at: Date
  ip_address: string | null
  user_agent: string | null
  last_seen_at: Date
}

export class AuthSessionRepository {
  async create(data: AuthSessionCreateInput) {
    return AuthSession.create(data)
  }

  async findActiveByRefreshTokenHash(refreshTokenHash: string) {
    return AuthSession.findOne({
      where: {
        refresh_token_hash: refreshTokenHash,
        revoked_at: null,
        refresh_expires_at: { [Op.gt]: new Date() },
      },
    })
  }

  async findActiveById(id: string) {
    return AuthSession.findOne({
      where: {
        id,
        revoked_at: null,
        refresh_expires_at: { [Op.gt]: new Date() },
      },
    })
  }

  async rotate(id: string, data: AuthSessionRotateInput) {
    const session = await AuthSession.findByPk(id)
    if (!session) return null

    await session.update({
      refresh_token_hash: data.refresh_token_hash,
      refresh_expires_at: data.refresh_expires_at,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      last_seen_at: data.last_seen_at,
      revoked_at: null,
    })

    return session
  }

  async revokeById(id: string) {
    const session = await AuthSession.findByPk(id)
    if (!session) return null

    await session.update({ revoked_at: new Date() })
    return session
  }

  async revokeAllByUser(userId: string) {
    await AuthSession.update(
      { revoked_at: new Date() },
      {
        where: {
          user_id: userId,
          revoked_at: null,
        },
      }
    )
  }
}