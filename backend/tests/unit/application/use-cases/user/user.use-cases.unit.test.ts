import { describe, expect, it, vi } from "vitest"
import { CreateUserUseCase } from "../../../../../src/application/use-cases/user/create.use-case"
import { DeleteUserUseCase } from "../../../../../src/application/use-cases/user/delete.use-case"
import { GetUserByIdUseCase } from "../../../../../src/application/use-cases/user/get-by-id.use-case"
import { UpdateUserUseCase } from "../../../../../src/application/use-cases/user/update.use-case"

describe("user use cases", () => {
  it("creates a user when the email is available", async () => {
    const createdUser = { id: "user-1" }
    const userRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(createdUser),
    }

    const useCase = new CreateUserUseCase(userRepository)

    await expect(
      useCase.execute({ name: "Maria", email: "maria@example.com", password_hash: "hash" }),
    ).resolves.toBe(createdUser)

    expect(userRepository.findByEmail).toHaveBeenCalledWith("maria@example.com")
    expect(userRepository.create).toHaveBeenCalledWith({
      name: "Maria",
      email: "maria@example.com",
      password_hash: "hash",
    })
  })

  it("rejects user creation when the email is already in use", async () => {
    const useCase = new CreateUserUseCase({
      findByEmail: vi.fn().mockResolvedValue({ id: "user-2" }),
      create: vi.fn(),
    })

    await expect(
      useCase.execute({ name: "Maria", email: "maria@example.com", password_hash: "hash" }),
    ).rejects.toThrow("Email already in use")
  })

  it("returns a user by id", async () => {
    const user = { id: "user-1" }
    const useCase = new GetUserByIdUseCase({
      findById: vi.fn().mockResolvedValue(user),
    })

    await expect(useCase.execute("user-1")).resolves.toBe(user)
  })

  it("rejects user lookup when the user does not exist", async () => {
    const useCase = new GetUserByIdUseCase({
      findById: vi.fn().mockResolvedValue(null),
    })

    await expect(useCase.execute("user-1")).rejects.toThrow("User not found")
  })

  it("updates a user when the email remains unique", async () => {
    const updatedUser = { id: "user-1", email: "maria@example.com" }
    const userRepository = {
      findByEmail: vi.fn().mockResolvedValue({ getDataValue: vi.fn().mockReturnValue("user-1") }),
      update: vi.fn().mockResolvedValue(updatedUser),
    }
    const useCase = new UpdateUserUseCase(userRepository)

    await expect(
      useCase.execute("user-1", { email: "maria@example.com" }),
    ).resolves.toBe(updatedUser)
  })

  it("rejects user update when another user already owns the email", async () => {
    const useCase = new UpdateUserUseCase({
      findByEmail: vi.fn().mockResolvedValue({ getDataValue: vi.fn().mockReturnValue("user-2") }),
      update: vi.fn(),
    })

    await expect(
      useCase.execute("user-1", { email: "maria@example.com" }),
    ).rejects.toThrow("Email already in use")
  })

  it("rejects password_hash updates through the generic update use case", async () => {
    const useCase = new UpdateUserUseCase({
      findByEmail: vi.fn(),
      update: vi.fn(),
    })

    await expect(
      useCase.execute("user-1", { password_hash: "new-hash" }),
    ).rejects.toThrow("Use updateUserPassword to change the password")
  })

  it("deletes an existing user", async () => {
    const userRepository = {
      delete: vi.fn().mockResolvedValue(true),
    }
    const useCase = new DeleteUserUseCase(userRepository)

    await expect(useCase.execute("user-1")).resolves.toBeUndefined()
    expect(userRepository.delete).toHaveBeenCalledWith("user-1")
  })

  it("rejects user deletion when the user does not exist", async () => {
    const useCase = new DeleteUserUseCase({
      delete: vi.fn().mockResolvedValue(null),
    })

    await expect(useCase.execute("user-1")).rejects.toThrow("User not found")
  })
})