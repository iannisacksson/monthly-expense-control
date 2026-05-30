import { adaptExpressRoute, buildAuthenticatedHttpRequest, withFallbackErrorStatus } from "../../express-route.adapter"
import { createInstallmentPurchaseController } from "./create.controller"
import { listInstallmentGroupsByUserController } from "./list-by-user.controller"
import { getInstallmentGroupByIdController } from "./get-by-id.controller"
import { getExpensesByInstallmentGroupController } from "./list-expenses.controller"
import { updateInstallmentGroupController } from "./update.controller"
import { restoreInstallmentOccurrenceController } from "./restore-occurrence.controller"
import { deleteInstallmentGroupController } from "./delete.controller"

export const createInstallmentPurchase = adaptExpressRoute(createInstallmentPurchaseController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const listInstallmentGroupsByUser = adaptExpressRoute(listInstallmentGroupsByUserController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const getInstallmentGroupById = adaptExpressRoute(getInstallmentGroupByIdController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const getExpensesByInstallmentGroup = adaptExpressRoute(getExpensesByInstallmentGroupController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const updateInstallmentGroup = adaptExpressRoute(updateInstallmentGroupController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const restoreInstallmentOccurrence = adaptExpressRoute(restoreInstallmentOccurrenceController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const deleteInstallmentGroup = adaptExpressRoute(deleteInstallmentGroupController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
