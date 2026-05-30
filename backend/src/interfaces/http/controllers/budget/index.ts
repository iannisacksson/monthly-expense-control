import { adaptExpressRoute, buildAuthenticatedHttpRequest, withFallbackErrorStatus } from "../../express-route.adapter"
import { createBudgetRuleController } from "./create-rule.controller"
import { listBudgetRulesByUserController } from "./list-rules-by-user.controller"
import { getBudgetRuleByIdController } from "./get-rule-by-id.controller"
import { updateBudgetRuleController } from "./update-rule.controller"
import { deleteBudgetRuleController } from "./delete-rule.controller"
import { createAllocationController } from "./create-allocation.controller"
import { listAllocationsByRuleController } from "./list-allocations-by-rule.controller"
import { updateAllocationController } from "./update-allocation.controller"
import { deleteAllocationController } from "./delete-allocation.controller"

export const createBudgetRule = adaptExpressRoute(createBudgetRuleController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const listBudgetRulesByUser = adaptExpressRoute(listBudgetRulesByUserController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const getBudgetRuleById = adaptExpressRoute(getBudgetRuleByIdController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const updateBudgetRule = adaptExpressRoute(updateBudgetRuleController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const deleteBudgetRule = adaptExpressRoute(deleteBudgetRuleController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const createAllocation = adaptExpressRoute(createAllocationController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const listAllocationsByRule = adaptExpressRoute(listAllocationsByRuleController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const updateAllocation = adaptExpressRoute(updateAllocationController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const deleteAllocation = adaptExpressRoute(deleteAllocationController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
