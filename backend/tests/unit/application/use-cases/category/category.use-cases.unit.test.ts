import { describe, expect, it, vi } from "vitest"
import { CreateCategoryUseCase } from "../../../../../src/application/use-cases/category/create.use-case"
import { DeleteCategoryUseCase } from "../../../../../src/application/use-cases/category/delete.use-case"
import { GetCategoryByIdUseCase } from "../../../../../src/application/use-cases/category/get-by-id.use-case"
import { ListCategoriesByUserUseCase } from "../../../../../src/application/use-cases/category/list-by-user.use-case"
import { UpdateCategoryUseCase } from "../../../../../src/application/use-cases/category/update.use-case"
import { BadRequestError, ForbiddenError, NotFoundError } from "../../../../../src/utils/errors"

function makeCategory(userId = "user-1") {
  return {
    getDataValue: vi.fn((field: string) => {
      if (field === "user_id") return userId
      return undefined
    }),
  }
}

describe("category use cases", () => {
  it("creates a category through repositories", async () => {
    const createdCategory = { id: "category-1" }
    const categoryRepository = {
      create: vi.fn().mockResolvedValue(createdCategory),
    }
    const userRepository = {
      findById: vi.fn().mockResolvedValue({ id: "user-1" }),
    }

    const useCase = new CreateCategoryUseCase(categoryRepository, userRepository)

    await expect(
      useCase.execute({ user_id: "user-1", name: "Essentials", type: "fixed" }),
    ).resolves.toBe(createdCategory)

    expect(userRepository.findById).toHaveBeenCalledWith("user-1")
    expect(categoryRepository.create).toHaveBeenCalledWith({
      user_id: "user-1",
      name: "Essentials",
      type: "fixed",
    })
  })

  it("rejects category creation when the user does not exist", async () => {
    const useCase = new CreateCategoryUseCase(
      { create: vi.fn() },
      { findById: vi.fn().mockResolvedValue(null) },
    )

    await expect(
      useCase.execute({ user_id: "user-1", name: "Essentials", type: "fixed" }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it("lists categories by user", async () => {
    const categories = [{ id: "category-1" }]
    const categoryRepository = {
      findByUserId: vi.fn().mockResolvedValue(categories),
    }

    const useCase = new ListCategoriesByUserUseCase(categoryRepository)

    await expect(useCase.execute("user-1")).resolves.toBe(categories)
    expect(categoryRepository.findByUserId).toHaveBeenCalledWith("user-1")
  })

  it("returns a category by id when the owner matches", async () => {
    const category = makeCategory("user-1")
    const useCase = new GetCategoryByIdUseCase({
      findById: vi.fn().mockResolvedValue(category),
    })

    await expect(useCase.execute("category-1", "user-1")).resolves.toBe(category)
  })

  it("rejects category read when the category does not exist", async () => {
    const useCase = new GetCategoryByIdUseCase({
      findById: vi.fn().mockResolvedValue(null),
    })

    await expect(useCase.execute("category-1", "user-1")).rejects.toBeInstanceOf(NotFoundError)
  })

  it("rejects category read when the owner does not match", async () => {
    const useCase = new GetCategoryByIdUseCase({
      findById: vi.fn().mockResolvedValue(makeCategory("user-2")),
    })

    await expect(useCase.execute("category-1", "user-1")).rejects.toBeInstanceOf(ForbiddenError)
  })

  it("updates a category when it belongs to the requester", async () => {
    const updatedCategory = { id: "category-1", name: "Housing" }
    const categoryRepository = {
      findById: vi.fn().mockResolvedValue(makeCategory("user-1")),
      update: vi.fn().mockResolvedValue(updatedCategory),
    }
    const useCase = new UpdateCategoryUseCase(categoryRepository)

    await expect(
      useCase.execute("category-1", { name: "Housing" }, "user-1"),
    ).resolves.toBe(updatedCategory)

    expect(categoryRepository.update).toHaveBeenCalledWith("category-1", { name: "Housing" })
  })

  it("rejects category update when the owner does not match", async () => {
    const useCase = new UpdateCategoryUseCase({
      findById: vi.fn().mockResolvedValue(makeCategory("user-2")),
      update: vi.fn(),
    })

    await expect(
      useCase.execute("category-1", { name: "Housing" }, "user-1"),
    ).rejects.toBeInstanceOf(ForbiddenError)
  })

  it("deletes a category when it belongs to the requester", async () => {
    const deletedCategory = { id: "category-1" }
    const categoryRepository = {
      findById: vi.fn().mockResolvedValue(makeCategory("user-1")),
      delete: vi.fn().mockResolvedValue(deletedCategory),
    }
    const useCase = new DeleteCategoryUseCase(categoryRepository)

    await expect(useCase.execute("category-1", "user-1")).resolves.toBe(deletedCategory)
    expect(categoryRepository.delete).toHaveBeenCalledWith("category-1")
  })

  it("rejects category delete when the category does not exist", async () => {
    const useCase = new DeleteCategoryUseCase({
      findById: vi.fn().mockResolvedValue(null),
      delete: vi.fn(),
    })

    await expect(useCase.execute("category-1", "user-1")).rejects.toBeInstanceOf(NotFoundError)
  })
})