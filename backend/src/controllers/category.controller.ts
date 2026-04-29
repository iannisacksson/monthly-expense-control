import { Request, Response } from "express"
import { CategoryService } from "../services/category.service"
import { ForbiddenError } from "../utils/errors"

const categoryService = new CategoryService()

export const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.createCategory({ ...req.body, user_id: req.user!.id })
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listCategoriesByUser = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.listCategoriesByUser(req.user!.id)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.findCategoryById(req.params.id as string, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.updateCategory(req.params.id as string, req.body, req.user!.id)
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryService.deleteCategory(req.params.id as string, req.user!.id)
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}
