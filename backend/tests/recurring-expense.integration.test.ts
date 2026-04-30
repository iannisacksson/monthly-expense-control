import { createAuthenticatedSession, createCategory, createMonth } from "./helpers/api"

describe("recurring expenses", () => {
  it("creates recurring expenses for the eligible owner months only", async () => {
    const session = await createAuthenticatedSession("recurring-expense")
    const januaryMonth = await createMonth(session.agent, { year: 2026, month: 1 })
    const category = await createCategory(session.agent, { name: "Utilities" })

    const recurringExpenseResponse = await session.agent.post("/api/v1/recurring-expenses").send({
      description: "Internet",
      value: 120,
      category_id: category.id,
      start_month_id: januaryMonth.id,
      occurrences: 2,
      status: "active",
    }).expect(201)

    const januaryExpensesResponse = await session.agent
      .get(`/api/v1/expenses/user/${session.user.id}/month/${januaryMonth.id}`)
      .expect(200)

    expect(januaryExpensesResponse.body).toHaveLength(1)
    expect(januaryExpensesResponse.body[0].recurring_expense_id).toBe(recurringExpenseResponse.body.id)

    const februaryMonth = await createMonth(session.agent, { year: 2026, month: 2 })
    const februaryExpensesResponse = await session.agent
      .get(`/api/v1/expenses/user/${session.user.id}/month/${februaryMonth.id}`)
      .expect(200)

    expect(februaryExpensesResponse.body).toHaveLength(1)
    expect(februaryExpensesResponse.body[0].recurring_expense_id).toBe(recurringExpenseResponse.body.id)

    const marchMonth = await createMonth(session.agent, { year: 2026, month: 3 })
    const marchExpensesResponse = await session.agent
      .get(`/api/v1/expenses/user/${session.user.id}/month/${marchMonth.id}`)
      .expect(200)

    expect(marchExpensesResponse.body).toHaveLength(0)
  })
})