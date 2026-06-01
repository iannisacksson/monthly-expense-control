import {
  Category,
  CategoryEntity,
  CategoryType,
} from "../../../domain/entities/category.entity";
import { BadRequestError } from "../../../utils/errors";
import { ICategoryRepository } from "../../../domain/repositories/category.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { UserEntity } from "../../../domain/entities/user.entity";

export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: {
    userId: string;
    name: string;
    type: CategoryType;
  }): Promise<Category> {
    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const category = new CategoryEntity({
      name: data.name,
      type: data.type,
      user: new UserEntity({ id: data.userId }),
    });

    return this.categoryRepository.create(category);
  }
}
