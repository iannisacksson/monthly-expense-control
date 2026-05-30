import bcrypt from "bcrypt"
import { UserRepository } from "../repositories/user.repository"
import { CreateUserDTO, UpdateUserDTO } from "../dtos/user.dto"
import { UserEntity } from "../domain/entities/user.entity";

const BCRYPT_ROUNDS = 12

const userRepository = new UserRepository()

export class UserService {
  async createUser(data: CreateUserDTO) {
    UserEntity.validateName(data.name);
    UserEntity.validateEmail(data.email);

    const existing = await userRepository.findByEmail(data.email)
    if (existing) {
      throw new Error("Email already in use")
    }

    return userRepository.create(data)
  }

  async createUserWithRawPassword(name: string, email: string, password: string) {
    const user = UserEntity.create({ name, email });
    UserEntity.validatePasswordStrength(password);

    const existing = await userRepository.findByEmail(email)
    if (existing) {
      throw new Error("Email already in use")
    }

    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    const persistedUser = await userRepository.create({
      name: user.name,
      email: user.email,
      password_hash,
    });

    return {
      id: persistedUser.getDataValue("id"),
      name: persistedUser.getDataValue("name"),
      email: persistedUser.getDataValue("email"),
      createdAt: persistedUser.getDataValue("created_at"),
    };
  }

  validatePasswordStrength(password: string) {
    UserEntity.validatePasswordStrength(password);
  }

  async findUserById(id: string) {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new Error("User not found")
    }
    return user
  }

  async findUserByEmail(email: string) {
    return userRepository.findByEmail(email)
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    if (data.name !== undefined) UserEntity.validateName(data.name);
    if (data.email !== undefined) UserEntity.validateEmail(data.email);

    if (data.email) {
      const existing = await userRepository.findByEmail(data.email)
      if (existing && existing.getDataValue("id") !== id) {
        throw new Error("Email already in use")
      }
    }

    if (data.password_hash) {
      throw new Error("Use updateUserPassword to change the password")
    }

    const user = await userRepository.update(id, data)
    if (!user) {
      throw new Error("User not found")
    }
    return user
  }

  async deleteUser(id: string) {
    const deleted = await userRepository.delete(id)
    if (!deleted) {
      throw new Error("User not found")
    }
  }
}
