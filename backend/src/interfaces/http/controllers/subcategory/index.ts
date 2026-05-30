import { adaptExpressRoute, buildAuthenticatedHttpRequest, withFallbackErrorStatus } from "../../express-route.adapter"
import { createSubcategoryController } from "./create.controller"
import { deleteSubcategoryController } from "./delete.controller"
import { getSubcategoryByIdController } from "./get-by-id.controller"
import { listSubcategoriesByCategoryController } from "./list-by-category.controller"
import { updateSubcategoryController } from "./update.controller"

export const createSubcategory = adaptExpressRoute(createSubcategoryController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const listSubcategoriesByCategory = adaptExpressRoute(listSubcategoriesByCategoryController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(500))
export const getSubcategoryById = adaptExpressRoute(getSubcategoryByIdController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
export const updateSubcategory = adaptExpressRoute(updateSubcategoryController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(400))
export const deleteSubcategory = adaptExpressRoute(deleteSubcategoryController, (req) => buildAuthenticatedHttpRequest(req), withFallbackErrorStatus(404))
