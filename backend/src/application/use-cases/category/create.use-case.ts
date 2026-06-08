import { Category } from "../../../domain/entities/category.entity";
import { BadRequestError } from "../../../utils/errors";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";

export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(category: Category, user: User): Promise<Category> {
    const userFound = await this.userRepository.findById(user.id);

    if (!userFound) {
      throw new BadRequestError("User not found");
    }

    category.user = userFound;

    return this.categoryRepository.create(category);
  }
}
