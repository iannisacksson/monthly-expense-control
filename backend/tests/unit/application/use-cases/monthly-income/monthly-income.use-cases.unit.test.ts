import { describe, expect, it, vi } from "vitest"
import { RegisterMonthlyIncomeUseCase } from "../../../../../src/application/use-cases/monthly-income/register.use-case"
import { GetMonthlyIncomeByIdUseCase } from "../../../../../src/application/use-cases/monthly-income/get-by-id.use-case"
import { ListMonthlyIncomesByMonthUseCase } from "../../../../../src/application/use-cases/monthly-income/list-by-month.use-case"
import { UpdateMonthlyIncomeUseCase } from "../../../../../src/application/use-cases/monthly-income/update.use-case"
import { DeleteMonthlyIncomeUseCase } from "../../../../../src/application/use-cases/monthly-income/delete.use-case"
import { BadRequestError, ForbiddenError, NotFoundError } from "../../../../../src/utils/errors"

const fakeTransaction = <T>(fn: (t: unknown) => Promise<T>): Promise<T> => fn({})

function makeIncome(userId = "user-1") {
  return {
    id: "income-1",
    userId,
    monthId: "month-1",
    recurringIncomeId: null,
    grossIncome: 5000,
    incomeType: "salary",
    taxationMode: "manual" as const,
    taxationProfile: null,
    taxationParameters: null,
    notes: null,
    createdAt: new Date(),
  }
}

function makeMonth(userId = "user-1") {
  return {
    getDataValue: (key: string) => {
      if (key === "user_id") return userId
      return null
    },
  }
}

describe("monthly-income use cases", () => {
  describe("RegisterMonthlyIncomeUseCase", () => {
    it("registers an income and returns the created domain object", async () => {
      const created = makeIncome()
      const monthlyIncomeRepository = { create: vi.fn().mockResolvedValue(created) }
      const monthRepository = { findById: vi.fn().mockResolvedValue(makeMonth()) }
      const userRepository = { findById: vi.fn().mockResolvedValue({ id: "user-1" }) }
      const incomeTaxRepository = { createMany: vi.fn() }
      const incomeTaxationService = {
        normalizeTaxation: vi.fn().mockReturnValue({ mode: "manual", profile: null, parameters: null }),
        calculateAutomaticTaxes: vi.fn().mockReturnValue([]),
      }

      const useCase = new RegisterMonthlyIncomeUseCase(
        monthlyIncomeRepository,
        monthRepository as any,
        userRepository as any,
        incomeTaxRepository as any,
        incomeTaxationService as any,
        fakeTransaction,
      )

      const result = await useCase.execute(
        { userId: "user-1", monthId: "month-1", grossIncome: 5000, incomeType: "salary" },
        "user-1",
      )

      expect(result).toBe(created)
      expect(monthlyIncomeRepository.create).toHaveBeenCalled()
      expect(incomeTaxRepository.createMany).not.toHaveBeenCalled()
    })

    it("creates automatic taxes when taxation mode is automatic", async () => {
      const created = makeIncome()
      const monthlyIncomeRepository = { create: vi.fn().mockResolvedValue(created) }
      const monthRepository = { findById: vi.fn().mockResolvedValue(makeMonth()) }
      const userRepository = { findById: vi.fn().mockResolvedValue({ id: "user-1" }) }
      const incomeTaxRepository = { createMany: vi.fn().mockResolvedValue([]) }
      const incomeTaxationService = {
        normalizeTaxation: vi.fn().mockReturnValue({ mode: "automatic", profile: "me_pro_labore", parameters: {} }),
        calculateAutomaticTaxes: vi.fn().mockReturnValue([
          { tax_type: "das", value: 300, is_auto: true },
        ]),
      }

      const useCase = new RegisterMonthlyIncomeUseCase(
        monthlyIncomeRepository,
        monthRepository as any,
        userRepository as any,
        incomeTaxRepository as any,
        incomeTaxationService as any,
        fakeTransaction,
      )

      await useCase.execute(
        { userId: "user-1", monthId: "month-1", grossIncome: 5000, incomeType: "salary" },
        "user-1",
      )

      expect(incomeTaxRepository.createMany).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ tax_type: "das" })]),
        expect.objectContaining({ transaction: expect.anything() }),
      )
    })

    it("rejects when user does not exist", async () => {
      const useCase = new RegisterMonthlyIncomeUseCase(
        { create: vi.fn() },
        { findById: vi.fn().mockResolvedValue(makeMonth()) } as any,
        { findById: vi.fn().mockResolvedValue(null) } as any,
      )

      await expect(
        useCase.execute({ userId: "user-1", monthId: "month-1", grossIncome: 5000, incomeType: "salary" }, "user-1"),
      ).rejects.toBeInstanceOf(BadRequestError)
    })

    it("rejects when month does not exist", async () => {
      const useCase = new RegisterMonthlyIncomeUseCase(
        { create: vi.fn() },
        { findById: vi.fn().mockResolvedValue(null) } as any,
        { findById: vi.fn().mockResolvedValue({ id: "user-1" }) } as any,
      )

      await expect(
        useCase.execute({ userId: "user-1", monthId: "month-1", grossIncome: 5000, incomeType: "salary" }, "user-1"),
      ).rejects.toBeInstanceOf(BadRequestError)
    })

    it("rejects when month belongs to another user", async () => {
      const useCase = new RegisterMonthlyIncomeUseCase(
        { create: vi.fn() },
        { findById: vi.fn().mockResolvedValue(makeMonth("user-2")) } as any,
        { findById: vi.fn().mockResolvedValue({ id: "user-1" }) } as any,
      )

      await expect(
        useCase.execute({ userId: "user-1", monthId: "month-1", grossIncome: 5000, incomeType: "salary" }, "user-1"),
      ).rejects.toBeInstanceOf(ForbiddenError)
    })

    it("rejects when gross income is zero or negative", async () => {
      const useCase = new RegisterMonthlyIncomeUseCase(
        { create: vi.fn() },
        { findById: vi.fn() } as any,
        { findById: vi.fn() } as any,
      )

      await expect(
        useCase.execute({ userId: "user-1", monthId: "month-1", grossIncome: 0, incomeType: "salary" }, "user-1"),
      ).rejects.toBeInstanceOf(BadRequestError)
    })
  })

  describe("GetMonthlyIncomeByIdUseCase", () => {
    it("returns the income when owner matches", async () => {
      const income = makeIncome("user-1")
      const useCase = new GetMonthlyIncomeByIdUseCase({
        findById: vi.fn().mockResolvedValue(income),
      })

      await expect(useCase.execute("income-1", "user-1")).resolves.toBe(income)
    })

    it("throws NotFoundError when income does not exist", async () => {
      const useCase = new GetMonthlyIncomeByIdUseCase({
        findById: vi.fn().mockResolvedValue(null),
      })

      await expect(useCase.execute("income-1", "user-1")).rejects.toBeInstanceOf(NotFoundError)
    })

    it("throws ForbiddenError when owner does not match", async () => {
      const useCase = new GetMonthlyIncomeByIdUseCase({
        findById: vi.fn().mockResolvedValue(makeIncome("user-2")),
      })

      await expect(useCase.execute("income-1", "user-1")).rejects.toBeInstanceOf(ForbiddenError)
    })
  })

  describe("ListMonthlyIncomesByMonthUseCase", () => {
    it("returns incomes when requester owns the month", async () => {
      const incomes = [makeIncome()]
      const monthlyIncomeRepository = { findByMonthId: vi.fn().mockResolvedValue(incomes) }
      const monthRepository = { findById: vi.fn().mockResolvedValue(makeMonth("user-1")) }

      const useCase = new ListMonthlyIncomesByMonthUseCase(monthlyIncomeRepository, monthRepository as any)

      await expect(useCase.execute("month-1", "user-1")).resolves.toBe(incomes)
    })

    it("throws ForbiddenError when month belongs to another user", async () => {
      const monthRepository = { findById: vi.fn().mockResolvedValue(makeMonth("user-2")) }
      const useCase = new ListMonthlyIncomesByMonthUseCase({ findByMonthId: vi.fn() }, monthRepository as any)

      await expect(useCase.execute("month-1", "user-1")).rejects.toBeInstanceOf(ForbiddenError)
    })

    it("throws ForbiddenError when month does not exist", async () => {
      const monthRepository = { findById: vi.fn().mockResolvedValue(null) }
      const useCase = new ListMonthlyIncomesByMonthUseCase({ findByMonthId: vi.fn() }, monthRepository as any)

      await expect(useCase.execute("month-1", "user-1")).rejects.toBeInstanceOf(ForbiddenError)
    })
  })

  describe("UpdateMonthlyIncomeUseCase", () => {
    it("updates income when owner matches", async () => {
      const existing = makeIncome("user-1")
      const updated = { ...existing, grossIncome: 6000 }
      const monthlyIncomeRepository = {
        findById: vi.fn().mockResolvedValue(existing),
        update: vi.fn().mockResolvedValue(updated),
      }
      const incomeTaxRepository = { deleteAutoByMonthlyIncomeId: vi.fn(), createMany: vi.fn() }
      const incomeTaxationService = {
        normalizeTaxation: vi.fn().mockReturnValue({ mode: "manual", profile: null, parameters: null }),
        calculateAutomaticTaxes: vi.fn().mockReturnValue([]),
      }

      const useCase = new UpdateMonthlyIncomeUseCase(
        monthlyIncomeRepository,
        incomeTaxRepository as any,
        incomeTaxationService as any,
        fakeTransaction,
      )

      await expect(useCase.execute("income-1", { grossIncome: 6000 }, "user-1")).resolves.toBe(updated)
      expect(monthlyIncomeRepository.update).toHaveBeenCalled()
    })

    it("throws ForbiddenError when owner does not match", async () => {
      const useCase = new UpdateMonthlyIncomeUseCase({
        findById: vi.fn().mockResolvedValue(makeIncome("user-2")),
        update: vi.fn(),
      })

      await expect(useCase.execute("income-1", { grossIncome: 6000 }, "user-1")).rejects.toBeInstanceOf(ForbiddenError)
    })

    it("throws NotFoundError when income does not exist", async () => {
      const useCase = new UpdateMonthlyIncomeUseCase({
        findById: vi.fn().mockResolvedValue(null),
        update: vi.fn(),
      })

      await expect(useCase.execute("income-1", { grossIncome: 6000 }, "user-1")).rejects.toBeInstanceOf(NotFoundError)
    })

    it("rejects when gross income update is invalid", async () => {
      const useCase = new UpdateMonthlyIncomeUseCase({
        findById: vi.fn().mockResolvedValue(makeIncome("user-1")),
        update: vi.fn(),
      })

      await expect(useCase.execute("income-1", { grossIncome: -100 }, "user-1")).rejects.toThrow()
    })
  })

  describe("DeleteMonthlyIncomeUseCase", () => {
    it("deletes income when owner matches", async () => {
      const existing = makeIncome("user-1")
      const monthlyIncomeRepository = {
        findById: vi.fn().mockResolvedValue(existing),
        delete: vi.fn().mockResolvedValue(undefined),
      }

      const useCase = new DeleteMonthlyIncomeUseCase(monthlyIncomeRepository)

      await expect(useCase.execute("income-1", "user-1")).resolves.toBeUndefined()
      expect(monthlyIncomeRepository.delete).toHaveBeenCalledWith(existing)
    })

    it("throws NotFoundError when income does not exist", async () => {
      const useCase = new DeleteMonthlyIncomeUseCase({
        findById: vi.fn().mockResolvedValue(null),
        delete: vi.fn(),
      })

      await expect(useCase.execute("income-1", "user-1")).rejects.toBeInstanceOf(NotFoundError)
    })

    it("throws ForbiddenError when owner does not match", async () => {
      const useCase = new DeleteMonthlyIncomeUseCase({
        findById: vi.fn().mockResolvedValue(makeIncome("user-2")),
        delete: vi.fn(),
      })

      await expect(useCase.execute("income-1", "user-1")).rejects.toBeInstanceOf(ForbiddenError)
    })
  })
})
