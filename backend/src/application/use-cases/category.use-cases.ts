import type { CreateCategoryDTO, UpdateCategoryDTO } from "../../dtos/category.dto"
import { CategoryService } from "../../services/category.service"

const categoryService = new CategoryService()

export class CreateCategoryUseCase { execute(data: CreateCategoryDTO) { return categoryService.createCategory(data) } }
export class ListCategoriesUseCase { execute(userId: string) { return categoryService.listCategoriesByUser(userId) } }
export class GetCategoryByIdUseCase { execute(id: string, userId: string) { return categoryService.findCategoryById(id, userId) } }
export class UpdateCategoryUseCase { execute(id: string, data: UpdateCategoryDTO, userId: string) { return categoryService.updateCategory(id, data, userId) } }
export class DeleteCategoryUseCase { execute(id: string, userId: string) { return categoryService.deleteCategory(id, userId) } }