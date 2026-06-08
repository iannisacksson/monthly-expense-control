import type { IUserRepository } from "../../../domain/repositories/user.repository";
import { NotFoundError } from "../../../utils/errors";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    await this.userRepository.delete(user);
  }
}
