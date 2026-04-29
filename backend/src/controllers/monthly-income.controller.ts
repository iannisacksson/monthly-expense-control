import { Request, Response } from "express"
import { MonthlyIncomeService } from "../services/monthly-income.service"
import { ForbiddenError } from "../utils/errors"

const monthlyIncomeService = new MonthlyIncomeService()

export const registerIncome = async (req: Request, res: Response) => {
  try {
    const result = await monthlyIncomeService.registerIncome(req.body, req.user!.id)
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listIncomesByMonth = async (req: Request, res: Response) => {
  try {
    const result = await monthlyIncomeService.listIncomesByMonth(req.params.monthId as string, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}

export const getIncomeById = async (req: Request, res: Response) => {
  try {
    const result = await monthlyIncomeService.findIncomeById(req.params.id as string, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateIncome = async (req: Request, res: Response) => {
  try {
    const result = await monthlyIncomeService.updateIncome(req.params.id as string, req.body, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    await monthlyIncomeService.deleteIncome(req.params.id as string, req.user!.id)
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}
