import request from "supertest"
import app from "../../../src/app"

describe("authentication flow", () => {
  it("registers, logs in, refreshes and logs out with secure cookies", async () => {
    const agent = request.agent(app)
    const email = `auth-${Date.now()}@example.com`
    const password = "SenhaSegura1"

    await agent.post("/api/v1/auth/register").send({
      name: "Auth Test",
      email,
      password,
    }).expect(201)

    const loginResponse = await agent.post("/api/v1/auth/login").send({ email, password }).expect(200)

    expect(loginResponse.body.user.email).toBe(email)
    expect(loginResponse.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("fc_access_token="),
        expect.stringContaining("fc_refresh_token="),
      ])
    )

    const meResponse = await agent.get("/api/v1/auth/me").expect(200)
    expect(meResponse.body.email).toBe(email)

    const refreshResponse = await agent.post("/api/v1/auth/refresh").expect(200)
    expect(refreshResponse.body.user.email).toBe(email)
    expect(refreshResponse.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("fc_access_token="),
        expect.stringContaining("fc_refresh_token="),
      ])
    )

    await agent.post("/api/v1/auth/logout").expect(200, { success: true })
    await agent.get("/api/v1/auth/me").expect(401)
  })
})