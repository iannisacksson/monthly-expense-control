import type { ICategoryRepository } from "../../../domain/repositories/category.repository";
import type { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { CategoryRepository } from "../../../repositories/category.repository";
import { SubcategoryRepository } from "../../../repositories/subcategory.repository";
import { ForbiddenError } from "../../../utils/errors";

export class GetSubcategoryByIdUseCase {
  constructor(
    private readonly subcategoryRepository: ISubcategoryRepository = new SubcategoryRepository(),
    private readonly categoryRepository: ICategoryRepository = new CategoryRepository(),
  ) {}

  async execute(id: string, requestingUserId: string) {
    const subcategory = await this.subcategoryRepository.findById(id);
    if (!subcategory) {
      throw new Error("Subcategory not found");
    }

    const category = await this.categoryRepository.findById(
      subcategory.category.id,
    );
    if (!category || category.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    return subcategory;
  }
}
