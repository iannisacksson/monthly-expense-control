export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  validateName(name: string): void;
  validateEmail(email: string): void;
  validatePasswordStrength(password: string): void;
}

export class UserEntity implements User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  validateName(name: string) {
    const normalizedName = name?.trim();

    if (
      !normalizedName ||
      normalizedName.length < 2 ||
      normalizedName.length > 100
    ) {
      throw new Error("Name must be between 2 and 100 characters");
    }
  }

  validateEmail(email: string) {
    const normalizedEmail = email?.trim().toLowerCase();

    if (
      !normalizedEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      throw new Error("A valid email is required");
    }
  }

  validatePasswordStrength(password: string) {
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one number");
    }
  }
}
