import { createAuthenticatedSession, createCategory } from "./helpers/api"

describe("budget rules and allocations", () => {
  it("rejects allocations whose total percentage exceeds 100 percent", async () => {
    const session = await createAuthenticatedSession("budget")
    const essentialsCategory = await createCategory(session.agent, { name: "Essentials" })
    const leisureCategory = await createCategory(session.agent, { name: "Leisure", type: "lifestyle" })

    const ruleResponse = await session.agent.post("/api/v1/budgets/rules").send({ name: "50/30/20" }).expect(201)

    await session.agent.post("/api/v1/budgets/allocations").send({
      budget_rule_id: ruleResponse.body.id,
      category_id: essentialsCategory.id,
      percentage: 60,
    }).expect(201)

    const invalidAllocationResponse = await session.agent.post("/api/v1/budgets/allocations").send({
      budget_rule_id: ruleResponse.body.id,
      category_id: leisureCategory.id,
      percentage: 50,
    }).expect(400)

    expect(invalidAllocationResponse.body.error).toBe("Total allocation percentage cannot exceed 100%")
  })
})