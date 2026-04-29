import { Request, Response } from "express"
import { BudgetService } from "../services/budget.service"
import { ForbiddenError } from "../utils/errors"

const budgetService = new BudgetService()

export const createBudgetRule = async (req: Request, res: Response) => {
  try {
    const result = await budgetService.createBudgetRule(req.body, req.user!.id)
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listBudgetRulesByUser = async (req: Request, res: Response) => {
  try {
    const result = await budgetService.listBudgetRulesByUser(req.user!.id)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getBudgetRuleById = async (req: Request, res: Response) => {
  try {
    const result = await budgetService.findBudgetRuleById(req.params.id as string, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateBudgetRule = async (req: Request, res: Response) => {
  try {
    const result = await budgetService.updateBudgetRule(req.params.id as string, req.body, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const deleteBudgetRule = async (req: Request, res: Response) => {
  try {
    await budgetService.deleteBudgetRule(req.params.id as string, req.user!.id)
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const createAllocation = async (req: Request, res: Response) => {
  try {
    const result = await budgetService.createAllocation(req.body, req.user!.id)
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listAllocationsByRule = async (req: Request, res: Response) => {
  try {
    const result = await budgetService.listAllocationsByRule(req.params.ruleId as string, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}

export const updateAllocation = async (req: Request, res: Response) => {
  try {
    const result = await budgetService.updateAllocation(req.params.id as string, req.body, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const deleteAllocation = async (req: Request, res: Response) => {
  try {
    await budgetService.deleteAllocation(req.params.id as string, req.user!.id)
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}
