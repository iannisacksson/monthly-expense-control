import { Router } from "express"
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";
import { CreateMonthController } from "../interfaces/http/controllers/month/create.controller";
import { DeleteMonthController } from "../interfaces/http/controllers/month/delete.controller";
import { FinalizeMonthController } from "../interfaces/http/controllers/month/finalize.controller";
import { GetMonthByIdController } from "../interfaces/http/controllers/month/get-by-id.controller";
import { ListMonthsByUserController } from "../interfaces/http/controllers/month/list-by-user.controller";
import { UpdateMonthController } from "../interfaces/http/controllers/month/update.controller";
import {
  CreateMonthUseCase,
  DeleteMonthUseCase,
  FinalizeMonthUseCase,
  GetMonthByIdUseCase,
  ListMonthsUseCase,
  UpdateMonthUseCase,
} from "../application/use-cases/month.use-cases";
import { HttpStatusCode } from "../interfaces/http/http-status-code";

const createMonthController = new CreateMonthController(
  new CreateMonthUseCase(),
);
const deleteMonthController = new DeleteMonthController(
  new DeleteMonthUseCase(),
);
const finalizeMonthController = new FinalizeMonthController(
  new FinalizeMonthUseCase(),
);
const getMonthByIdController = new GetMonthByIdController(
  new GetMonthByIdUseCase(),
);
const listMonthsByUserController = new ListMonthsByUserController(
  new ListMonthsUseCase(),
);
const updateMonthController = new UpdateMonthController(
  new UpdateMonthUseCase(),
);

const router = Router()

router.post(
  "/",
  adaptExpressRoute(
    createMonthController.handle.bind(createMonthController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/user/:userId",
  adaptExpressRoute(
    listMonthsByUserController.handle.bind(listMonthsByUserController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    getMonthByIdController.handle.bind(getMonthByIdController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.patch(
  "/:id/finalize",
  adaptExpressRoute(
    finalizeMonthController.handle.bind(finalizeMonthController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    updateMonthController.handle.bind(updateMonthController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    deleteMonthController.handle.bind(deleteMonthController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND, {
      "Month deletion is not allowed": HttpStatusCode.METHOD_NOT_ALLOWED,
    }),
  ),
);

export default router
