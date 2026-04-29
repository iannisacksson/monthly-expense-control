import { Request, Response } from "express"
import { UserService } from "../services/user.service"

const userService = new UserService()

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await userService.findUserById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.updateUser(req.params.id as string, req.body)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.id as string)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
