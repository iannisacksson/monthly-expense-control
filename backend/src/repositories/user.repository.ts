import { UserModel } from "../models/user.model";
import type { User } from "../domain/entities/user.entity";
import type { IUserRepository } from "../domain/repositories/user.repository";

export class UserRepository implements IUserRepository {
  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const model = await UserModel.create(data);
    return model.toDomain();
  }

  async findById(id: string): Promise<User | null> {
    const model = await UserModel.findByPk(id);
    return model ? model.toDomain() : null;
  }

  /** Not part of IUserRepository — kept for auth.service compatibility. */
  async findByIdWithHash(id: string) {
    return UserModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await UserModel.findOne({ where: { email } });
    return model ? model.toDomain() : null;
  }

  async update(
    id: string,
    data: Partial<{ name: string; email: string; passwordHash: string }>,
  ): Promise<User | null> {
    const model = await UserModel.findByPk(id);
    if (!model) return null;
    await model.update(data);
    return model.toDomain();
  }

  async delete(user: User): Promise<void> {
    const model = await UserModel.findByPk(user.id);
    if (!model) return;
    await model.destroy();
  }
}
