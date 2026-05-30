import request from "supertest"
import app from "../../../src/app"

describe("operational endpoints", () => {
  it("exposes health, liveness, readiness and metrics endpoints", async () => {
    const liveResponse = await request(app).get("/api/v1/live").expect(200)
    expect(liveResponse.body.status).toBe("ok")
    expect(liveResponse.body).toHaveProperty("uptimeSeconds")

    const readyResponse = await request(app).get("/api/v1/ready").expect(200)
    expect(readyResponse.body.status).toBe("ok")
    expect(readyResponse.body.checks.database.status).toBe("ok")

    const healthResponse = await request(app).get("/api/v1/health").expect(200)
    expect(healthResponse.body.status).toBe("ok")
    expect(healthResponse.body.checks.database.status).toBe("ok")

    const metricsResponse = await request(app).get("/api/v1/metrics").expect(200)
    expect(metricsResponse.headers["content-type"]).toContain("text/plain")
    expect(metricsResponse.text).toContain("http_requests_total")
  })
})