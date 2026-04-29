import { Request, Response } from "express"
import { InstallmentGroupService } from "../services/installment-group.service"

const installmentGroupService = new InstallmentGroupService()

export const createInstallmentPurchase = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.createInstallmentPurchase(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listInstallmentGroupsByUser = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.listInstallmentGroupsByUser(req.params.userId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const listInstallmentGroupsByFamily = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.listInstallmentGroupsByFamily(req.params.familyId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getInstallmentGroupById = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.findInstallmentGroupById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const getExpensesByInstallmentGroup = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.findExpensesByInstallmentGroup(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const updateInstallmentGroup = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.updateInstallmentGroup(req.params.id as string, req.body)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const restoreInstallmentOccurrence = async (req: Request, res: Response) => {
  try {
    const result = await installmentGroupService.restoreInstallmentOccurrence(req.params.id as string, req.body.month_id as string)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteInstallmentGroup = async (req: Request, res: Response) => {
  try {
    await installmentGroupService.deleteInstallmentGroup(req.params.id as string, req.body)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}
