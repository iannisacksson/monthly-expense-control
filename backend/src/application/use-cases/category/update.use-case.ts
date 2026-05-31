import type { UpdateCategoryDTO } from "../../../dtos/category.dto"
import { CategoryEntity } from "../../../domain/entities/category.entity"
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors"

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string, data: UpdateCategoryDTO, requestingUserId: string) {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Category not found");
    }

    if (existing.user.id !== requestingUserId) {
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