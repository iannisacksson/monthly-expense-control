import type { IUserRepository } from "../../../domain/repositories/user.repository";
import { UserRepository } from "../../../repositories/user.repository";

export class GetUserByIdUseCase {
  constructor(
    private readonly userRepository: IUserRepository = new UserRepository(),
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
