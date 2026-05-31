import { UserRepository } from "../../../repositories/user.repository"

export class GetUserByIdUseCase {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}