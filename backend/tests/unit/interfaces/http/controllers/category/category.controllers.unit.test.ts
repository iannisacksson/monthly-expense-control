import { describe, expect, it, vi } from "vitest";
import { CreateCategoryController } from "../../../../../../src/interfaces/http/controllers/category/create.controller";
import { DeleteCategoryController } from "../../../../../../src/interfaces/http/controllers/category/delete.controller";
import { GetCategoryByIdController } from "../../../../../../src/interfaces/http/controllers/category/get-by-id.controller";
import { ListCategoriesByUserController } from "../../../../../../src/interfaces/http/controllers/category/list-by-user.controller";
import { UpdateCategoryController } from "../../../../../../src/interfaces/http/controllers/category/update.controller";
import { CategoryType } from "../../../../../../src/domain/entities/category.entity";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../../../../src/utils/errors";

function makeCategoryEntity(userId = "user-1") {
  return {
    id: "category-1",
    name: "Essentials",
    type: CategoryType.NECESSARY,
    user: { id: userId },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };
}

function makeAuthRequest(overrides = {}) {
  return {
    body: {},
    params: {},
    userId: "user-1",
    ...overrides,
  };
}

describe("CreateCategoryController", () => {
  it("returns 201 with snake_case response on success", async () => {
    const category = makeCategoryEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(category) };
    const controller = new CreateCategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: { name: "Essentials", type: "necessary" },
      }) as any,
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      id: category.id,
      name: category.name,
      type: category.type,
      user_id: category.user.id,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    });
    expect(useCase.execute).toHaveBeenCalledWith({
      name: "Essentials",
      type: "necessary",
      userId: "user-1",
    });
  });

  it("throws BadRequestError when name is too short", async () => {
    const useCase = { execute: vi.fn() };
    const controller = new CreateCategoryController(useCase as any);

    await expect(
      controller.handle(
        makeAuthRequest({ body: { name: "A", type: "necessary" } }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("throws BadRequestError when type is invalid", async () => {
    const useCase = { execute: vi.fn() };
    const controller = new CreateCategoryController(useCase as any);

    await expect(
      controller.handle(
        makeAuthRequest({
          body: { name: "Essentials", type: "invalid" },
        }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("GetCategoryByIdController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const category = makeCategoryEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(category) };
    const controller = new GetCategoryByIdController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "category-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      id: category.id,
      name: category.name,
      type: category.type,
      user_id: category.user.id,
    });
    expect(useCase.execute).toHaveBeenCalledWith("category-1", "user-1");
  });

  it("propagates NotFoundError from use case", async () => {
    const useCase = {
      execute: vi
        .fn()
        .mockRejectedValue(new NotFoundError("Category not found")),
    };
    const controller = new GetCategoryByIdController(useCase as any);

    await expect(
      controller.handle(
        makeAuthRequest({ params: { id: "category-1" } }) as any,
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("propagates ForbiddenError from use case", async () => {
    const useCase = {
      execute: vi.fn().mockRejectedValue(new ForbiddenError()),
    };
    const controller = new GetCategoryByIdController(useCase as any);

    await expect(
      controller.handle(
        makeAuthRequest({ params: { id: "category-1" } }) as any,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe("ListCategoriesByUserController", () => {
  it("returns 200 with array of snake_case responses", async () => {
    const categories = [makeCategoryEntity(), makeCategoryEntity()];
    const useCase = { execute: vi.fn().mockResolvedValue(categories) };
    const controller = new ListCategoriesByUserController(useCase as any);

    const response = await controller.handle(makeAuthRequest() as any);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect((response.body as any[])[0]).toMatchObject({ user_id: "user-1" });
    expect(useCase.execute).toHaveBeenCalledWith("user-1");
  });
});

describe("UpdateCategoryController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const category = makeCategoryEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(category) };
    const controller = new UpdateCategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: { name: "Housing" },
        params: { id: "category-1" },
      }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ user_id: category.user.id });
    expect(useCase.execute).toHaveBeenCalledWith(
      "category-1",
      expect.objectContaining({ name: "Housing" }),
      "user-1",
    );
  });

  it("throws BadRequestError when provided name is too short", async () => {
    const useCase = { execute: vi.fn() };
    const controller = new UpdateCategoryController(useCase as any);

    await expect(
      controller.handle(
        makeAuthRequest({
          body: { name: "X" },
          params: { id: "category-1" },
        }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("accepts update with only type provided", async () => {
    const category = makeCategoryEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(category) };
    const controller = new UpdateCategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: { type: "investment" },
        params: { id: "category-1" },
      }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(useCase.execute).toHaveBeenCalledWith(
      "category-1",
      expect.objectContaining({ type: "investment" }),
      "user-1",
    );
  });
});

describe("DeleteCategoryController", () => {
  it("returns 200 with success: true on deletion", async () => {
    const useCase = { execute: vi.fn().mockResolvedValue(undefined) };
    const controller = new DeleteCategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "category-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(useCase.execute).toHaveBeenCalledWith("category-1", "user-1");
  });

  it("propagates NotFoundError from use case", async () => {
    const useCase = {
      execute: vi
        .fn()
        .mockRejectedValue(new NotFoundError("Category not found")),
    };
    const controller = new DeleteCategoryController(useCase as any);

    await expect(
      controller.handle(
        makeAuthRequest({ params: { id: "category-1" } }) as any,
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
