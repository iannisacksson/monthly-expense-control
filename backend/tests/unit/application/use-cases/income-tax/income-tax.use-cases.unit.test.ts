import { describe, expect, it, vi } from "vitest"
import { CreateIncomeTaxUseCase } from "../../../../../src/application/use-cases/income-tax/create.use-case"
import { DeleteIncomeTaxUseCase } from "../../../../../src/application/use-cases/income-tax/delete.use-case"
import { GetIncomeTaxByIdUseCase } from "../../../../../src/application/use-cases/income-tax/get-by-id.use-case"
import { ListIncomeTaxesByIncomeUseCase } from "../../../../../src/application/use-cases/income-tax/list-by-income.use-case"
import { UpdateIncomeTaxUseCase } from "../../../../../src/application/use-cases/income-tax/update.use-case"
import { ForbiddenError } from "../../../../../src/utils/errors"

function makeIncome(userId = "user-1") {
  return {
    id: "income-1",
    userId,
    monthId: "month-1",
    grossIncome: 5000,
    incomeType: "salary",
    taxationMode: "manual" as const,
    taxationProfile: null,
    taxationParameters: null,
    notes: null,
    createdAt: new Date(),
  };
}

function makeTax(monthlyIncomeId = "income-1", isAuto = false) {
  return {
    getDataValue: vi.fn((field: string) => {
      if (field === "monthly_income_id") return monthlyIncomeId
      if (field === "is_auto") return isAuto
      return undefined
    }),
  }
}

describe("income tax use cases", () => {
  it("creates a manual income tax for the owner", async () => {
    const createdTax = { id: "tax-1" }
    const useCase = new CreateIncomeTaxUseCase(
      { create: vi.fn().mockResolvedValue(createdTax) },
      { findById: vi.fn().mockResolvedValue(makeIncome("user-1")) },
    )

    await expect(
      useCase.execute({ monthly_income_id: "income-1", tax_type: " INSS ", value: 10, is_auto: false }, "user-1"),
    ).resolves.toBe(createdTax)
  })

  it("rejects manual income tax creation for another user income", async () => {
    const useCase = new CreateIncomeTaxUseCase(
      { create: vi.fn() },
      { findById: vi.fn().mockResolvedValue(makeIncome("user-2")) },
    )

    await expect(
      useCase.execute({ monthly_income_id: "income-1", tax_type: "INSS", value: 10, is_auto: false }, "user-1"),
    ).rejects.toBeInstanceOf(ForbiddenError)
  })

  it("lists taxes by income for the owner", async () => {
    const taxes = [{ id: "tax-1" }]
    const useCase = new ListIncomeTaxesByIncomeUseCase(
      { findByMonthlyIncomeId: vi.fn().mockResolvedValue(taxes) },
      { findById: vi.fn().mockResolvedValue(makeIncome("user-1")) },
    )

    await expect(useCase.execute("income-1", "user-1")).resolves.toBe(taxes)
  })

  it("returns a tax by id for the owner", async () => {
    const tax = makeTax("income-1")
    const useCase = new GetIncomeTaxByIdUseCase(
      { findById: vi.fn().mockResolvedValue(tax) },
      { findById: vi.fn().mockResolvedValue(makeIncome("user-1")) },
    )

    await expect(useCase.execute("tax-1", "user-1")).resolves.toBe(tax)
  })

  it("updates a manual tax for the owner", async () => {
    const updatedTax = { id: "tax-1" }
    const useCase = new UpdateIncomeTaxUseCase(
      {
        findById: vi.fn().mockResolvedValue(makeTax("income-1", false)),
        update: vi.fn().mockResolvedValue(updatedTax),
      },
      { findById: vi.fn().mockResolvedValue(makeIncome("user-1")) },
    )

    await expect(useCase.execute("tax-1", { value: 20 }, "user-1")).resolves.toBe(updatedTax)
  })

  it("rejects manual update of an automatic tax", async () => {
    const useCase = new UpdateIncomeTaxUseCase(
      {
        findById: vi.fn().mockResolvedValue(makeTax("income-1", true)),
        update: vi.fn(),
      },
      { findById: vi.fn().mockResolvedValue(makeIncome("user-1")) },
    )

    await expect(useCase.execute("tax-1", { value: 20 }, "user-1")).rejects.toThrow(
      "Automatic income taxes cannot be edited manually",
    )
  })

  it("deletes a manual tax for the owner", async () => {
    const deletedTax = { id: "tax-1" }
    const useCase = new DeleteIncomeTaxUseCase(
      {
        findById: vi.fn().mockResolvedValue(makeTax("income-1", false)),
        delete: vi.fn().mockResolvedValue(deletedTax),
      },
      { findById: vi.fn().mockResolvedValue(makeIncome("user-1")) },
    )

    await expect(useCase.execute("tax-1", "user-1")).resolves.toBe(deletedTax)
  })
})