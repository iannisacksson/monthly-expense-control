import { Request, Response } from "express"
import {
  CreateSubcategoryUseCase,
  DeleteSubcategoryUseCase,
  GetSubcategoryByIdUseCase,
  ListSubcategoriesUseCase,
  UpdateSubcategoryUseCase,
} from "../application/use-cases/subcategory.use-cases";
import { ForbiddenError } from "../utils/errors"

const createSubcategoryUseCase = new CreateSubcategoryUseCase();
const listSubcategoriesUseCase = new ListSubcategoriesUseCase();
const getSubcategoryByIdUseCase = new GetSubcategoryByIdUseCase();
const updateSubcategoryUseCase = new UpdateSubcategoryUseCase();
const deleteSubcategoryUseCase = new DeleteSubcategoryUseCase();

export const createSubcategory = async (req: Request, res: Response) => {
  try {
    const result = await createSubcategoryUseCase.execute(
      req.body,
      req.user!.id,
    );
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listSubcategoriesByCategory = async (req: Request, res: Response) => {
  try {
    const result = await listSubcategoriesUseCase.execute(
      req.params.categoryId as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}

export const getSubcategoryById = async (req: Request, res: Response) => {
  try {
    const result = await getSubcategoryByIdUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateSubcategory = async (req: Request, res: Response) => {
  try {
    const result = await updateSubcategoryUseCase.execute(
      req.params.id as string,
      req.body,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const deleteSubcategory = async (req: Request, res: Response) => {
  try {
    await deleteSubcategoryUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}
