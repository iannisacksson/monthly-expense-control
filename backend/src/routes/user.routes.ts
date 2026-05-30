import { Router } from "express"
import { CreateUserController } from "../interfaces/http/controllers/user/create.controller";
import { DeleteUserController } from "../interfaces/http/controllers/user/delete.controller";
import { GetUserByIdController } from "../interfaces/http/controllers/user/get-by-id.controller";
import { UpdateUserController } from "../interfaces/http/controllers/user/update.controller";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "../application/use-cases/user.use-cases";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

const createUserController = new CreateUserController(new CreateUserUseCase());
const getUserByIdController = new GetUserByIdController(
  new GetUserByIdUseCase(),
);
const updateUserController = new UpdateUserController(new UpdateUserUseCase());
const deleteUserController = new DeleteUserController(new DeleteUserUseCase());

router.post(
  "/",
  adaptExpressRoute(
    createUserController.handle.bind(createUserController),
    (req) => buildHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    getUserByIdController.handle.bind(getUserByIdController),
    (req) => buildHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    updateUserController.handle.bind(updateUserController),
    (req) => buildHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    deleteUserController.handle.bind(deleteUserController),
    (req) => buildHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

export default router
