import { Request, Response } from "express"
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryByIdUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from "../application/use-cases/category.use-cases";
import { ForbiddenError } from "../utils/errors"

const createCategoryUseCase = new CreateCategoryUseCase();
const listCategoriesUseCase = new ListCategoriesUseCase();
const getCategoryByIdUseCase = new GetCategoryByIdUseCase();
const updateCategoryUseCase = new UpdateCategoryUseCase();
const deleteCategoryUseCase = new DeleteCategoryUseCase();

export const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await createCategoryUseCase.execute({
      ...req.body,
      user_id: req.user!.id,
    });
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listCategoriesByUser = async (req: Request, res: Response) => {
  try {
    const result = await listCategoriesUseCase.execute(req.user!.id);
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const result = await getCategoryByIdUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const result = await updateCategoryUseCase.execute(
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

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await deleteCategoryUseCase.execute(req.params.id as string, req.user!.id);
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}
