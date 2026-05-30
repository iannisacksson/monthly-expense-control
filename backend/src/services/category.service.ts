import { CategoryRepository } from "../repositories/category.repository"
import { UserRepository } from "../repositories/user.repository"
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto"
import { ForbiddenError } from "../utils/errors"
import { CategoryEntity } from "../domain/entities/category.entity";

const categoryRepository = new CategoryRepository()
const userRepository = new UserRepository()

export class CategoryService {
  async createCategory(data: CreateCategoryDTO) {
    CategoryEntity.validateName(data.name);
    CategoryEntity.ensureUserOwnership(data.user_id);
    const userId = data.user_id as string;

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found")
    }

    return categoryRepository.create({
      user_id: userId,
      name: data.name,
      type: data.type,
    });
  }

  async listCategoriesByUser(userId: string) {
    return categoryRepository.findByUserId(userId)
  }

  async findCategoryById(id: string, requestingUserId: string) {
    const category = await categoryRepository.findById(id)
    if (!category) {
      throw new Error("Category not found")
    }
    if (category.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()
    return category
  }

  async updateCategory(id: string, data: UpdateCategoryDTO, requestingUserId: string) {
    if (data.name !== undefined) CategoryEntity.validateName(data.name);

    const existing = await categoryRepository.findById(id)
    if (!existing) throw new Error("Category not found")
    if (existing.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const category = await categoryRepository.update(id, data)
    if (!category) {
      throw new Error("Category not found")
    }
    return category
  }

  async deleteCategory(id: string, requestingUserId: string) {
    const existing = await categoryRepository.findById(id)
    if (!existing) throw new Error("Category not found")
    if (existing.getDataValue("user_id") !== requestingUserId) throw new ForbiddenError()

    const category = await categoryRepository.delete(id)
    if (!category) {
      throw new Error("Category not found")
    }
    return category
  }
}
