import type { CreateUserDTO } from "../../../dtos/user.dto";
import { UserEntity } from "../../../domain/entities/user.entity";
import type { IUserRepository } from "../../../domain/repositories/user.repository";

const _validator = new UserEntity({});

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO) {
    _validator.validateName(data.name);
    _validator.validateEmail(data.email);

    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("Email already in use");
    }

    return this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash: data.password_hash,
    });
  }
}
