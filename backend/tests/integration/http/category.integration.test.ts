import { createAuthenticatedSession, createCategory } from "../../shared/helpers/api"

describe("category HTTP controllers", () => {
  it("creates and lists categories for the authenticated user", async () => {
    const session = await createAuthenticatedSession("category")

    const createdCategory = await createCategory(session.agent, { name: "Transport" })

    const listResponse = await session.agent.get(`/api/v1/categories/user/${session.user.id}`).expect(200)

    expect(createdCategory.name).toBe("Transport")
    expect(listResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdCategory.id,
          name: "Transport",
        }),
      ]),
    )
  })

  it("returns 403 through the error middleware when a different user accesses the category", async () => {
    const ownerSession = await createAuthenticatedSession("category-owner")
    const strangerSession = await createAuthenticatedSession("category-stranger")
    const category = await createCategory(ownerSession.agent, { name: "Housing" })

    await strangerSession.agent.get(`/api/v1/categories/${category.id}`).expect(403, { error: "Forbidden" })
  })

  it("returns 400 through the error middleware for invalid category payloads", async () => {
    const session = await createAuthenticatedSession("category-invalid")

    const response = await session.agent.post("/api/v1/categories").send({ name: "A", type: "essential" }).expect(400)

    expect(response.body).toEqual({ error: "Category name must be between 2 and 100 characters" })
  })
})