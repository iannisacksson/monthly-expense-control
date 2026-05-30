import { adaptExpressRoute, buildAuthenticatedHttpRequest, withFallbackErrorStatus } from "../../express-route.adapter"
import { createMonthController } from "./create.controller"
import { deleteMonthController } from "./delete.controller"
import { finalizeMonthController } from "./finalize.controller"
import { getMonthByIdController } from "./get-by-id.controller"
import { listMonthsByUserController } from "./list-by-user.controller"
import { updateMonthController } from "./update.controller"

export const createMonth = adaptExpressRoute(createMonthController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const listMonthsByUser = adaptExpressRoute(listMonthsByUserController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const getMonthById = adaptExpressRoute(getMonthByIdController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const updateMonth = adaptExpressRoute(updateMonthController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const deleteMonth = adaptExpressRoute(
  deleteMonthController,
  (req) => buildAuthenticatedHttpRequest(req),
  withFallbackErrorStatus(404, { "Month deletion is not allowed": 405 }),
)
export const finalizeMonth = adaptExpressRoute(finalizeMonthController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
