import { describe, expect, it, vi } from "vitest";
import { CreateSubcategoryController } from "../../../../../../src/interfaces/http/controllers/subcategory/create.controller";
import { DeleteSubcategoryController } from "../../../../../../src/interfaces/http/controllers/subcategory/delete.controller";
import { GetSubcategoryByIdController } from "../../../../../../src/interfaces/http/controllers/subcategory/get-by-id.controller";
import { ListSubcategoriesByCategoryController } from "../../../../../../src/interfaces/http/controllers/subcategory/list-by-category.controller";
import { UpdateSubcategoryController } from "../../../../../../src/interfaces/http/controllers/subcategory/update.controller";
import {
  BadRequestError,
  ForbiddenError,
} from "../../../../../../src/utils/errors";

function makeSubcategory() {
  return {
    id: "subcategory-1",
    category: { id: "category-1" },
    name: "Food",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
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

describe("CreateSubcategoryController", () => {
  it("returns 201 with snake_case response on success", async () => {
    const subcategory = makeSubcategory();
    const useCase = { execute: vi.fn().mockResolvedValue(subcategory) };
    const controller = new CreateSubcategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: { category_id: "category-1", name: "Food" },
      }) as any,
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      id: "subcategory-1",
      category_id: "category-1",
      name: "Food",
      created_at: subcategory.createdAt,
      updated_at: subcategory.updatedAt,
    });
    expect(useCase.execute).toHaveBeenCalledWith(
      { category_id: "category-1", name: "Food" },
      "user-1",
    );
  });

  it("throws BadRequestError when name is too short", async () => {
    const controller = new CreateSubcategoryController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({ body: { category_id: "category-1", name: "A" } }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("GetSubcategoryByIdController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const subcategory = makeSubcategory();
    const useCase = { execute: vi.fn().mockResolvedValue(subcategory) };
    const controller = new GetSubcategoryByIdController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "subcategory-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ category_id: "category-1" });
    expect(useCase.execute).toHaveBeenCalledWith("subcategory-1", "user-1");
  });

  it("propagates ForbiddenError from use case", async () => {
    const controller = new GetSubcategoryByIdController({
      execute: vi.fn().mockRejectedValue(new ForbiddenError()),
    } as any);

    await expect(
      controller.handle(makeAuthRequest({ params: { id: "subcategory-1" } }) as any),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe("ListSubcategoriesByCategoryController", () => {
  it("returns 200 with array of snake_case responses", async () => {
    const useCase = { execute: vi.fn().mockResolvedValue([makeSubcategory()]) };
    const controller = new ListSubcategoriesByCategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { categoryId: "category-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({ category_id: "category-1" }),
    ]);
    expect(useCase.execute).toHaveBeenCalledWith("category-1", "user-1");
  });
});

describe("UpdateSubcategoryController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const subcategory = makeSubcategory();
    const useCase = { execute: vi.fn().mockResolvedValue(subcategory) };
    const controller = new UpdateSubcategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: { name: "Market" },
        params: { id: "subcategory-1" },
      }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ category_id: "category-1" });
    expect(useCase.execute).toHaveBeenCalledWith(
      "subcategory-1",
      expect.objectContaining({ name: "Market" }),
      "user-1",
    );
  });

  it("throws BadRequestError when name is too short", async () => {
    const controller = new UpdateSubcategoryController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({ body: { name: "X" }, params: { id: "subcategory-1" } }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("DeleteSubcategoryController", () => {
  it("returns 200 with success true", async () => {
    const useCase = { execute: vi.fn().mockResolvedValue(undefined) };
    const controller = new DeleteSubcategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "subcategory-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(useCase.execute).toHaveBeenCalledWith("subcategory-1", "user-1");
  });
});
import { describe, expect, it, vi } from "vitest";
import { CreateSubcategoryController } from "../../../../../../src/interfaces/http/controllers/subcategory/create.controller";
import { DeleteSubcategoryController } from "../../../../../../src/interfaces/http/controllers/subcategory/delete.controller";
import { GetSubcategoryByIdController } from "../../../../../../src/interfaces/http/controllers/subcategory/get-by-id.controller";
import { ListSubcategoriesByCategoryController } from "../../../../../../src/interfaces/http/controllers/subcategory/list-by-category.controller";
import { UpdateSubcategoryController } from "../../../../../../src/interfaces/http/controllers/subcategory/update.controller";
import { BadRequestError, ForbiddenError } from "../../../../../../src/utils/errors";

function makeSubcategoryEntity(categoryId = "category-1") {
  return {
    id: "subcategory-1",
    category: { id: categoryId },
    name: "Food",
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

describe("CreateSubcategoryController", () => {
  it("returns 201 with snake_case response on success", async () => {
    const subcategory = makeSubcategoryEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(subcategory) };
    const controller = new CreateSubcategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: { category_id: "category-1", name: "Food" },
      }) as any,
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      id: subcategory.id,
      category_id: subcategory.category.id,
      name: subcategory.name,
      created_at: subcategory.createdAt,
      updated_at: subcategory.updatedAt,
    });
    expect(useCase.execute).toHaveBeenCalledWith(
      { category_id: "category-1", name: "Food" },
      "user-1",
    );
  });

  it("throws BadRequestError when name is too short", async () => {
    const controller = new CreateSubcategoryController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({ body: { category_id: "category-1", name: "A" } }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("GetSubcategoryByIdController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const subcategory = makeSubcategoryEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(subcategory) };
    const controller = new GetSubcategoryByIdController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "subcategory-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ category_id: "category-1" });
    expect(useCase.execute).toHaveBeenCalledWith("subcategory-1", "user-1");
  });

  it("propagates ForbiddenError from use case", async () => {
    const controller = new GetSubcategoryByIdController({
      execute: vi.fn().mockRejectedValue(new ForbiddenError()),
    } as any);

    await expect(
      controller.handle(makeAuthRequest({ params: { id: "subcategory-1" } }) as any),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe("ListSubcategoriesByCategoryController", () => {
  it("returns 200 with array of snake_case responses", async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue([makeSubcategoryEntity()]),
    };
    const controller = new ListSubcategoriesByCategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { categoryId: "category-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({ category_id: "category-1" }),
    ]);
    expect(useCase.execute).toHaveBeenCalledWith("category-1", "user-1");
  });
});

describe("UpdateSubcategoryController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const subcategory = makeSubcategoryEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(subcategory) };
    const controller = new UpdateSubcategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: { name: "Groceries" },
        params: { id: "subcategory-1" },
      }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ category_id: "category-1" });
    expect(useCase.execute).toHaveBeenCalledWith(
      "subcategory-1",
      expect.objectContaining({ name: "Groceries" }),
      "user-1",
    );
  });

  it("throws BadRequestError when name is too short", async () => {
    const controller = new UpdateSubcategoryController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({ body: { name: "X" }, params: { id: "subcategory-1" } }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("DeleteSubcategoryController", () => {
  it("returns 200 with success: true on deletion", async () => {
    const useCase = { execute: vi.fn().mockResolvedValue(undefined) };
    const controller = new DeleteSubcategoryController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "subcategory-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(useCase.execute).toHaveBeenCalledWith("subcategory-1", "user-1");
  });
});
