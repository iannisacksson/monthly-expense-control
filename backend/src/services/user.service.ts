import { UserRepository } from "../repositories/user.repository"
import { CreateUserDTO, UpdateUserDTO } from "../dtos/user.dto"

const userRepository = new UserRepository()

export class UserService {
  async createUser(data: CreateUserDTO) {
    if (!data.name || data.name.length < 2 || data.name.length > 100) {
      throw new Error("Name must be between 2 and 100 characters")
    }

    if (!data.email) {
      throw new Error("Email is required")
    }

    const existing = await userRepository.findByEmail(data.email)
    if (existing) {
      throw new Error("Email already in use")
    }

    data.password_hash = data.password_hash || "default_hash" // In real app, hash the password properly

    return userRepository.create(data)
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

  async listUsers() {
    return userRepository.findAll()
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    if (data.name !== undefined && (data.name.length < 2 || data.name.length > 100)) {
      throw new Error("Name must be between 2 and 100 characters")
    }

    if (data.email) {
      const existing = await userRepository.findByEmail(data.email)
      if (existing && existing.getDataValue("id") !== id) {
        throw new Error("Email already in use")
      }
    }

    const user = await userRepository.update(id, data)
    if (!user) {
      throw new Error("User not found")
    }
    return user
  }

  async deleteUser(id: string) {
    const user = await userRepository.delete(id)
    if (!user) {
      throw new Error("User not found")
    }
    return user
  }
}
