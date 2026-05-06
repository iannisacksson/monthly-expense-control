import type { CorsOptions } from "cors"
import type { HelmetOptions } from "helmet"
import { ForbiddenError } from "../utils/errors"

function parseAllowedOrigins(): string[] {
  const explicitOrigins = process.env.CORS_ALLOWED_ORIGINS
  const frontendOrigin = process.env.FRONTEND_ORIGIN
  const joinedOrigins = explicitOrigins ?? frontendOrigin ?? ""

  return joinedOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === "production"
}

export function getTrustProxySetting(): boolean | number {
  const trustProxy = process.env.TRUST_PROXY
  if (!trustProxy) return isProductionEnvironment() ? 1 : false
  if (trustProxy === "true") return true
  if (trustProxy === "false") return false

  const numericValue = Number.parseInt(trustProxy, 10)
  return Number.isNaN(numericValue) ? true : numericValue
}

export function buildCorsOptions(): CorsOptions {
  const allowedOrigins = parseAllowedOrigins()

  return {
    credentials: true,
    origin(origin, callback) {
      if (!origin) {
        callback(null, true)
        return
      }

      if (!isProductionEnvironment()) {
        callback(null, true)
        return
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new ForbiddenError("Origin not allowed by CORS"))
    },
  }
}

export function buildHelmetOptions(): HelmetOptions {
  return {
    crossOriginResourcePolicy: false,
  }
}