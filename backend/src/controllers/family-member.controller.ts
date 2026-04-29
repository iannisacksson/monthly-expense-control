import { Request, Response } from "express"
import { FamilyMemberService } from "../services/family-member.service"

const familyMemberService = new FamilyMemberService()

export const addMember = async (req: Request, res: Response) => {
  try {
    const result = await familyMemberService.addMember(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listMembersByFamily = async (req: Request, res: Response) => {
  try {
    const result = await familyMemberService.listMembersByFamily(req.params.familyId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const result = await familyMemberService.findMemberById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const removeMember = async (req: Request, res: Response) => {
  try {
    await familyMemberService.removeMember(req.params.id as string)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
