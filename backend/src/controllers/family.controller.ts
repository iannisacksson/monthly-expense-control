import { Request, Response } from "express"
import { FamilyService } from "../services/family.service"

const familyService = new FamilyService()

export const createFamily = async (req: Request, res: Response) => {
  try {
    const result = await familyService.createFamily(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listFamilies = async (_req: Request, res: Response) => {
  try {
    const result = await familyService.listFamilies()
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getFamilyById = async (req: Request, res: Response) => {
  try {
    const result = await familyService.findFamilyById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateFamily = async (req: Request, res: Response) => {
  try {
    const result = await familyService.updateFamily(req.params.id as string, req.body)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteFamily = async (req: Request, res: Response) => {
  try {
    await familyService.deleteFamily(req.params.id as string)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
