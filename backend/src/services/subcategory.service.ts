import { SubcategoryRepository } from "../repositories/subcategory.repository"
import { CategoryRepository } from "../repositories/category.repository"
import { CreateSubcategoryDTO, UpdateSubcategoryDTO } from "../dtos/subcategory.dto"
import { ForbiddenError } from "../utils/errors"
import { SubcategoryEntity } from "../domain/entities/subcategory.entity";

const subcategoryRepository = new SubcategoryRepository()
const categoryRepository = new CategoryRepository()

export class SubcategoryService {
  async createSubcategory(data: CreateSubcategoryDTO, requestingUserId: string) {
    const name = SubcategoryEntity.validateName(data.name);

    const category = await categoryRepository.findById(data.category_id)
    if (!category) {
      throw new Error("Category not found")
    }
    if (category.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    return subcategoryRepository.create({
      ...data,
      name,
    })
  }

  async findSubcategoryById(id: string, requestingUserId: string) {
    const subcategory = await subcategoryRepository.findById(id)
    if (!subcategory) {
      throw new Error("Subcategory not found")
    }
    const category = await categoryRepository.findById(subcategory.getDataValue("category_id") as string)
    if (!category || category.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
    return subcategory
  }

  async listSubcategoriesByCategory(categoryId: string, requestingUserId: string) {
    const category = await categoryRepository.findById(categoryId)
    if (!category || category.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
    return subcategoryRepository.findByCategoryId(categoryId)
  }

  async updateSubcategory(id: string, data: UpdateSubcategoryDTO, requestingUserId: string) {
    const normalizedName =
      data.name !== undefined
        ? SubcategoryEntity.validateName(data.name)
        : undefined;

    const existing = await subcategoryRepository.findById(id)
    if (!existing) throw new Error("Subcategory not found")
    const category = await categoryRepository.findById(existing.getDataValue("category_id") as string)
    if (!category || category.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const subcategory = await subcategoryRepository.update(id, {
      ...data,
      name: normalizedName,
    })
    if (!subcategory) {
      throw new Error("Subcategory not found")
    }
    return subcategory
  }

  async deleteSubcategory(id: string, requestingUserId: string) {
    const existing = await subcategoryRepository.findById(id)
    if (!existing) throw new Error("Subcategory not found")
    const category = await categoryRepository.findById(existing.getDataValue("category_id") as string)
    if (!category || category.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const subcategory = await subcategoryRepository.delete(id)
    if (!subcategory) {
      throw new Error("Subcategory not found")
    }
    return subcategory
  }
}
