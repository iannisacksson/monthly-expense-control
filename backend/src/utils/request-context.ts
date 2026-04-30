import type { Request } from "express"

export type AuthRequestContext = {
  ipAddress: string | null
  userAgent: string | null
}

function extractClientIp(req: Request): string | null {
  const forwardedFor = req.headers["x-forwarded-for"]
  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0]?.trim() ?? null
  }

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0] ?? null
  }

  return req.ip ?? null
}

export function extractRequestContext(req: Request): AuthRequestContext {
  return {
    ipAddress: extractClientIp(req),
    userAgent: req.headers["user-agent"] ?? null,
  }
}