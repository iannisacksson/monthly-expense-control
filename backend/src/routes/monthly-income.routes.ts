import { Router } from "express"
import { DeleteMonthlyIncomeController } from "../interfaces/http/controllers/monthly-income/delete.controller";
import { GetMonthlyIncomeByIdController } from "../interfaces/http/controllers/monthly-income/get-by-id.controller";
import { ListMonthlyIncomesByMonthController } from "../interfaces/http/controllers/monthly-income/list-by-month.controller";
import { RegisterMonthlyIncomeController } from "../interfaces/http/controllers/monthly-income/register.controller";
import { UpdateMonthlyIncomeController } from "../interfaces/http/controllers/monthly-income/update.controller";
import {
  DeleteMonthlyIncomeUseCase,
  GetMonthlyIncomeByIdUseCase,
  ListMonthlyIncomesUseCase,
  RegisterMonthlyIncomeUseCase,
  UpdateMonthlyIncomeUseCase,
} from "../application/use-cases/monthly-income.use-cases";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

const registerMonthlyIncomeController = new RegisterMonthlyIncomeController(
  new RegisterMonthlyIncomeUseCase(),
);
const listMonthlyIncomesByMonthController =
  new ListMonthlyIncomesByMonthController(new ListMonthlyIncomesUseCase());
const getMonthlyIncomeByIdController = new GetMonthlyIncomeByIdController(
  new GetMonthlyIncomeByIdUseCase(),
);
const updateMonthlyIncomeController = new UpdateMonthlyIncomeController(
  new UpdateMonthlyIncomeUseCase(),
);
const deleteMonthlyIncomeController = new DeleteMonthlyIncomeController(
  new DeleteMonthlyIncomeUseCase(),
);

router.post(
  "/",
  adaptExpressRoute(
    registerMonthlyIncomeController.handle.bind(
      registerMonthlyIncomeController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/month/:monthId",
  adaptExpressRoute(
    listMonthlyIncomesByMonthController.handle.bind(
      listMonthlyIncomesByMonthController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    getMonthlyIncomeByIdController.handle.bind(getMonthlyIncomeByIdController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    updateMonthlyIncomeController.handle.bind(updateMonthlyIncomeController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    deleteMonthlyIncomeController.handle.bind(deleteMonthlyIncomeController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

export default router
