import { Request, Response } from "express"
import { RecurringExpenseService } from "../services/recurring-expense.service"

const recurringExpenseService = new RecurringExpenseService()

export const createRecurringExpense = async (req: Request, res: Response) => {
  try {
    const result = await recurringExpenseService.createRecurringExpense(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listRecurringExpensesByUser = async (req: Request, res: Response) => {
  try {
    const result = await recurringExpenseService.listRecurringExpensesByUser(req.params.userId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const listRecurringExpensesByFamily = async (req: Request, res: Response) => {
  try {
    const result = await recurringExpenseService.listRecurringExpensesByFamily(req.params.familyId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getRecurringExpenseById = async (req: Request, res: Response) => {
  try {
    const result = await recurringExpenseService.findRecurringExpenseById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateRecurringExpense = async (req: Request, res: Response) => {
  try {
    const result = await recurringExpenseService.updateRecurringExpense(req.params.id as string, req.body)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const restoreRecurringExpenseOccurrence = async (req: Request, res: Response) => {
  try {
    const result = await recurringExpenseService.restoreRecurringExpenseOccurrence(req.params.id as string, req.body.month_id as string)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const getExpensesByRecurringExpense = async (req: Request, res: Response) => {
  try {
    const result = await recurringExpenseService.findExpensesByRecurringExpense(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const deleteRecurringExpense = async (req: Request, res: Response) => {
  try {
    await recurringExpenseService.deleteRecurringExpense(req.params.id as string, req.body)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}