import { Request, Response } from "express"
import { AuthService } from "../services/auth.service"

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
    const result = await authService.login({ email, password })
    return res.json(result)
  } catch (error: any) {
    return res.status(401).json({ error: error.message })
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
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
