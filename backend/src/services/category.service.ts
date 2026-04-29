import { CategoryRepository } from "../repositories/category.repository"
import { FamilyRepository } from "../repositories/family.repository"
import { UserRepository } from "../repositories/user.repository"
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto"

const categoryRepository = new CategoryRepository()
const familyRepository = new FamilyRepository()
const userRepository = new UserRepository()

export class CategoryService {
  async createCategory(data: CreateCategoryDTO) {
    if (!data.name || data.name.length < 2 || data.name.length > 100) {
      throw new Error("Category name must be between 2 and 100 characters")
    }

    if (!data.user_id && !data.family_id) {
      throw new Error("Category must belong to a user or a legacy family context")
    }

    if (data.user_id) {
      const user = await userRepository.findById(data.user_id)
      if (!user) {
        throw new Error("User not found")
      }
    }

    if (data.family_id) {
      const family = await familyRepository.findById(data.family_id)
      if (!family) {
        throw new Error("Family not found")
      }
    }

    return categoryRepository.create(data)
  }

  async findCategoryById(id: string) {
    const category = await categoryRepository.findById(id)
    if (!category) {
      throw new Error("Category not found")
    }
    return category
  }

  async listCategoriesByFamily(familyId: string) {
    return categoryRepository.findByFamilyId(familyId)
  }

  async listCategoriesByUser(userId: string) {
    return categoryRepository.findByUserId(userId)
  }

  async updateCategory(id: string, data: UpdateCategoryDTO) {
    if (data.name !== undefined && (data.name.length < 2 || data.name.length > 100)) {
      throw new Error("Category name must be between 2 and 100 characters")
    }

    const category = await categoryRepository.update(id, data)
    if (!category) {
      throw new Error("Category not found")
    }
    return category
  }

  async deleteCategory(id: string) {
    const category = await categoryRepository.delete(id)
    if (!category) {
      throw new Error("Category not found")
    }
    return category
  }
}
