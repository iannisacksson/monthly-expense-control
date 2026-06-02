import { describe, expect, it, vi } from "vitest";
import { DeleteMonthlyIncomeController } from "../../../../../../src/interfaces/http/controllers/monthly-income/delete.controller";
import { GetMonthlyIncomeByIdController } from "../../../../../../src/interfaces/http/controllers/monthly-income/get-by-id.controller";
import { ListMonthlyIncomesByMonthController } from "../../../../../../src/interfaces/http/controllers/monthly-income/list-by-month.controller";
import { RegisterMonthlyIncomeController } from "../../../../../../src/interfaces/http/controllers/monthly-income/register.controller";
import { UpdateMonthlyIncomeController } from "../../../../../../src/interfaces/http/controllers/monthly-income/update.controller";
import { IncomeType, TaxationModeType } from "../../../../../../src/domain/entities/monthly-income.entity";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../../../../src/utils/errors";

function makeMonthlyIncome() {
  return {
    id: "income-1",
    user: { id: "user-1" },
    month: { id: "month-1" },
    recurringIncome: { id: "rec-1" },
    grossIncome: 5000,
    incomeType: IncomeType.SALARY,
    taxationMode: TaxationModeType.MANUAL,
    taxationProfile: null,
    taxationParameters: null,
    notes: "Salary",
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

describe("RegisterMonthlyIncomeController", () => {
  it("returns 201 with snake_case response on success", async () => {
    const income = makeMonthlyIncome();
    const useCase = { execute: vi.fn().mockResolvedValue(income) };
    const controller = new RegisterMonthlyIncomeController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: {
          month_id: "month-1",
          recurring_income_id: "rec-1",
          gross_income: 5000,
          income_type: "salary",
          notes: "Salary",
        },
      }) as any,
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      user_id: "user-1",
      month_id: "month-1",
      recurring_income_id: "rec-1",
      gross_income: 5000,
      updated_at: income.updatedAt,
    });
    expect(useCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        monthId: "month-1",
        recurringIncomeId: "rec-1",
      }),
      "user-1",
    );
  });

  it("throws BadRequestError when gross income is invalid", async () => {
    const controller = new RegisterMonthlyIncomeController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({
          body: { month_id: "month-1", gross_income: 0, income_type: "salary" },
        }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("GetMonthlyIncomeByIdController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const income = makeMonthlyIncome();
    const useCase = { execute: vi.fn().mockResolvedValue(income) };
    const controller = new GetMonthlyIncomeByIdController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "income-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ month_id: "month-1" });
    expect(useCase.execute).toHaveBeenCalledWith("income-1", "user-1");
  });

  it("propagates NotFoundError from use case", async () => {
    const controller = new GetMonthlyIncomeByIdController({
      execute: vi.fn().mockRejectedValue(new NotFoundError("Monthly income not found")),
    } as any);

    await expect(
      controller.handle(makeAuthRequest({ params: { id: "income-1" } }) as any),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("ListMonthlyIncomesByMonthController", () => {
  it("returns 200 with array of snake_case responses", async () => {
    const useCase = { execute: vi.fn().mockResolvedValue([makeMonthlyIncome()]) };
    const controller = new ListMonthlyIncomesByMonthController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { monthId: "month-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({ user_id: "user-1", month_id: "month-1" }),
    ]);
  });
});

describe("UpdateMonthlyIncomeController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const income = makeMonthlyIncome();
    const useCase = { execute: vi.fn().mockResolvedValue(income) };
    const controller = new UpdateMonthlyIncomeController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: { gross_income: 6000, notes: "Updated" },
        params: { id: "income-1" },
      }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ gross_income: 5000 });
    expect(useCase.execute).toHaveBeenCalledWith(
      "income-1",
      expect.objectContaining({ grossIncome: 6000, notes: "Updated" }),
      "user-1",
    );
  });

  it("throws BadRequestError when notes exceed limit", async () => {
    const controller = new UpdateMonthlyIncomeController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({
          body: { notes: "x".repeat(256) },
          params: { id: "income-1" },
        }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("DeleteMonthlyIncomeController", () => {
  it("returns 200 with success true", async () => {
    const controller = new DeleteMonthlyIncomeController({
      execute: vi.fn().mockResolvedValue(undefined),
    } as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "income-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  it("propagates ForbiddenError from use case", async () => {
    const controller = new DeleteMonthlyIncomeController({
      execute: vi.fn().mockRejectedValue(new ForbiddenError()),
    } as any);

    await expect(
      controller.handle(makeAuthRequest({ params: { id: "income-1" } }) as any),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
import { describe, expect, it, vi } from "vitest";
import { DeleteMonthlyIncomeController } from "../../../../../../src/interfaces/http/controllers/monthly-income/delete.controller";
import { GetMonthlyIncomeByIdController } from "../../../../../../src/interfaces/http/controllers/monthly-income/get-by-id.controller";
import { ListMonthlyIncomesByMonthController } from "../../../../../../src/interfaces/http/controllers/monthly-income/list-by-month.controller";
import { RegisterMonthlyIncomeController } from "../../../../../../src/interfaces/http/controllers/monthly-income/register.controller";
import { UpdateMonthlyIncomeController } from "../../../../../../src/interfaces/http/controllers/monthly-income/update.controller";
import {
  IncomeType,
  TaxationModeType,
} from "../../../../../../src/domain/entities/monthly-income.entity";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../../../../src/utils/errors";

function makeMonthlyIncomeEntity(userId = "user-1") {
  return {
    id: "income-1",
    user: { id: userId },
    month: { id: "month-1" },
    recurringIncome: { id: "recurring-1" },
    grossIncome: 5000,
    incomeType: IncomeType.SALARY,
    taxationMode: TaxationModeType.MANUAL,
    taxationProfile: null,
    taxationParameters: null,
    notes: "Main income",
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

describe("RegisterMonthlyIncomeController", () => {
  it("returns 201 with snake_case response on success", async () => {
    const income = makeMonthlyIncomeEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(income) };
    const controller = new RegisterMonthlyIncomeController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({
        body: {
          month_id: "month-1",
          recurring_income_id: "recurring-1",
          gross_income: 5000,
          income_type: "salary",
          notes: "Main income",
        },
      }) as any,
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      user_id: "user-1",
      month_id: "month-1",
      recurring_income_id: "recurring-1",
      gross_income: 5000,
      income_type: "salary",
      updated_at: income.updatedAt,
    });
    expect(useCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        monthId: "month-1",
        recurringIncomeId: "recurring-1",
        grossIncome: 5000,
        incomeType: "salary",
      }),
      "user-1",
    );
  });

  it("throws BadRequestError when gross_income is invalid", async () => {
    const controller = new RegisterMonthlyIncomeController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({
          body: { month_id: "month-1", gross_income: 0, income_type: "salary" },
        }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("GetMonthlyIncomeByIdController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const income = makeMonthlyIncomeEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(income) };
    const controller = new GetMonthlyIncomeByIdController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "income-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ user_id: "user-1", month_id: "month-1" });
    expect(useCase.execute).toHaveBeenCalledWith("income-1", "user-1");
  });

  it("propagates NotFoundError from use case", async () => {
    const controller = new GetMonthlyIncomeByIdController({
      execute: vi.fn().mockRejectedValue(new NotFoundError("Monthly income not found")),
    } as any);

    await expect(
      controller.handle(makeAuthRequest({ params: { id: "income-1" } }) as any),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("ListMonthlyIncomesByMonthController", () => {
  it("returns 200 with array of snake_case responses", async () => {
    const controller = new ListMonthlyIncomesByMonthController({
      execute: vi.fn().mockResolvedValue([makeMonthlyIncomeEntity()]),
    } as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { monthId: "month-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({ month_id: "month-1", user_id: "user-1" }),
    ]);
  });
});

describe("UpdateMonthlyIncomeController", () => {
  it("returns 200 with snake_case response on success", async () => {
    const income = makeMonthlyIncomeEntity();
    const useCase = { execute: vi.fn().mockResolvedValue(income) };
    const controller = new UpdateMonthlyIncomeController(useCase as any);

    const response = await controller.handle(
      makeAuthRequest({ body: { gross_income: 6000 }, params: { id: "income-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ gross_income: 5000, updated_at: income.updatedAt });
    expect(useCase.execute).toHaveBeenCalledWith(
      "income-1",
      expect.objectContaining({ grossIncome: 6000 }),
      "user-1",
    );
  });

  it("throws BadRequestError when notes exceed limit", async () => {
    const controller = new UpdateMonthlyIncomeController({ execute: vi.fn() } as any);

    await expect(
      controller.handle(
        makeAuthRequest({
          body: { notes: "x".repeat(256) },
          params: { id: "income-1" },
        }) as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

describe("DeleteMonthlyIncomeController", () => {
  it("returns 200 with success: true on deletion", async () => {
    const controller = new DeleteMonthlyIncomeController({
      execute: vi.fn().mockResolvedValue(undefined),
    } as any);

    const response = await controller.handle(
      makeAuthRequest({ params: { id: "income-1" } }) as any,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect((controller as any).useCase.execute).toHaveBeenCalledWith("income-1", "user-1");
  });

  it("propagates ForbiddenError from use case", async () => {
    const controller = new DeleteMonthlyIncomeController({
      execute: vi.fn().mockRejectedValue(new ForbiddenError()),
    } as any);

    await expect(
      controller.handle(makeAuthRequest({ params: { id: "income-1" } }) as any),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
