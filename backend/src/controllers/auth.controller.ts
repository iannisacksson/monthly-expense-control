import { Request, Response } from "express"
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "../config/auth.config"
import { AuthService } from "../services/auth.service"
import { clearAuthCookies, setAuthCookies } from "../utils/auth-cookies"
import { extractRequestContext } from "../utils/request-context"

const authService = new AuthService()

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const user = await authService.register({ name, email, password })
    return res.status(201).json(user)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await authService.login({ email, password }, extractRequestContext(req))
    setAuthCookies(res, result.accessToken, result.refreshToken)
    return res.json({ user: result.user })
  } catch (error: any) {
    return res.status(401).json({ error: error.message })
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME]
    if (!refreshToken) {
      return res.status(401).json({ error: "Missing refresh cookie" })
    }

    const result = await authService.refresh(refreshToken, extractRequestContext(req))
    setAuthCookies(res, result.accessToken, result.refreshToken)
    return res.json({ user: result.user })
  } catch (error: any) {
    clearAuthCookies(res)
    return res.status(401).json({ error: error.message })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] ?? null
    const accessToken = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME] ?? null
    const sessionId = accessToken ? authService.readAccessTokenSessionId(accessToken) : null
    await authService.logout(refreshToken, sessionId, extractRequestContext(req))
    clearAuthCookies(res)
    return res.json({ success: true })
  } catch (error: any) {
    clearAuthCookies(res)
    return res.status(400).json({ error: error.message })
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const user = await authService.getMe(userId)
    return res.json(user)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const { name, email, password } = req.body
    const user = await authService.updateMe(userId, { name, email, password })
    return res.json(user)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    await authService.deleteMe(userId)
    clearAuthCookies(res)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
