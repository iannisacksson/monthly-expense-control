import { adaptExpressRoute, buildAuthenticatedHttpRequest, withFallbackErrorStatus } from "../../express-route.adapter"
import { bulkDeleteExpensesController } from "./bulk-delete.controller"
import { bulkMarkExpensesPaidController } from "./bulk-mark-paid.controller"
import { createExpenseController } from "./create.controller"
import { createExpenseItemController } from "./create-item.controller"
import { deleteExpenseController } from "./delete.controller"
import { deleteExpenseItemController } from "./delete-item.controller"
import { getExpenseByIdController } from "./get-by-id.controller"
import { listExpenseAdjustmentsController } from "./list-adjustments.controller"
import { listExpenseItemsController } from "./list-items.controller"
import { listExpensesByUserAndMonthController } from "./list-by-user-and-month.controller"
import { updateExpenseController } from "./update.controller"
import { updateExpenseItemController } from "./update-item.controller"

export const createExpense = adaptExpressRoute(createExpenseController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const listExpensesByUserAndMonth = adaptExpressRoute(listExpensesByUserAndMonthController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const getExpenseById = adaptExpressRoute(getExpenseByIdController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const listExpenseAdjustments = adaptExpressRoute(listExpenseAdjustmentsController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const listExpenseItems = adaptExpressRoute(listExpenseItemsController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const createExpenseItem = adaptExpressRoute(createExpenseItemController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const updateExpenseItem = adaptExpressRoute(updateExpenseItemController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const deleteExpenseItem = adaptExpressRoute(deleteExpenseItemController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const updateExpense = adaptExpressRoute(updateExpenseController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const deleteExpense = adaptExpressRoute(deleteExpenseController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const bulkDeleteExpenses = adaptExpressRoute(bulkDeleteExpensesController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const bulkMarkExpensesPaid = adaptExpressRoute(bulkMarkExpensesPaidController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
