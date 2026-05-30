import type { UpdateCategoryDTO } from "../../../dtos/category.dto"
import { CategoryEntity } from "../../../domain/entities/category.entity"
import { CategoryRepository } from "../../../repositories/category.repository"
import { ForbiddenError, NotFoundError } from "../../../utils/errors"

export class UpdateCategoryUseCase {
  constructor(
    private readonly categoryRepository: Pick<CategoryRepository, "findById" | "update"> = new CategoryRepository(),
  ) {}

  async execute(id: string, data: UpdateCategoryDTO, requestingUserId: string) {
    if (data.name !== undefined) {
      CategoryEntity.validateName(data.name)
    }

    const existing = await this.categoryRepository.findById(id)
    if (!existing) {
      throw new NotFoundError("Category not found")
    }

    if (existing.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    const category = await this.categoryRepository.update(id, data)
    if (!category) {
      throw new NotFoundError("Category not found")
    }

    return category
  }
}