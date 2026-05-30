import { CategoryRepository } from "../../../repositories/category.repository"
import { ForbiddenError, NotFoundError } from "../../../utils/errors"

export class DeleteCategoryUseCase {
  constructor(
    private readonly categoryRepository: Pick<CategoryRepository, "findById" | "delete"> = new CategoryRepository(),
  ) {}

  async execute(id: string, requestingUserId: string) {
    const existing = await this.categoryRepository.findById(id)
    if (!existing) {
      throw new NotFoundError("Category not found")
    }

    if (existing.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    const category = await this.categoryRepository.delete(id)
    if (!category) {
      throw new NotFoundError("Category not found")
    }

    return category
  }
}