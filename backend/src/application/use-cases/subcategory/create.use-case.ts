import type { CreateSubcategoryDTO } from "../../../dtos/subcategory.dto";
import { CategoryEntity } from "../../../domain/entities/category.entity";
import type { ICategoryRepository } from "../../../domain/repositories/category.repository";
import type { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { ForbiddenError } from "../../../utils/errors";
import { User } from "../../../domain/entities/user.entity";
import { Subcategory } from "../../../domain/entities/subcategory.entity";

export class CreateSubcategoryUseCase {
  constructor(
    private readonly subcategoryRepository: ISubcategoryRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(subcategory: Subcategory, requestingUser: User) {
    const category = await this.categoryRepository.findById(
      subcategory.category.id,
    );
    if (!category) {
      throw new Error("Category not found");
    }

    if (category.user.id !== requestingUser.id) {
      throw new ForbiddenError();
    }

    return this.subcategoryRepository.create(subcategory);
  }
}
