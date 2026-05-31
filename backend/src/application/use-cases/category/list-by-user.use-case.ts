import { ICategoryRepository } from "../../../domain/repositories/category.repository";

export class ListCategoriesByUserUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(userId: string) {
    return this.categoryRepository.findByUserId(userId);
  }
}
