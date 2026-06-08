import type { CreateSubcategoryDTO } from "../../../dtos/subcategory.dto";
import { CategoryEntity } from "../../../domain/entities/category.entity";
import type { ICategoryRepository } from "../../../domain/repositories/category.repository";
import type { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { ForbiddenError } from "../../../utils/errors";

export class CreateSubcategoryUseCase {
  constructor(
    private readonly subcategoryRepository: ISubcategoryRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(data: CreateSubcategoryDTO, requestingUserId: string) {
    const category = await this.categoryRepository.findById(data.category_id);
    if (!category) {
      throw new Error("Category not found");
    }

    if (category.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    return this.subcategoryRepository.create({
      category: new CategoryEntity({ id: data.category_id }),
      name: data.name,
    });
  }
}
