import type { CreateCategoryDTO } from "../../../dtos/category.dto"
import { CategoryEntity } from "../../../domain/entities/category.entity"
import { CategoryRepository } from "../../../repositories/category.repository"
import { UserRepository } from "../../../repositories/user.repository"
import { BadRequestError } from "../../../utils/errors"

export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: Pick<CategoryRepository, "create"> = new CategoryRepository(),
    private readonly userRepository: Pick<UserRepository, "findById"> = new UserRepository(),
  ) {}

  async execute(data: CreateCategoryDTO) {
    CategoryEntity.validateName(data.name)
    CategoryEntity.ensureUserOwnership(data.user_id)
    const userId = data.user_id
    if (!userId) {
      throw new BadRequestError("Category must belong to a user")
    }

    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new BadRequestError("User not found")
    }

    return this.categoryRepository.create({
      user_id: userId,
      name: data.name,
      type: data.type,
    })
  }
}