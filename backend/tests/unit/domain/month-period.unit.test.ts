import { describe, expect, it } from "vitest"
import { getMonthDistance, isMonthWithinRecurringRange } from "../../../src/domain/value-objects/month-period"

describe("month period utils", () => {
  it("calculates the distance between two months", () => {
    expect(getMonthDistance({ year: 2026, month: 1 }, { year: 2026, month: 1 })).toBe(0)
    expect(getMonthDistance({ year: 2026, month: 1 }, { year: 2026, month: 2 })).toBe(1)
    expect(getMonthDistance({ year: 2026, month: 12 }, { year: 2027, month: 2 })).toBe(2)
  })

  it("accepts only months inside the configured recurring range", () => {
    expect(isMonthWithinRecurringRange({ year: 2026, month: 3 }, { year: 2026, month: 3 }, 2)).toBe(true)
    expect(isMonthWithinRecurringRange({ year: 2026, month: 3 }, { year: 2026, month: 4 }, 2)).toBe(true)
    expect(isMonthWithinRecurringRange({ year: 2026, month: 3 }, { year: 2026, month: 5 }, 2)).toBe(false)
    expect(isMonthWithinRecurringRange({ year: 2026, month: 3 }, { year: 2026, month: 2 }, 2)).toBe(false)
    expect(isMonthWithinRecurringRange({ year: 2026, month: 3 }, { year: 2026, month: 8 }, null)).toBe(true)
  })
})