import { describe, expect, it, vi } from "vitest";
import { CreateIncomeTaxController } from "../../../../../../src/interfaces/http/controllers/income-tax/create.controller";
import { DeleteIncomeTaxController } from "../../../../../../src/interfaces/http/controllers/income-tax/delete.controller";
import { GetIncomeTaxByIdController } from "../../../../../../src/interfaces/http/controllers/income-tax/get-by-id.controller";
import { ListIncomeTaxesByIncomeController } from "../../../../../../src/interfaces/http/controllers/income-tax/list-by-income.controller";
import { UpdateIncomeTaxController } from "../../../../../../src/interfaces/http/controllers/income-tax/update.controller";
import {
  BadRequestError,
  ForbiddenError,
} from "../../../../../../src/utils/errors";

function makeIncomeTax() {
  return {
    id: "tax-1",
    monthlyIncome: { id: "income-1" },
    taxType: "INSS",
    value: 150,
    isAuto: false,
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

describe("CreateIncomeTaxController", () => {
  it("returns 201 with snake_case response on success", async () => {
    const tax = makeIncomeTax();
    const controller = new CreateIncomeTaxController({
      execute: vi.fn().mockResolvedValue(tax),
    } as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: {
          monthly_income_id: "income-1",
          tax_type: "INSS",
          value: 150,
          is_auto: false,
        },
      }) as any,
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      monthly_income_id: "income-1",
      tax_type: "INSS",
      is_auto: false,
    });
  });

  it("throws BadRequestError when value is negative", async () => {
    const controller = new CreateIncomeTaxController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({
          body: {
            monthly_income_id: "income-1",
            tax_type: "INSS",
            value: -1,
            is_auto: false,
          },
        }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("GetIncomeTaxByIdController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const tax = makeIncomeTax();
    const useCase = { execute: vi.fn().mockResolvedValue(tax) };
    const controller = new GetIncomeTaxByIdController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "tax-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ monthly_income_id: "income-1" });
    expect(useCase.execute).toHaveBeenCalledWith("tax-1", "user-1");
  });

  it("propagates ForbiddenError from use case", async () => {
    const controller = new GetIncomeTaxByIdController({
      execute: vi.fn().mockRejectedValue(new ForbiddenError()),
    } as any);

    await expect(
      controller.handle(makeAuthRequest({ params: { id: "tax-1" } }) as any),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe("ListIncomeTaxesByIncomeController", () => {
  it("returns 200 with array of snake_case responses", async () => {
    const useCase = { execute: vi.fn().mockResolvedValue([makeIncomeTax()]) };
    const controller = new ListIncomeTaxesByIncomeController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { incomeId: "income-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({ monthly_income_id: "income-1" }),
    ]);
  });
});

describe("UpdateIncomeTaxController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const tax = makeIncomeTax();
    const useCase = { execute: vi.fn().mockResolvedValue(tax) };
    const controller = new UpdateIncomeTaxController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: { tax_type: "IRRF", value: 220 },
        params: { id: "tax-1" },
      }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ tax_type: "INSS" });
    expect(useCase.execute).toHaveBeenCalledWith(
      "tax-1",
      expect.objectContaining({ tax_type: "IRRF", value: 220 }),
      "user-1",
    );
  });

  it("throws BadRequestError when value is negative", async () => {
    const controller = new UpdateIncomeTaxController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({ body: { value: -10 }, params: { id: "tax-1" } }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("DeleteIncomeTaxController", () => {
  it("returns 200 with success true", async () => {
    const useCase = { execute: vi.fn().mockResolvedValue(undefined) };
    const controller = new DeleteIncomeTaxController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "tax-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
  });
});
import { describe, expect, it, vi } from "vitest";
import { CreateIncomeTaxController } from "../../../../../../src/interfaces/http/controllers/income-tax/create.controller";
import { DeleteIncomeTaxController } from "../../../../../../src/interfaces/http/controllers/income-tax/delete.controller";
import { GetIncomeTaxByIdController } from "../../../../../../src/interfaces/http/controllers/income-tax/get-by-id.controller";
import { ListIncomeTaxesByIncomeController } from "../../../../../../src/interfaces/http/controllers/income-tax/list-by-income.controller";
import { UpdateIncomeTaxController } from "../../../../../../src/interfaces/http/controllers/income-tax/update.controller";
import { BadRequestError, ForbiddenError } from "../../../../../../src/utils/errors";

function makeIncomeTaxEntity(monthlyIncomeId = "income-1") {
  return {
    id: "tax-1",
    monthlyIncome: { id: monthlyIncomeId },
    taxType: "INSS",
    value: 150,
    isAuto: false,
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

describe("CreateIncomeTaxController", () => {
  it("returns 201 with snake_case response on success", async () => {
    const tax = makeIncomeTaxEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(tax) };
    const controller = new CreateIncomeTaxController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: {
          monthly_income_id: "income-1",
          tax_type: "INSS",
          value: 150,
          is_auto: false,
        },
      }) as any,
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      monthly_income_id: "income-1",
      tax_type: "INSS",
      value: 150,
      is_auto: false,
    });
    expect(useCase.execute).toHaveBeenCalledWith(
      {
        monthly_income_id: "income-1",
        tax_type: "INSS",
        value: 150,
        is_auto: false,
      },
      "user-1",
    );
  });

  it("throws BadRequestError when value is negative", async () => {
    const controller = new CreateIncomeTaxController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({
          body: {
            monthly_income_id: "income-1",
            tax_type: "INSS",
            value: -1,
            is_auto: false,
          },
        }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("GetIncomeTaxByIdController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const tax = makeIncomeTaxEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(tax) };
    const controller = new GetIncomeTaxByIdController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "tax-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ monthly_income_id: "income-1" });
    expect(useCase.execute).toHaveBeenCalledWith("tax-1", "user-1");
  });

  it("propagates ForbiddenError from use case", async () => {
    const controller = new GetIncomeTaxByIdController({
      execute: vi.fn().mockRejectedValue(new ForbiddenError()),
    } as any);

    await expect(
      controller.handle(makeAuthRequest({ params: { id: "tax-1" } }) as any),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe("ListIncomeTaxesByIncomeController", () => {
  it("returns 200 with array of snake_case responses", async () => {
    const controller = new ListIncomeTaxesByIncomeController({
      execute: vi.fn().mockResolvedValue([makeIncomeTaxEntity()]),
    } as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { incomeId: "income-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({ monthly_income_id: "income-1" }),
    ]);
  });
});

describe("UpdateIncomeTaxController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const tax = makeIncomeTaxEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(tax) };
    const controller = new UpdateIncomeTaxController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ body: { value: 200 }, params: { id: "tax-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ value: 200, monthly_income_id: "income-1" });
    expect(useCase.execute).toHaveBeenCalledWith(
      "tax-1",
      expect.objectContaining({ value: 200 }),
      "user-1",
    );
  });

  it("throws BadRequestError when value is negative", async () => {
    const controller = new UpdateIncomeTaxController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({ body: { value: -1 }, params: { id: "tax-1" } }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("DeleteIncomeTaxController", () => {
  it("returns 200 with success: true on deletion", async () => {
    const useCase = { execute: vi.fn().mockResolvedValue(undefined) };
    const controller = new DeleteIncomeTaxController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "tax-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(useCase.execute).toHaveBeenCalledWith("tax-1", "user-1");
  });
});
