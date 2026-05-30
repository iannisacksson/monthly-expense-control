import { Router } from "express"
import { DeleteMeController } from "../interfaces/http/controllers/auth/delete-me.controller";
import { GetMeController } from "../interfaces/http/controllers/auth/get-me.controller";
import { LoginController } from "../interfaces/http/controllers/auth/login.controller";
import { LogoutController } from "../interfaces/http/controllers/auth/logout.controller";
import { RefreshController } from "../interfaces/http/controllers/auth/refresh.controller";
import { RegisterController } from "../interfaces/http/controllers/auth/register.controller";
import { UpdateMeController } from "../interfaces/http/controllers/auth/update-me.controller";
import {
  DeleteAuthenticatedProfileUseCase,
  GetAuthenticatedProfileUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  ReadSessionIdFromAccessTokenUseCase,
  RefreshSessionUseCase,
  RegisterUserUseCase,
  UpdateAuthenticatedProfileUseCase,
} from "../application/use-cases/auth.use-cases";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../config/auth.config";
import { clearAuthCookies } from "../utils/auth-cookies";
import { extractRequestContext } from "../utils/request-context";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  buildHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";
import { authMiddleware } from "../middlewares/auth.middleware"
import { loginRateLimit, refreshRateLimit } from "../middlewares/rate-limit.middleware"

const router = Router()

const registerController = new RegisterController(new RegisterUserUseCase());
const loginController = new LoginController(new LoginUserUseCase());
const refreshController = new RefreshController(new RefreshSessionUseCase());
const logoutController = new LogoutController(
  new LogoutUserUseCase(),
  new ReadSessionIdFromAccessTokenUseCase(),
);
const getMeController = new GetMeController(
  new GetAuthenticatedProfileUseCase(),
);
const updateMeController = new UpdateMeController(
  new UpdateAuthenticatedProfileUseCase(),
);
const deleteMeController = new DeleteMeController(
  new DeleteAuthenticatedProfileUseCase(),
);

router.post(
  "/register",
  adaptExpressRoute(
    registerController.handle.bind(registerController),
    (req) => buildHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);

router.post(
  "/login",
  loginRateLimit,
  adaptExpressRoute(
    loginController.handle.bind(loginController),
    (req) => ({
      ...buildHttpRequest(req),
      context: extractRequestContext(req),
    }),
    withFallbackErrorStatus(HttpStatusCode.UNAUTHORIZED),
  ),
);

router.post(
  "/refresh",
  refreshRateLimit,
  adaptExpressRoute(
    refreshController.handle.bind(refreshController),
    (req) => ({
      ...buildHttpRequest(req),
      refreshToken: req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] ?? null,
      context: extractRequestContext(req),
    }),
    withFallbackErrorStatus(HttpStatusCode.UNAUTHORIZED),
    (res) => clearAuthCookies(res),
  ),
);

router.post(
  "/logout",
  adaptExpressRoute(
    logoutController.handle.bind(logoutController),
    (req) => ({
      ...buildHttpRequest(req),
      refreshToken: req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] ?? null,
      accessToken: req.cookies?.[ACCESS_TOKEN_COOKIE_NAME] ?? null,
      context: extractRequestContext(req),
    }),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
    (res) => clearAuthCookies(res),
  ),
);

router.get(
  "/me",
  authMiddleware,
  adaptExpressRoute(
    getMeController.handle.bind(getMeController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

router.put(
  "/me",
  authMiddleware,
  adaptExpressRoute(
    updateMeController.handle.bind(updateMeController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);

router.delete(
  "/me",
  authMiddleware,
  adaptExpressRoute(
    deleteMeController.handle.bind(deleteMeController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
    (res) => clearAuthCookies(res),
  ),
);

export default router
