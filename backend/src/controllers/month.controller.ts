import { Request, Response } from "express"
import { MonthService } from "../services/month.service"
import { ForbiddenError } from "../utils/errors"

const monthService = new MonthService()

export const createMonth = async (req: Request, res: Response) => {
  try {
    const { user_id: _ignored, ...rest } = req.body
    const result = await monthService.createMonth({ ...rest, user_id: req.user!.id })
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listMonthsByUser = async (req: Request, res: Response) => {
  try {
    const result = await monthService.listMonthsByUser(req.user!.id)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getMonthById = async (req: Request, res: Response) => {
  try {
    const result = await monthService.findMonthById(req.params.id as string, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateMonth = async (req: Request, res: Response) => {
  try {
    const result = await monthService.updateMonth(req.params.id as string, req.body, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const deleteMonth = async (req: Request, res: Response) => {
  try {
    await monthService.deleteMonth(req.params.id as string, req.user!.id)
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(error.message === "Month deletion is not allowed" ? 405 : 404).json({ error: error.message })
  }
}

export const finalizeMonth = async (req: Request, res: Response) => {
  try {
    const result = await monthService.finalizeMonth(req.params.id as string, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}
