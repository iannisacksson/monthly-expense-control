import bcrypt from "bcrypt"
import { UserRepository } from "../repositories/user.repository"
import { CreateUserDTO, UpdateUserDTO } from "../dtos/user.dto"

const BCRYPT_ROUNDS = 12

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

    return userRepository.create(data)
  }

  async createUserWithRawPassword(name: string, email: string, password: string) {
    if (!name || name.length < 2 || name.length > 100) {
      throw new Error("Name must be between 2 and 100 characters")
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("A valid email is required")
    }

    this.validatePasswordStrength(password)

    const existing = await userRepository.findByEmail(email)
    if (existing) {
      throw new Error("Email already in use")
    }

    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    const user = await userRepository.create({ name, email, password_hash })

    return {
      id: user.getDataValue("id"),
      name: user.getDataValue("name"),
      email: user.getDataValue("email"),
      createdAt: user.getDataValue("created_at"),
    }
  }

  validatePasswordStrength(password: string) {
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters")
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter")
    }
    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter")
    }
    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one number")
    }
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
