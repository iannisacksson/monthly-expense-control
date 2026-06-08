import type { ICategoryRepository } from "../../../domain/repositories/category.repository";
import type { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { ForbiddenError } from "../../../utils/errors";

export class ListSubcategoriesByCategoryUseCase {
  constructor(
    private readonly subcategoryRepository: ISubcategoryRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(categoryId: string, requestingUserId: string) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category || category.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    return this.subcategoryRepository.findByCategoryId(categoryId);
  }
}
