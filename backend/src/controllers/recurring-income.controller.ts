import { Request, Response } from "express"
import { RecurringIncomeService } from "../services/recurring-income.service"

const recurringIncomeService = new RecurringIncomeService()

export const createRecurringIncome = async (req: Request, res: Response) => {
  try {
    const result = await recurringIncomeService.createRecurringIncome(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listRecurringIncomesByUser = async (req: Request, res: Response) => {
  try {
    const result = await recurringIncomeService.listRecurringIncomesByUser(req.params.userId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const listRecurringIncomesByFamily = async (req: Request, res: Response) => {
  try {
    const result = await recurringIncomeService.listRecurringIncomesByFamily(req.params.familyId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getRecurringIncomeById = async (req: Request, res: Response) => {
  try {
    const result = await recurringIncomeService.findRecurringIncomeById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateRecurringIncome = async (req: Request, res: Response) => {
  try {
    const result = await recurringIncomeService.updateRecurringIncome(req.params.id as string, req.body)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const getMonthlyIncomesByRecurringIncome = async (req: Request, res: Response) => {
  try {
    const result = await recurringIncomeService.findMonthlyIncomesByRecurringIncome(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const deleteRecurringIncome = async (req: Request, res: Response) => {
  try {
    await recurringIncomeService.deleteRecurringIncome(req.params.id as string)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}