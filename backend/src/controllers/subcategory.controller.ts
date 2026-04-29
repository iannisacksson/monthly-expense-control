import { Request, Response } from "express"
import { SubcategoryService } from "../services/subcategory.service"

const subcategoryService = new SubcategoryService()

export const createSubcategory = async (req: Request, res: Response) => {
  try {
    const result = await subcategoryService.createSubcategory(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listSubcategoriesByCategory = async (req: Request, res: Response) => {
  try {
    const result = await subcategoryService.listSubcategoriesByCategory(req.params.categoryId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getSubcategoryById = async (req: Request, res: Response) => {
  try {
    const result = await subcategoryService.findSubcategoryById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateSubcategory = async (req: Request, res: Response) => {
  try {
    const result = await subcategoryService.updateSubcategory(req.params.id as string, req.body)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteSubcategory = async (req: Request, res: Response) => {
  try {
    await subcategoryService.deleteSubcategory(req.params.id as string)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
