import type { CreateSubcategoryDTO, UpdateSubcategoryDTO } from "../../dtos/subcategory.dto"
import { SubcategoryService } from "../../services/subcategory.service"

const subcategoryService = new SubcategoryService()

export class CreateSubcategoryUseCase { execute(data: CreateSubcategoryDTO, userId: string) { return subcategoryService.createSubcategory(data, userId) } }
export class ListSubcategoriesUseCase { execute(categoryId: string, userId: string) { return subcategoryService.listSubcategoriesByCategory(categoryId, userId) } }
export class GetSubcategoryByIdUseCase { execute(id: string, userId: string) { return subcategoryService.findSubcategoryById(id, userId) } }
export class UpdateSubcategoryUseCase { execute(id: string, data: UpdateSubcategoryDTO, userId: string) { return subcategoryService.updateSubcategory(id, data, userId) } }
export class DeleteSubcategoryUseCase { execute(id: string, userId: string) { return subcategoryService.deleteSubcategory(id, userId) } }