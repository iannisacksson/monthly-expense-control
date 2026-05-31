import type { CreateCategoryDTO } from "../../../dtos/category.dto"
import { CategoryEntity } from "../../../domain/entities/category.entity";
import { UserRepository } from "../../../repositories/user.repository"
import { BadRequestError } from "../../../utils/errors"
import { ICategoryRepository } from "../../../domain/repositories/category.repository";

export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly userRepository: Pick<
      UserRepository,
      "findById"
    > = new UserRepository(),
  ) {}

  async execute(data: CreateCategoryDTO) {
    const category = new CategoryEntity({
      user: { id: data.userId } as any, // Usar a entidade UserEntity apõs refatorar a User.
      name: data.name,
      type: data.type as CategoryEntity["type"],
    });
    category.validateName();
    category.ensureUserOwnership();

    const user = await this.userRepository.findById(category.user.id);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    return this.categoryRepository.create(category);
  }
}