import { createAuthenticatedSession, createMonth } from "./helpers/api"

describe("recurring incomes", () => {
  it("generates monthly incomes for eligible owner months", async () => {
    const session = await createAuthenticatedSession("income")
    const januaryMonth = await createMonth(session.agent, { year: 2026, month: 1 })

    const recurringIncomeResponse = await session.agent.post("/api/v1/recurring-incomes").send({
      description: "Salary",
      gross_income: 5000,
      income_type: "salary",
      kind: "fixed_salary",
      start_month_id: januaryMonth.id,
      occurrences: 2,
      status: "active",
    }).expect(201)

    const januaryIncomesResponse = await session.agent.get(`/api/v1/monthly-incomes/month/${januaryMonth.id}`).expect(200)
    expect(januaryIncomesResponse.body).toHaveLength(1)
    expect(januaryIncomesResponse.body[0].recurring_income_id).toBe(recurringIncomeResponse.body.id)

    const februaryMonth = await createMonth(session.agent, { year: 2026, month: 2 })
    const februaryIncomesResponse = await session.agent.get(`/api/v1/monthly-incomes/month/${februaryMonth.id}`).expect(200)
    expect(februaryIncomesResponse.body).toHaveLength(1)
    expect(februaryIncomesResponse.body[0].recurring_income_id).toBe(recurringIncomeResponse.body.id)

    const marchMonth = await createMonth(session.agent, { year: 2026, month: 3 })
    const marchIncomesResponse = await session.agent.get(`/api/v1/monthly-incomes/month/${marchMonth.id}`).expect(200)
    expect(marchIncomesResponse.body).toHaveLength(0)
  })
})