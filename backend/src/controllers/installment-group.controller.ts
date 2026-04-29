import { Request, Response } from "express"
import { InstallmentGroupService } from "../services/installment-group.service"
import { ForbiddenError } from "../utils/errors"

const installmentGroupService = new InstallmentGroupService()

export const createInstallmentPurchase = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.createInstallmentPurchase(req.body, req.user!.id)
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listInstallmentGroupsByUser = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.listInstallmentGroupsByUser(req.user!.id)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getInstallmentGroupById = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.findInstallmentGroupById(req.params.id as string, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const getExpensesByInstallmentGroup = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.findExpensesByInstallmentGroup(req.params.id as string, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}

export const updateInstallmentGroup = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.updateInstallmentGroup(req.params.id as string, req.body, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const restoreInstallmentOccurrence = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.restoreInstallmentOccurrence(req.params.id as string, req.body.month_id as string, req.user!.id)
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const deleteInstallmentGroup = async (req: Request, res: Response) => {
  try {
    await installmentGroupService.deleteInstallmentGroup(req.params.id as string, req.body, req.user!.id)
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}
