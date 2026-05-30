import { clearAuthCookies } from "../../../../utils/auth-cookies"
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../../../../config/auth.config"
import { extractRequestContext } from "../../../../utils/request-context"
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  buildHttpRequest,
  withFallbackErrorStatus,
} from "../../express-route.adapter"
import { registerController } from "./register.controller"
import { loginController } from "./login.controller"
import { refreshController } from "./refresh.controller"
import { logoutController } from "./logout.controller"
import { updateMeController } from "./update-me.controller"
import { deleteMeController as deleteMeActionController } from "./delete-me.controller"
import { getMeController as getMeActionController } from "./get-me.controller"

export const register = adaptExpressRoute(
  registerController,
  (req) => buildHttpRequest(req),
  withFallbackErrorStatus(400),
)

export const login = adaptExpressRoute(
  loginController,
  (req) => ({
    ...buildHttpRequest(req),
    context: extractRequestContext(req),
  }),
  withFallbackErrorStatus(401),
)

export const refresh = adaptExpressRoute(
  refreshController,
  (req) => ({
    ...buildHttpRequest(req),
    refreshToken: req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] ?? null,
    context: extractRequestContext(req),
  }),
  withFallbackErrorStatus(401),
  (res) => clearAuthCookies(res),
)

export const logout = adaptExpressRoute(
  logoutController,
  (req) => ({
    ...buildHttpRequest(req),
    refreshToken: req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] ?? null,
    accessToken: req.cookies?.[ACCESS_TOKEN_COOKIE_NAME] ?? null,
    context: extractRequestContext(req),
  }),
  withFallbackErrorStatus(400),
  (res) => clearAuthCookies(res),
)

export const getMe = adaptExpressRoute(
  getMeActionController,
  (req) => buildAuthenticatedHttpRequest(req),
  withFallbackErrorStatus(404),
)

export const updateMe = adaptExpressRoute(
  updateMeController,
  (req) => buildAuthenticatedHttpRequest(req),
  withFallbackErrorStatus(400),
)

export const deleteMe = adaptExpressRoute(
  deleteMeActionController,
  (req) => buildAuthenticatedHttpRequest(req),
  withFallbackErrorStatus(404),
  (res) => clearAuthCookies(res),
)

