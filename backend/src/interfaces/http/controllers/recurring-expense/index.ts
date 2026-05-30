import { adaptExpressRoute, buildAuthenticatedHttpRequest, withFallbackErrorStatus } from "../../express-route.adapter"
import { createRecurringExpenseController } from "./create.controller"
import { listRecurringExpensesByUserController } from "./list-by-user.controller"
import { getRecurringExpenseByIdController } from "./get-by-id.controller"
import { updateRecurringExpenseController } from "./update.controller"
import { restoreRecurringExpenseOccurrenceController } from "./restore-occurrence.controller"
import { getExpensesByRecurringExpenseController } from "./list-expenses.controller"
import { deleteRecurringExpenseController } from "./delete.controller"

export const createRecurringExpense = adaptExpressRoute(createRecurringExpenseController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const listRecurringExpensesByUser = adaptExpressRoute(listRecurringExpensesByUserController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const getRecurringExpenseById = adaptExpressRoute(getRecurringExpenseByIdController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const updateRecurringExpense = adaptExpressRoute(updateRecurringExpenseController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const restoreRecurringExpenseOccurrence = adaptExpressRoute(restoreRecurringExpenseOccurrenceController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const getExpensesByRecurringExpense = adaptExpressRoute(getExpensesByRecurringExpenseController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const deleteRecurringExpense = adaptExpressRoute(deleteRecurringExpenseController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))

