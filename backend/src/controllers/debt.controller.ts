import { Request, Response } from "express"
import { DebtService } from "../services/debt.service"

const debtService = new DebtService()

export const listDebtsByFamily = async (req: Request, res: Response) => {
  try {
    const result = await debtService.listDebtsByFamily(req.params.familyId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
