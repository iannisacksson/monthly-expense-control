import type { UpdateSubcategoryDTO } from "../../../dtos/subcategory.dto"
import { SubcategoryEntity } from "../../../domain/entities/subcategory.entity"
import { CategoryRepository } from "../../../repositories/category.repository"
import { SubcategoryRepository } from "../../../repositories/subcategory.repository"
import { ForbiddenError } from "../../../utils/errors"

export class UpdateSubcategoryUseCase {
  constructor(
    private readonly subcategoryRepository: SubcategoryRepository = new SubcategoryRepository(),
    private readonly categoryRepository: CategoryRepository = new CategoryRepository(),
  ) {}

  async execute(
    id: string,
    data: UpdateSubcategoryDTO,
    requestingUserId: string,
  ) {
    const normalizedName =
      data.name !== undefined
        ? SubcategoryEntity.validateName(data.name)
        : undefined;

    const existing = await this.subcategoryRepository.findById(id);
    if (!existing) {
      throw new Error("Subcategory not found");
    }

    const category = await this.categoryRepository.findById(
      existing.getDataValue("category_id") as string,
    );
    if (!category || category.user.id !== requestingUserId) {
      throw new ForbiddenError();
    }

    const subcategory = await this.subcategoryRepository.update(id, {
      ...data,
      name: normalizedName,
    });
    if (!subcategory) {
      throw new Error("Subcategory not found");
    }

    return subcategory;
  }
}