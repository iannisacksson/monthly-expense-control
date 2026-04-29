import { Request, Response } from "express"
import { ExpenseService } from "../services/expense.service"
import { ForbiddenError } from "../utils/errors"

const expenseService = new ExpenseService()

export const createExpense = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.createExpense({ ...req.body, user_id: req.user!.id })
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listExpensesByUserAndMonth = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.findExpensesByUserAndMonth(
      req.user!.id,
      req.params.monthId as string
    )
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.findExpenseById(req.params.id as string, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.updateExpense(req.params.id as string, req.body, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    await expenseService.deleteExpense(req.params.id as string, req.user!.id)
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const bulkDeleteExpenses = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.bulkDeleteExpenses(req.body, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const bulkMarkExpensesPaid = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.bulkMarkExpensesPaid(req.body, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}
