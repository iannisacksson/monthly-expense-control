import type { CreateUserDTO } from "../../../dtos/user.dto"
import { UserEntity } from "../../../domain/entities/user.entity"
import { UserRepository } from "../../../repositories/user.repository"

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  async execute(data: CreateUserDTO) {
    UserEntity.validateName(data.name);
    UserEntity.validateEmail(data.email);

    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("Email already in use");
    }

    return this.userRepository.create(data);
  }
}