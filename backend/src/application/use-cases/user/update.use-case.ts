import type { UpdateUserDTO } from "../../../dtos/user.dto";
import type { User } from "../../../domain/entities/user.entity";
import type { IUserRepository } from "../../../domain/repositories/user.repository";
import { UserRepository } from "../../../repositories/user.repository";
import { NotFoundError } from "../../../utils/errors";

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository = new UserRepository(),
  ) {}

  async execute(id: string, data: UpdateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    if (data.name !== undefined && data.name !== existingUser.name) {
      existingUser.validateName(data.name);
    }

    if (data.email !== undefined) {
      existingUser.validateEmail(data.email);
    }

    if (data.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new Error("Email already in use");
      }
    }

    if (data.password_hash) {
      throw new Error("Use updateUserPassword to change the password");
    }

    const updatedUser = await this.userRepository.update(id, {
      name: data.name,
      email: data.email,
    });
    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }
}
