import request from "supertest"
import app from "../../src/app"

type Agent = ReturnType<typeof request.agent>

type AuthSession = {
  agent: Agent
  user: {
    id: string
    name: string
    email: string
  }
  password: string
}

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`
}

export async function createAuthenticatedSession(prefix: string): Promise<AuthSession> {
  const agent = request.agent(app)
  const password = "SenhaSegura1"
  const name = `${prefix} User`
  const email = uniqueEmail(prefix.toLowerCase())

  await agent.post("/api/v1/auth/register").send({ name, email, password }).expect(201)
  const loginResponse = await agent.post("/api/v1/auth/login").send({ email, password }).expect(200)

  return {
    agent,
    user: loginResponse.body.user,
    password,
  }
}

export async function createMonth(agent: Agent, overrides: Partial<{ year: number; month: number; status: string }> = {}) {
  const response = await agent
    .post("/api/v1/months")
    .send({
      year: overrides.year ?? 2026,
      month: overrides.month ?? 1,
      status: overrides.status ?? "open",
    })
    .expect(201)

  return response.body
}

export async function createCategory(agent: Agent, overrides: Partial<{ name: string; type: string }> = {}) {
  const response = await agent
    .post("/api/v1/categories")
    .send({
      name: overrides.name ?? "Essentials",
      type: overrides.type ?? "essential",
    })
    .expect(201)

  return response.body
}