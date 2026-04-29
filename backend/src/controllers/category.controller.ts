import { Request, Response } from "express"
import { CategoryService } from "../services/category.service"

const categoryService = new CategoryService()

export const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.createCategory(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listCategoriesByUser = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.listCategoriesByUser(req.params.userId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.findCategoryById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.updateCategory(req.params.id as string, req.body)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryService.deleteCategory(req.params.id as string)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
