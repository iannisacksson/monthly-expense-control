import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET is not configured")
  return secret
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" })
    return
  }

  const token = authHeader.slice(7)

  try {
    const payload = jwt.verify(token, getJwtSecret()) as { id: string; email: string }
    req.user = { id: payload.id, email: payload.email }
    next()
  } catch {
    res.status(401).json({ error: "Invalid or expired token" })
  }
}
