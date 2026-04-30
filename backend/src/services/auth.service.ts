import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { UserRepository } from "../repositories/user.repository"
import { AuthAuditLogRepository } from "../repositories/auth-audit-log.repository"
import { AuthSessionRepository } from "../repositories/auth-session.repository"
import { UserService } from "./user.service"
import { RegisterDTO, LoginDTO, UpdateProfileDTO } from "../dtos/auth.dto"
import { getAccessTokenSecret, getAccessTokenTtlMinutes, getRefreshTokenTtlDays, type AccessTokenPayload } from "../config/auth.config"
import type { AuthRequestContext } from "../utils/request-context"

const BCRYPT_ROUNDS = 12

const userRepository = new UserRepository()
const userService = new UserService()
const authSessionRepository = new AuthSessionRepository()
const authAuditLogRepository = new AuthAuditLogRepository()

type PublicUser = {
  id: string
  name: string
  email: string
}

type AuthSessionResult = {
  accessToken: string
  refreshToken: string
  user: PublicUser
}

type AuthAuditEvent =
  | "login_succeeded"
  | "login_failed"
  | "refresh_succeeded"
  | "refresh_failed"
  | "logout_succeeded"
  | "session_invalid"

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}

function buildRefreshToken(): string {
  return crypto.randomBytes(48).toString("base64url")
}

function buildRefreshExpiresAt(): Date {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + getRefreshTokenTtlDays())
  return expiresAt
}

function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, getAccessTokenSecret(), {
    expiresIn: `${getAccessTokenTtlMinutes()}m`,
  } as jwt.SignOptions)
}

function mapUser(user: { getDataValue(key: string): unknown }): PublicUser {
  return {
    id: user.getDataValue("id") as string,
    name: user.getDataValue("name") as string,
    email: user.getDataValue("email") as string,
  }
}

export class AuthService {
  async register(data: RegisterDTO) {
    return userService.createUserWithRawPassword(data.name, data.email, data.password)
  }

  private async logEvent(eventType: AuthAuditEvent, context: AuthRequestContext, details: {
    userId?: string | null
    sessionId?: string | null
    email?: string | null
    metadata?: Record<string, unknown>
  } = {}) {
    try {
      await authAuditLogRepository.create({
        event_type: eventType,
        user_id: details.userId ?? null,
        session_id: details.sessionId ?? null,
        email: details.email ?? null,
        ip_address: context.ipAddress,
        user_agent: context.userAgent,
        metadata: details.metadata ?? null,
      })
    } catch (error) {
      console.error("Failed to persist auth audit log", error)
    }
  }

  async login(data: LoginDTO, context: AuthRequestContext): Promise<AuthSessionResult> {
    if (!data.email || !data.password) {
      throw new Error("Email and password are required")
    }

    const user = await userRepository.findByEmail(data.email)
    if (!user) {
      await this.logEvent("login_failed", context, {
        email: data.email,
        metadata: { reason: "user_not_found" },
      })
      throw new Error("Invalid credentials")
    }

    const passwordHash = user.getDataValue("password_hash") as string
    const passwordMatch = await bcrypt.compare(data.password, passwordHash)
    if (!passwordMatch) {
      await this.logEvent("login_failed", context, {
        userId: user.getDataValue("id") as string,
        email: user.getDataValue("email") as string,
        metadata: { reason: "password_mismatch" },
      })
      throw new Error("Invalid credentials")
    }

    const refreshToken = buildRefreshToken()
    const session = await authSessionRepository.create({
      user_id: user.getDataValue("id") as string,
      refresh_token_hash: hashToken(refreshToken),
      refresh_expires_at: buildRefreshExpiresAt(),
      ip_address: context.ipAddress,
      user_agent: context.userAgent,
      last_seen_at: new Date(),
    })

    const publicUser = mapUser(user)
    const accessToken = signAccessToken({
      id: publicUser.id,
      email: publicUser.email,
      sessionId: session.getDataValue("id") as string,
    })

    await this.logEvent("login_succeeded", context, {
      userId: publicUser.id,
      sessionId: session.getDataValue("id") as string,
      email: publicUser.email,
    })

    return {
      accessToken,
      refreshToken,
      user: publicUser,
    }
  }

  async refresh(refreshToken: string, context: AuthRequestContext): Promise<AuthSessionResult> {
    const session = await authSessionRepository.findActiveByRefreshTokenHash(hashToken(refreshToken))

    if (!session) {
      await this.logEvent("refresh_failed", context, {
        metadata: { reason: "session_not_found" },
      })
      throw new Error("Invalid session")
    }

    const sessionId = session.getDataValue("id") as string
    const refreshExpiresAt = session.getDataValue("refresh_expires_at") as Date
    if (refreshExpiresAt.getTime() <= Date.now()) {
      await authSessionRepository.revokeById(sessionId)
      await this.logEvent("session_invalid", context, {
        userId: session.getDataValue("user_id") as string,
        sessionId,
        metadata: { reason: "refresh_expired" },
      })
      throw new Error("Session expired")
    }

    const user = await userRepository.findByIdWithHash(session.getDataValue("user_id") as string)
    if (!user) {
      await authSessionRepository.revokeById(sessionId)
      await this.logEvent("session_invalid", context, {
        sessionId,
        metadata: { reason: "user_not_found" },
      })
      throw new Error("Invalid session")
    }

    const nextRefreshToken = buildRefreshToken()
    const nextRefreshExpiresAt = buildRefreshExpiresAt()
    await authSessionRepository.rotate(sessionId, {
      refresh_token_hash: hashToken(nextRefreshToken),
      refresh_expires_at: nextRefreshExpiresAt,
      ip_address: context.ipAddress,
      user_agent: context.userAgent,
      last_seen_at: new Date(),
    })

    const publicUser = mapUser(user)
    const accessToken = signAccessToken({
      id: publicUser.id,
      email: publicUser.email,
      sessionId,
    })

    await this.logEvent("refresh_succeeded", context, {
      userId: publicUser.id,
      sessionId,
      email: publicUser.email,
    })

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      user: publicUser,
    }
  }

  async authenticateAccessToken(token: string, context: AuthRequestContext) {
    try {
      const payload = jwt.verify(token, getAccessTokenSecret()) as AccessTokenPayload
      const session = await authSessionRepository.findActiveById(payload.sessionId)

      if (!session) {
        await this.logEvent("session_invalid", context, {
          userId: payload.id,
          sessionId: payload.sessionId,
          email: payload.email,
          metadata: { reason: "session_not_found" },
        })
        throw new Error("Invalid session")
      }

      const refreshExpiresAt = session.getDataValue("refresh_expires_at") as Date
      if (refreshExpiresAt.getTime() <= Date.now()) {
        await authSessionRepository.revokeById(payload.sessionId)
        await this.logEvent("session_invalid", context, {
          userId: payload.id,
          sessionId: payload.sessionId,
          email: payload.email,
          metadata: { reason: "refresh_expired" },
        })
        throw new Error("Session expired")
      }

      return payload
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid session") {
        throw error
      }

      await this.logEvent("session_invalid", context, {
        metadata: { reason: "access_token_invalid" },
      })
      throw new Error("Invalid or expired token")
    }
  }

  readAccessTokenSessionId(token: string): string | null {
    try {
      const payload = jwt.verify(token, getAccessTokenSecret()) as AccessTokenPayload
      return payload.sessionId
    } catch {
      return null
    }
  }

  async logout(refreshToken: string | null, sessionId: string | null, context: AuthRequestContext) {
    let revokedSessionId = sessionId
    let userId: string | null = null

    if (refreshToken) {
      const session = await authSessionRepository.findActiveByRefreshTokenHash(hashToken(refreshToken))
      if (session) {
        revokedSessionId = session.getDataValue("id") as string
        userId = session.getDataValue("user_id") as string
      }
    }

    if (revokedSessionId) {
      await authSessionRepository.revokeById(revokedSessionId)
      await this.logEvent("logout_succeeded", context, {
        userId,
        sessionId: revokedSessionId,
      })
    }
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId)
    if (!user) throw new Error("User not found")
    return user
  }

  async updateMe(userId: string, data: UpdateProfileDTO) {
    if (data.name !== undefined) {
      if (data.name.length < 2 || data.name.length > 100) {
        throw new Error("Name must be between 2 and 100 characters")
      }
    }

    if (data.email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error("A valid email is required")
      }
      const existing = await userRepository.findByEmail(data.email)
      if (existing && existing.getDataValue("id") !== userId) {
        throw new Error("Email already in use")
      }
    }

    const updatePayload: { name?: string; email?: string; password_hash?: string } = {}

    if (data.name !== undefined) updatePayload.name = data.name
    if (data.email !== undefined) updatePayload.email = data.email

    if (data.password !== undefined) {
      userService.validatePasswordStrength(data.password)
      updatePayload.password_hash = await bcrypt.hash(data.password, BCRYPT_ROUNDS)
    }

    const user = await userRepository.update(userId, updatePayload)
    if (!user) throw new Error("User not found")
    return user
  }

  async deleteMe(userId: string) {
    await authSessionRepository.revokeAllByUser(userId)
    const deleted = await userRepository.delete(userId)
    if (!deleted) throw new Error("User not found")
  }
}
