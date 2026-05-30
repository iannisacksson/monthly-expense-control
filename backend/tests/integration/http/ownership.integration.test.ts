import { createAuthenticatedSession, createMonth } from "../../shared/helpers/api"

describe("ownership isolation", () => {
  it("prevents one user from reading another user's month", async () => {
    const ownerSession = await createAuthenticatedSession("owner")
    const strangerSession = await createAuthenticatedSession("stranger")
    const month = await createMonth(ownerSession.agent, { year: 2026, month: 4 })

    await strangerSession.agent.get(`/api/v1/months/${month.id}`).expect(403, { error: "Forbidden" })
  })
})