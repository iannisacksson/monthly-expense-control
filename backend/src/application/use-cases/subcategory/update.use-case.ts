import type { ICategoryRepository } from "../../../domain/repositories/category.repository";
import type { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { Subcategory } from "../../../domain/entities/subcategory.entity";
import { User } from "../../../domain/entities/user.entity";

export class UpdateSubcategoryUseCase {
  constructor(
    private readonly subcategoryRepository: ISubcategoryRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(subcategory: Subcategory, requestingUser: User) {
    const existing = await this.subcategoryRepository.findById(subcategory.id);
    if (!existing) {
      throw new NotFoundError("Subcategory not found");
    }

    const category = await this.categoryRepository.findById(
      existing.category.id,
    );
    if (!category || category.user.id !== requestingUser.id) {
      throw new ForbiddenError();
    }

    const updatedSubcategory =
      await this.subcategoryRepository.update(subcategory);

    if (!updatedSubcategory) {
      throw new NotFoundError("Subcategory not found");
    }

    return updatedSubcategory;
  }
}
