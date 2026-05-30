import type { Request, Response, NextFunction } from "express"
import { metricsRegistry } from "../utils/metrics"
import {
  GetHealthUseCase,
  GetLivenessUseCase,
  GetReadinessUseCase,
} from "../application/use-cases/operational.use-cases";

const getLivenessUseCase = new GetLivenessUseCase();
const getReadinessUseCase = new GetReadinessUseCase();
const getHealthUseCase = new GetHealthUseCase();

export async function getLiveness(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(getLivenessUseCase.execute());
  } catch (error) {
    return next(error)
  }
}

export async function getReadiness(req: Request, res: Response, next: NextFunction) {
  try {
    const readiness = await getReadinessUseCase.execute();
    return res.status(readiness.status === "ok" ? 200 : 503).json(readiness)
  } catch (error) {
    return next(error)
  }
}

export async function getHealth(req: Request, res: Response, next: NextFunction) {
  try {
    const health = await getHealthUseCase.execute();
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