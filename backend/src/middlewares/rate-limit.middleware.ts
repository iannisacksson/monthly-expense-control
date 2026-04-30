import rateLimit from "express-rate-limit"

function parseLimit(rawValue: string | undefined, fallbackValue: number): number {
  if (!rawValue) return fallbackValue

  const parsedValue = Number.parseInt(rawValue, 10)
  return Number.isNaN(parsedValue) || parsedValue <= 0 ? fallbackValue : parsedValue
}

function createAuthRateLimit(options: { windowMs: number; max: number; message: string }) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: options.message },
  })
}

export const loginRateLimit = createAuthRateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseLimit(process.env.AUTH_LOGIN_RATE_LIMIT_MAX, 5),
  message: "Too many login attempts. Try again later.",
})

export const refreshRateLimit = createAuthRateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseLimit(process.env.AUTH_REFRESH_RATE_LIMIT_MAX, 20),
  message: "Too many refresh attempts. Try again later.",
})