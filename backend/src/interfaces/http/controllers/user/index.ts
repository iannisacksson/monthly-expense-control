import { adaptExpressRoute, buildHttpRequest, withFallbackErrorStatus } from "../../express-route.adapter"
import { createUserController } from "./create.controller"
import { deleteUserController } from "./delete.controller"
import { getUserByIdController } from "./get-by-id.controller"
import { updateUserController } from "./update.controller"

export const createUser = adaptExpressRoute(createUserController, (req) => buildHttpRequest(req), withFallbackErrorStatus(400))
export const getUserById = adaptExpressRoute(getUserByIdController, (req) => buildHttpRequest(req), withFallbackErrorStatus(404))
export const updateUser = adaptExpressRoute(updateUserController, (req) => buildHttpRequest(req), withFallbackErrorStatus(400))
export const deleteUser = adaptExpressRoute(deleteUserController, (req) => buildHttpRequest(req), withFallbackErrorStatus(404))
