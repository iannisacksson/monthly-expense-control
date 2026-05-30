import { adaptExpressRoute, buildHttpRequest } from "../../express-route.adapter"
import { getHealthController } from "./get-health.controller"
import { getLivenessController } from "./get-liveness.controller"
import { getMetricsController } from "./get-metrics.controller"
import { getReadinessController } from "./get-readiness.controller"

export const getLiveness = adaptExpressRoute(getLivenessController, (req) => buildHttpRequest(req))
export const getReadiness = adaptExpressRoute(getReadinessController, (req) => buildHttpRequest(req))
export const getHealth = adaptExpressRoute(getHealthController, (req) => buildHttpRequest(req))
export const getMetrics = adaptExpressRoute(getMetricsController, (req) => buildHttpRequest(req))
