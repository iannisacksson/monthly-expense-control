import { adaptExpressRoute, buildAuthenticatedHttpRequest, withFallbackErrorStatus } from "../../express-route.adapter"
import { createRecurringIncomeController } from "./create.controller"
import { listRecurringIncomesByUserController } from "./list-by-user.controller"
import { getRecurringIncomeByIdController } from "./get-by-id.controller"
import { updateRecurringIncomeController } from "./update.controller"
import { getMonthlyIncomesByRecurringIncomeController } from "./list-monthly-incomes.controller"
import { deleteRecurringIncomeController } from "./delete.controller"

export const createRecurringIncome = adaptExpressRoute(createRecurringIncomeController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const listRecurringIncomesByUser = adaptExpressRoute(listRecurringIncomesByUserController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const getRecurringIncomeById = adaptExpressRoute(getRecurringIncomeByIdController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const updateRecurringIncome = adaptExpressRoute(updateRecurringIncomeController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const getMonthlyIncomesByRecurringIncome = adaptExpressRoute(getMonthlyIncomesByRecurringIncomeController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const deleteRecurringIncome = adaptExpressRoute(deleteRecurringIncomeController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
