import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { UserRepository } from "../repositories/user.repository"
import { UserService } from "./user.service"
import { RegisterDTO, LoginDTO, UpdateProfileDTO } from "../dtos/auth.dto"

const BCRYPT_ROUNDS = 12

const userRepository = new UserRepository()
const userService = new UserService()

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET is not configured")
  return secret
}

function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN ?? "7d"
}

export class AuthService {
  async register(data: RegisterDTO) {
    return userService.createUserWithRawPassword(data.name, data.email, data.password)
  }

  async login(data: LoginDTO) {
    if (!data.email || !data.password) {
      throw new Error("Email and password are required")
    }

    const user = await userRepository.findByEmail(data.email)
    if (!user) {
      throw new Error("Invalid credentials")
    }

    const passwordHash = user.getDataValue("password_hash") as string
    const passwordMatch = await bcrypt.compare(data.password, passwordHash)
    if (!passwordMatch) {
      throw new Error("Invalid credentials")
    }

    const id = user.getDataValue("id") as string
    const email = user.getDataValue("email") as string

    const token = jwt.sign({ id, email }, getJwtSecret(), {
      expiresIn: getJwtExpiresIn(),
    } as jwt.SignOptions)

    return {
      token,
      user: {
        id,
        name: user.getDataValue("name") as string,
        email,
      },
    }
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId)
    if (!user) throw new Error("User not found")
    return user
  }

  async updateMe(userId: string, data: UpdateProfileDTO) {
    if (data.name !== undefined) {
      if (data.name.length < 2 || data.name.length > 100) {
        throw new Error("Name must be between 2 and 100 characters")
      }
    }

    if (data.email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error("A valid email is required")
      }
      const existing = await userRepository.findByEmail(data.email)
      if (existing && existing.getDataValue("id") !== userId) {
        throw new Error("Email already in use")
      }
    }

    const updatePayload: { name?: string; email?: string; password_hash?: string } = {}

    if (data.name !== undefined) updatePayload.name = data.name
    if (data.email !== undefined) updatePayload.email = data.email

    if (data.password !== undefined) {
      userService.validatePasswordStrength(data.password)
      updatePayload.password_hash = await bcrypt.hash(data.password, BCRYPT_ROUNDS)
    }

    const user = await userRepository.update(userId, updatePayload)
    if (!user) throw new Error("User not found")
    return user
  }

  async deleteMe(userId: string) {
    const deleted = await userRepository.delete(userId)
    if (!deleted) throw new Error("User not found")
  }
}
