import { createAuthenticatedSession, createCategory, createMonth } from "../../shared/helpers/api"

describe("month finalization", () => {
  it("closes a month and blocks new expenses in the closed month", async () => {
    const session = await createAuthenticatedSession("month")
    const month = await createMonth(session.agent, { year: 2026, month: 5 })
    const category = await createCategory(session.agent, { name: "Housing" })

    const finalizeResponse = await session.agent.patch(`/api/v1/months/${month.id}/finalize`).expect(200)
    expect(finalizeResponse.body.status).toBe("closed")

    const createExpenseResponse = await session.agent.post("/api/v1/expenses").send({
      month_id: month.id,
      category_id: category.id,
      description: "Rent",
      value: 1200,
    }).expect(400)

    expect(createExpenseResponse.body.error).toBe("Closed months do not allow this expense operation")
  })
})