import { CategoryRepository } from "../../../repositories/category.repository"

export class ListCategoriesByUserUseCase {
  constructor(
    private readonly categoryRepository: Pick<CategoryRepository, "findByUserId"> = new CategoryRepository(),
  ) {}

  async execute(userId: string) {
    return this.categoryRepository.findByUserId(userId)
  }
}