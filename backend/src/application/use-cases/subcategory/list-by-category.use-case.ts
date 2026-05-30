import { CategoryRepository } from "../../../repositories/category.repository"
import { SubcategoryRepository } from "../../../repositories/subcategory.repository"
import { ForbiddenError } from "../../../utils/errors"

export class ListSubcategoriesByCategoryUseCase {
  constructor(
    private readonly subcategoryRepository: Pick<SubcategoryRepository, "findByCategoryId"> = new SubcategoryRepository(),
    private readonly categoryRepository: Pick<CategoryRepository, "findById"> = new CategoryRepository(),
  ) {}

  async execute(categoryId: string, requestingUserId: string) {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category || category.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    return this.subcategoryRepository.findByCategoryId(categoryId)
  }
}