import { Category } from "../../../domain/entities/category.entity";
import { User } from "../../../domain/entities/user.entity";
import type { ICategoryRepository } from "../../../domain/repositories/category.repository";
import type { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { ForbiddenError } from "../../../utils/errors";

export class ListSubcategoriesByCategoryUseCase {
  constructor(
    private readonly subcategoryRepository: ISubcategoryRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(category: Category, requestingUser: User) {
    const foundCategory = await this.categoryRepository.findById(category.id);
    if (!foundCategory || foundCategory.user.id !== requestingUser.id) {
      throw new ForbiddenError();
    }

    return this.subcategoryRepository.findByCategory(foundCategory);
  }
}
