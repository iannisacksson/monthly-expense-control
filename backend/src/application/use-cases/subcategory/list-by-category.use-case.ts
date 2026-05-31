import { CategoryRepository } from "../../../repositories/category.repository"
import { SubcategoryRepository } from "../../../repositories/subcategory.repository"
import { ForbiddenError } from "../../../utils/errors"

export class ListSubcategoriesByCategoryUseCase {
  constructor(
    private readonly subcategoryRepository: SubcategoryRepository = new SubcategoryRepository(),
    private readonly categoryRepository: CategoryRepository = new CategoryRepository(),
  ) {}

  async execute(categoryId: string, requestingUserId: string) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category || category.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    return this.subcategoryRepository.findByCategoryId(categoryId);
  }
}