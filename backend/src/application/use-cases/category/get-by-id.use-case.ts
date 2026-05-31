import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string, requestingUserId: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    if (category.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    return category;
  }
}
