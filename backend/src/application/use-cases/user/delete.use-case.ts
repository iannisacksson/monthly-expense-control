import { UserRepository } from "../../../repositories/user.repository"

export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  async execute(id: string) {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error("User not found");
    }
  }
}