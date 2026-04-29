import { Request, Response } from "express"
import { MonthlyIncomeService } from "../services/monthly-income.service"

const monthlyIncomeService = new MonthlyIncomeService()

export const registerIncome = async (req: Request, res: Response) => {
  try {
    const result = await monthlyIncomeService.registerIncome(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listIncomesByMonth = async (req: Request, res: Response) => {
  try {
    const result = await monthlyIncomeService.listIncomesByMonth(req.params.monthId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getIncomeById = async (req: Request, res: Response) => {
  try {
    const result = await monthlyIncomeService.findIncomeById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateIncome = async (req: Request, res: Response) => {
  try {
    const result = await monthlyIncomeService.updateIncome(req.params.id as string, req.body)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    await monthlyIncomeService.deleteIncome(req.params.id as string)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
