import { CategoryRepository } from "../../../repositories/category.repository"
import { SubcategoryRepository } from "../../../repositories/subcategory.repository"
import { ForbiddenError } from "../../../utils/errors"

export class DeleteSubcategoryUseCase {
  constructor(
    private readonly subcategoryRepository: Pick<SubcategoryRepository, "findById" | "delete"> = new SubcategoryRepository(),
    private readonly categoryRepository: Pick<CategoryRepository, "findById"> = new CategoryRepository(),
  ) {}

  async execute(id: string, requestingUserId: string) {
    const existing = await this.subcategoryRepository.findById(id)
    if (!existing) {
      throw new Error("Subcategory not found")
    }

    const category = await this.categoryRepository.findById(
      existing.getDataValue("category_id") as string,
    )
    if (!category || category.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    const subcategory = await this.subcategoryRepository.delete(id)
    if (!subcategory) {
      throw new Error("Subcategory not found")
    }

    return subcategory
  }
}