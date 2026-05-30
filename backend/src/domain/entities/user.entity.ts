export class UserEntity {
  constructor(
    readonly name: string,
    readonly email: string
  ) {}

  static create(params: { name: string; email: string }) {
    this.validateName(params.name)
    this.validateEmail(params.email)

    return new UserEntity(params.name.trim(), params.email.trim().toLowerCase())
  }

  static validateName(name: string) {
    const normalizedName = name?.trim()

    if (!normalizedName || normalizedName.length < 2 || normalizedName.length > 100) {
      throw new Error("Name must be between 2 and 100 characters")
    }
  }

  static validateEmail(email: string) {
    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("A valid email is required")
    }
  }

  static validatePasswordStrength(password: string) {
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
}