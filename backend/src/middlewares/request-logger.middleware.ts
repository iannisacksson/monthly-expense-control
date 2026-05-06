import { randomUUID } from "crypto"
import type { NextFunction, Request, Response } from "express"
import { httpRequestDurationSeconds, httpRequestsTotal } from "../utils/metrics"
import { logger } from "../utils/logger"

function resolveLogMethod(statusCode: number): "info" | "warn" | "error" {
  if (statusCode >= 500) return "error"
  if (statusCode >= 400) return "warn"
  return "info"
}

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = req.header("x-request-id")?.trim() || randomUUID()
  const startedAt = process.hrtime.bigint()
  const route = req.originalUrl || req.url

  req.requestId = requestId
  req.log = logger.child({ requestId })

  res.setHeader("x-request-id", requestId)

  res.on("finish", () => {
    const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000
    const statusCode = res.statusCode
    const labels = {
      method: req.method,
      route,
      status_code: String(statusCode),
    }

    httpRequestsTotal.inc(labels)
    httpRequestDurationSeconds.observe(labels, durationSeconds)

    req.log?.[resolveLogMethod(statusCode)](
      {
        method: req.method,
        route,
        statusCode,
        durationMs: Number((durationSeconds * 1000).toFixed(2)),
      },
      "http_request_completed"
    )
  })

  next()
}