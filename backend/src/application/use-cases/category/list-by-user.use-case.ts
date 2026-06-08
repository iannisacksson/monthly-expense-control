import { User } from "../../../domain/entities/user.entity";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";

export class ListCategoriesByUserUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(user: User) {
    return this.categoryRepository.findByUser(user);
  }
}
