import { createAuthenticatedSession, createCategory, createMonth } from "./helpers/api"

describe("installment groups", () => {
  it("materializes all installment expenses across the schedule", async () => {
    const session = await createAuthenticatedSession("installment")
    const januaryMonth = await createMonth(session.agent, { year: 2026, month: 1 })
    const category = await createCategory(session.agent, { name: "Electronics" })

    const groupResponse = await session.agent.post("/api/v1/installment-groups").send({
      description: "Notebook",
      total_value: 3000,
      installments: 3,
      starting_installment_number: 1,
      category_id: category.id,
      start_month_id: januaryMonth.id,
    }).expect(201)

    const expensesResponse = await session.agent.get(`/api/v1/installment-groups/${groupResponse.body.id}/expenses`).expect(200)

    expect(expensesResponse.body).toHaveLength(3)
    expect(expensesResponse.body.map((expense: { description: string }) => expense.description)).toEqual(
      expect.arrayContaining([
        "Notebook (1/3)",
        "Notebook (2/3)",
        "Notebook (3/3)",
      ])
    )
  })
})