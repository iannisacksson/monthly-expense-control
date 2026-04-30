import { Request, Response, NextFunction } from "express"
import { AuthService } from "../services/auth.service"
import { ACCESS_TOKEN_COOKIE_NAME } from "../config/auth.config"
import { extractRequestContext } from "../utils/request-context"

const authService = new AuthService()

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const accessToken = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME]

  if (!accessToken) {
    res.status(401).json({ error: "Missing authentication cookie" })
    return
  }

  try {
    const payload = await authService.authenticateAccessToken(accessToken, extractRequestContext(req))
    req.user = { id: payload.id, email: payload.email, sessionId: payload.sessionId }
    next()
  } catch (error) {
    res.status(401).json({ error: error instanceof Error ? error.message : "Invalid or expired token" })
  }
}
