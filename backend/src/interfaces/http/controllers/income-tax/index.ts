import { adaptExpressRoute, buildAuthenticatedHttpRequest, withFallbackErrorStatus } from "../../express-route.adapter"
import { createTaxController } from "./create.controller"
import { deleteTaxController } from "./delete.controller"
import { getTaxByIdController } from "./get-by-id.controller"
import { listTaxesByIncomeController } from "./list-by-income.controller"
import { updateTaxController } from "./update.controller"

export const createTax = adaptExpressRoute(createTaxController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const listTaxesByIncome = adaptExpressRoute(listTaxesByIncomeController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const getTaxById = adaptExpressRoute(getTaxByIdController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const updateTax = adaptExpressRoute(updateTaxController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const deleteTax = adaptExpressRoute(deleteTaxController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
