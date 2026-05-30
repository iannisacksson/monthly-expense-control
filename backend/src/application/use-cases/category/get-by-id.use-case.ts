import { CategoryRepository } from "../../../repositories/category.repository"
import { ForbiddenError, NotFoundError } from "../../../utils/errors"

export class GetCategoryByIdUseCase {
  constructor(
    private readonly categoryRepository: Pick<CategoryRepository, "findById"> = new CategoryRepository(),
  ) {}

  async execute(id: string, requestingUserId: string) {
    const category = await this.categoryRepository.findById(id)
    if (!category) {
      throw new NotFoundError("Category not found")
    }

    if (category.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    return category
  }
}