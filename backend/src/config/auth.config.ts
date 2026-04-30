import type { CookieOptions } from "express"

const ACCESS_TOKEN_TTL_MINUTES_DEFAULT = 15
const REFRESH_TOKEN_TTL_DAYS_DEFAULT = 30

function parsePositiveInteger(rawValue: string | undefined, fallbackValue: number): number {
  if (!rawValue) return fallbackValue

  const parsedValue = Number.parseInt(rawValue, 10)
  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return fallbackValue
  }

  return parsedValue
}

export type AccessTokenPayload = {
  id: string
  email: string
  sessionId: string
}

export const ACCESS_TOKEN_COOKIE_NAME = process.env.ACCESS_TOKEN_COOKIE_NAME ?? "fc_access_token"
export const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME ?? "fc_refresh_token"

export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === "production"
}

export function getAccessTokenSecret(): string {
  const secret = process.env.ACCESS_TOKEN_SECRET ?? process.env.JWT_SECRET
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured")
  }

  return secret
}

export function getAccessTokenTtlMinutes(): number {
  return parsePositiveInteger(process.env.ACCESS_TOKEN_TTL_MINUTES, ACCESS_TOKEN_TTL_MINUTES_DEFAULT)
}

export function getRefreshTokenTtlDays(): number {
  return parsePositiveInteger(process.env.REFRESH_TOKEN_TTL_DAYS, REFRESH_TOKEN_TTL_DAYS_DEFAULT)
}

function getCookieDomain(): string | undefined {
  return process.env.COOKIE_DOMAIN || undefined
}

function buildCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    httpOnly: true,
    secure: isProductionEnvironment(),
    sameSite: "lax",
    domain: getCookieDomain(),
    path: "/",
    maxAge: maxAgeMs,
  }
}

export function getAccessTokenCookieOptions(): CookieOptions {
  return buildCookieOptions(getAccessTokenTtlMinutes() * 60 * 1000)
}

export function getRefreshTokenCookieOptions(): CookieOptions {
  return buildCookieOptions(getRefreshTokenTtlDays() * 24 * 60 * 60 * 1000)
}