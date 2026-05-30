import type { CreateSubcategoryDTO } from "../../../dtos/subcategory.dto"
import { SubcategoryEntity } from "../../../domain/entities/subcategory.entity"
import { CategoryRepository } from "../../../repositories/category.repository"
import { SubcategoryRepository } from "../../../repositories/subcategory.repository"
import { ForbiddenError } from "../../../utils/errors"

export class CreateSubcategoryUseCase {
  constructor(
    private readonly subcategoryRepository: Pick<SubcategoryRepository, "create"> = new SubcategoryRepository(),
    private readonly categoryRepository: Pick<CategoryRepository, "findById"> = new CategoryRepository(),
  ) {}

  async execute(data: CreateSubcategoryDTO, requestingUserId: string) {
    const name = SubcategoryEntity.validateName(data.name)

    const category = await this.categoryRepository.findById(data.category_id)
    if (!category) {
      throw new Error("Category not found")
    }

    if (category.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    return this.subcategoryRepository.create({
      ...data,
      name,
    })
  }
}