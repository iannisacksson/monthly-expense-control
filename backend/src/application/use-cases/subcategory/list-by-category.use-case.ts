import type { ICategoryRepository } from "../../../domain/repositories/category.repository";
import type { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { CategoryRepository } from "../../../repositories/category.repository";
import { SubcategoryRepository } from "../../../repositories/subcategory.repository";
import { ForbiddenError } from "../../../utils/errors";

export class ListSubcategoriesByCategoryUseCase {
  constructor(
    private readonly subcategoryRepository: ISubcategoryRepository = new SubcategoryRepository(),
    private readonly categoryRepository: ICategoryRepository = new CategoryRepository(),
  ) {}

  async execute(categoryId: string, requestingUserId: string) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category || category.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    return this.subcategoryRepository.findByCategoryId(categoryId);
  }
}
