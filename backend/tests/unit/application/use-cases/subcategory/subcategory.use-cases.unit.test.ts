import { describe, expect, it, vi } from "vitest";
import { CreateSubcategoryUseCase } from "../../../../../src/application/use-cases/subcategory/create.use-case";
import { DeleteSubcategoryUseCase } from "../../../../../src/application/use-cases/subcategory/delete.use-case";
import { GetSubcategoryByIdUseCase } from "../../../../../src/application/use-cases/subcategory/get-by-id.use-case";
import { ListSubcategoriesByCategoryUseCase } from "../../../../../src/application/use-cases/subcategory/list-by-category.use-case";
import { UpdateSubcategoryUseCase } from "../../../../../src/application/use-cases/subcategory/update.use-case";
import { ForbiddenError } from "../../../../../src/utils/errors";

function makeCategory(userId = "user-1") {
  return {
    id: "category-1",
    user: { id: userId },
    name: "Essentials",
  };
}

function makeSubcategory(categoryId = "category-1") {
  return {
    id: "sub-1",
    category: { id: categoryId },
    name: "Food",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("subcategory use cases", () => {
  it("creates a subcategory when the category belongs to the requester", async () => {
    const createdSubcategory = { id: "subcategory-1" };
    const subcategoryRepository = {
      create: vi.fn().mockResolvedValue(createdSubcategory),
    };
    const categoryRepository = {
      findById: vi.fn().mockResolvedValue(makeCategory("user-1")),
    };
    const useCase = new CreateSubcategoryUseCase(
      subcategoryRepository,
      categoryRepository,
    );

    await expect(
      useCase.execute({ category_id: "category-1", name: "Food" }, "user-1"),
    ).resolves.toBe(createdSubcategory);
  });

  it("rejects subcategory creation when the category belongs to another user", async () => {
    const useCase = new CreateSubcategoryUseCase(
      { create: vi.fn() },
      { findById: vi.fn().mockResolvedValue(makeCategory("user-2")) },
    );

    await expect(
      useCase.execute({ category_id: "category-1", name: "Food" }, "user-1"),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("lists subcategories by category for the owner", async () => {
    const subcategories = [{ id: "subcategory-1" }];
    const useCase = new ListSubcategoriesByCategoryUseCase(
      { findByCategoryId: vi.fn().mockResolvedValue(subcategories) },
      { findById: vi.fn().mockResolvedValue(makeCategory("user-1")) },
    );

    await expect(useCase.execute("category-1", "user-1")).resolves.toBe(
      subcategories,
    );
  });

  it("returns a subcategory by id for the owner", async () => {
    const subcategory = makeSubcategory("category-1");
    const useCase = new GetSubcategoryByIdUseCase(
      { findById: vi.fn().mockResolvedValue(subcategory) },
      { findById: vi.fn().mockResolvedValue(makeCategory("user-1")) },
    );

    await expect(useCase.execute("subcategory-1", "user-1")).resolves.toBe(
      subcategory,
    );
  });

  it("updates a subcategory when it belongs to the requester", async () => {
    const updatedSubcategory = { id: "subcategory-1", name: "Bills" };
    const useCase = new UpdateSubcategoryUseCase(
      {
        findById: vi.fn().mockResolvedValue(makeSubcategory("category-1")),
        update: vi.fn().mockResolvedValue(updatedSubcategory),
      },
      { findById: vi.fn().mockResolvedValue(makeCategory("user-1")) },
    );

    await expect(
      useCase.execute("subcategory-1", { name: "Bills" }, "user-1"),
    ).resolves.toBe(updatedSubcategory);
  });

  it("rejects subcategory update when the category belongs to another user", async () => {
    const useCase = new UpdateSubcategoryUseCase(
      {
        findById: vi.fn().mockResolvedValue(makeSubcategory("category-1")),
        update: vi.fn(),
      },
      { findById: vi.fn().mockResolvedValue(makeCategory("user-2")) },
    );

    await expect(
      useCase.execute("subcategory-1", { name: "Bills" }, "user-1"),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("deletes a subcategory when it belongs to the requester", async () => {
    const existingSubcategory = makeSubcategory("category-1");
    const useCase = new DeleteSubcategoryUseCase(
      {
        findById: vi.fn().mockResolvedValue(existingSubcategory),
        delete: vi.fn().mockResolvedValue(undefined),
      },
      { findById: vi.fn().mockResolvedValue(makeCategory("user-1")) },
    );

    await expect(
      useCase.execute("subcategory-1", "user-1"),
    ).resolves.toBeUndefined();
  });
});
