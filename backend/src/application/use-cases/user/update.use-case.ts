import type { UpdateUserDTO } from "../../../dtos/user.dto";
import { User, UserEntity } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../repositories/user.repository";
import { NotFoundError } from "../../../utils/errors";

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  async execute(user: User): Promise<User> {
    const existingUser = await this.userRepository.findById(user.id);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    if (
      user.name !== undefined &&
      user.name !== existingUser.getDataValue("name")
    ) {
      user.validateName(user.name);
    }

    if (user.email !== undefined) {
      user.validateEmail(user.email);
    }

    if (user.email) {
      const existing = await this.userRepository.findByEmail(user.email);
      if (existing && existing.getDataValue("id") !== user.id) {
        throw new Error("Email already in use");
      }
    }

    if (user.password_hash) {
      throw new Error("Use updateUserPassword to change the password");
    }

    const updatedUser = await this.userRepository.update(user.id, user);
    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }
}
