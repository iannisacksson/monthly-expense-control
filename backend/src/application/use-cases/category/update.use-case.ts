import {
  Category,
  CategoryEntity,
  CategoryType,
} from "../../../domain/entities/category.entity";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(
    id: string,
    data: { name?: string; type?: CategoryType },
    userId: string,
  ): Promise<Category> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Category not found");
    }

    if (existing.user.id !== userId) {
      throw new ForbiddenError();
    }

    const updated = new CategoryEntity({
      ...existing,
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
    });

    if (data.name !== undefined) {
      updated.validateName();
    }

    return this.categoryRepository.update(updated);
  }
}
