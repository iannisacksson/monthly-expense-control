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

  it("creates recurring envelope expenses with zero current value", async () => {
    const session = await createAuthenticatedSession("recurring-envelope")
    const januaryMonth = await createMonth(session.agent, { year: 2026, month: 1 })
    const category = await createCategory(session.agent, { name: "Groceries" })

    const recurringExpenseResponse = await session.agent.post("/api/v1/recurring-expenses").send({
      description: "Envelope Mercado",
      value: 0,
      expense_kind: "envelope",
      planned_amount: 800,
      category_id: category.id,
      start_month_id: januaryMonth.id,
      status: "active",
    }).expect(201)

    expect(recurringExpenseResponse.body.expense_kind).toBe("envelope")
    expect(Number(recurringExpenseResponse.body.value)).toBe(0)
    expect(Number(recurringExpenseResponse.body.planned_amount)).toBe(800)

    const januaryExpensesResponse = await session.agent
      .get(`/api/v1/expenses/user/${session.user.id}/month/${januaryMonth.id}`)
      .expect(200)

    expect(januaryExpensesResponse.body).toHaveLength(1)
    expect(januaryExpensesResponse.body[0].recurring_expense_id).toBe(recurringExpenseResponse.body.id)
    expect(januaryExpensesResponse.body[0].expense_kind).toBe("envelope")
    expect(Number(januaryExpensesResponse.body[0].value)).toBe(0)
    expect(Number(januaryExpensesResponse.body[0].planned_amount)).toBe(800)
  })
})