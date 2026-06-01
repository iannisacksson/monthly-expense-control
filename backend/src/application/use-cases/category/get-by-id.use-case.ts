import { Category } from "../../../domain/entities/category.entity";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string, userId: string): Promise<Category> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundError("Category not found");
    }

    if (existingCategory.user.id !== userId) {
      throw new ForbiddenError();
    }

    return existingCategory;
  }
}
