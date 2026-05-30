import { CategoryRepository } from "../../../repositories/category.repository"
import { SubcategoryRepository } from "../../../repositories/subcategory.repository"
import { ForbiddenError } from "../../../utils/errors"

export class GetSubcategoryByIdUseCase {
  constructor(
    private readonly subcategoryRepository: Pick<SubcategoryRepository, "findById"> = new SubcategoryRepository(),
    private readonly categoryRepository: Pick<CategoryRepository, "findById"> = new CategoryRepository(),
  ) {}

  async execute(id: string, requestingUserId: string) {
    const subcategory = await this.subcategoryRepository.findById(id)
    if (!subcategory) {
      throw new Error("Subcategory not found")
    }

    const category = await this.categoryRepository.findById(
      subcategory.getDataValue("category_id") as string,
    )
    if (!category || category.getDataValue("user_id") !== requestingUserId) {
      throw new ForbiddenError()
    }

    return subcategory
  }
}