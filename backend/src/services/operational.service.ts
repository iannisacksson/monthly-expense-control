import { sequelize } from "../database/connection"

type ReadinessCheck = {
  status: "ok" | "error"
  latencyMs?: number
  error?: string
}

export class OperationalService {
  getLiveness() {
    return {
      status: "ok" as const,
      uptimeSeconds: Number(process.uptime().toFixed(2)),
      timestamp: new Date().toISOString(),
    }
  }

  async getReadiness() {
    const startedAt = process.hrtime.bigint()

    try {
      await sequelize.authenticate()

      const database: ReadinessCheck = {
        status: "ok",
        latencyMs: Number(((Number(process.hrtime.bigint() - startedAt) / 1_000_000)).toFixed(2)),
      }

      return {
        status: "ok" as const,
        timestamp: new Date().toISOString(),
        checks: {
          database,
        },
      }
    } catch (error) {
      const database: ReadinessCheck = {
        status: "error",
        error: error instanceof Error ? error.message : "Database readiness check failed",
      }

      return {
        status: "degraded" as const,
        timestamp: new Date().toISOString(),
        checks: {
          database,
        },
      }
    }
  }

  async getHealth() {
    const liveness = this.getLiveness()
    const readiness = await this.getReadiness()

    return {
      status: readiness.status === "ok" ? "ok" : "degraded",
      timestamp: liveness.timestamp,
      uptimeSeconds: liveness.uptimeSeconds,
      checks: readiness.checks,
    }
  }
}