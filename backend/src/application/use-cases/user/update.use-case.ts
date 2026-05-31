import type { UpdateUserDTO } from "../../../dtos/user.dto"
import { UserEntity } from "../../../domain/entities/user.entity"
import { UserRepository } from "../../../repositories/user.repository"

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  async execute(id: string, data: UpdateUserDTO) {
    if (data.name !== undefined) {
      UserEntity.validateName(data.name);
    }

    if (data.email !== undefined) {
      UserEntity.validateEmail(data.email);
    }

    if (data.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing && existing.getDataValue("id") !== id) {
        throw new Error("Email already in use");
      }
    }

    if (data.password_hash) {
      throw new Error("Use updateUserPassword to change the password");
    }

    const user = await this.userRepository.update(id, data);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}