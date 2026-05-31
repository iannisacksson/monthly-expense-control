import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string, requestingUserId: string): Promise<void> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Category not found");
    }

    if (existing.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    await this.categoryRepository.delete(existing);
  }
}
