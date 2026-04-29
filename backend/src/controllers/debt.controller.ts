import { Request, Response } from "express"
import { DebtService } from "../services/debt.service"

const debtService = new DebtService()

export const createDebt = async (req: Request, res: Response) => {
  try {
    const result = await debtService.createDebt(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listDebtsByFamily = async (req: Request, res: Response) => {
  try {
    const result = await debtService.listDebtsByFamily(req.params.familyId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getDebtById = async (req: Request, res: Response) => {
  try {
    const result = await debtService.findDebtById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateDebt = async (req: Request, res: Response) => {
  try {
    const result = await debtService.updateDebt(req.params.id as string, req.body)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteDebt = async (req: Request, res: Response) => {
  try {
    await debtService.deleteDebt(req.params.id as string)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
