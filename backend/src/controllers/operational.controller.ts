import type { Request, Response, NextFunction } from "express"
import { metricsRegistry } from "../utils/metrics"
import { OperationalService } from "../services/operational.service"

const operationalService = new OperationalService()

export async function getLiveness(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(operationalService.getLiveness())
  } catch (error) {
    return next(error)
  }
}

export async function getReadiness(req: Request, res: Response, next: NextFunction) {
  try {
    const readiness = await operationalService.getReadiness()
    return res.status(readiness.status === "ok" ? 200 : 503).json(readiness)
  } catch (error) {
    return next(error)
  }
}

export async function getHealth(req: Request, res: Response, next: NextFunction) {
  try {
    const health = await operationalService.getHealth()
    return res.status(health.status === "ok" ? 200 : 503).json(health)
  } catch (error) {
    return next(error)
  }
}

export async function getMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    res.setHeader("Content-Type", metricsRegistry.contentType)
    return res.send(await metricsRegistry.metrics())
  } catch (error) {
    return next(error)
  }
}