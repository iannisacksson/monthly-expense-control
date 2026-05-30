import { adaptExpressRoute, buildAuthenticatedHttpRequest, withFallbackErrorStatus } from "../../express-route.adapter"
import { deleteIncomeController } from "./delete.controller"
import { getIncomeByIdController } from "./get-by-id.controller"
import { listIncomesByMonthController } from "./list-by-month.controller"
import { registerIncomeController } from "./register.controller"
import { updateIncomeController } from "./update.controller"

export const registerIncome = adaptExpressRoute(registerIncomeController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const listIncomesByMonth = adaptExpressRoute(listIncomesByMonthController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const getIncomeById = adaptExpressRoute(getIncomeByIdController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const updateIncome = adaptExpressRoute(updateIncomeController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const deleteIncome = adaptExpressRoute(deleteIncomeController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
