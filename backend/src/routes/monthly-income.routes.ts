import { Router } from "express"
import { DeleteMonthlyIncomeController } from "../interfaces/http/controllers/monthly-income/delete.controller";
import { GetMonthlyIncomeByIdController } from "../interfaces/http/controllers/monthly-income/get-by-id.controller";
import { ListMonthlyIncomesByMonthController } from "../interfaces/http/controllers/monthly-income/list-by-month.controller";
import { RegisterMonthlyIncomeController } from "../interfaces/http/controllers/monthly-income/register.controller";
import { UpdateMonthlyIncomeController } from "../interfaces/http/controllers/monthly-income/update.controller";
import { DeleteMonthlyIncomeUseCase } from "../application/use-cases/monthly-income/delete.use-case";
import { GetMonthlyIncomeByIdUseCase } from "../application/use-cases/monthly-income/get-by-id.use-case";
import { ListMonthlyIncomesByMonthUseCase } from "../application/use-cases/monthly-income/list-by-month.use-case";
import { RegisterMonthlyIncomeUseCase } from "../application/use-cases/monthly-income/register.use-case";
import { UpdateMonthlyIncomeUseCase } from "../application/use-cases/monthly-income/update.use-case";
import { MonthlyIncomeRepository } from "../repositories/monthly-income.repository";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

const monthlyIncomeRepository = new MonthlyIncomeRepository();

const registerMonthlyIncomeController = new RegisterMonthlyIncomeController(
  new RegisterMonthlyIncomeUseCase(monthlyIncomeRepository),
);
const listMonthlyIncomesByMonthController =
  new ListMonthlyIncomesByMonthController(
    new ListMonthlyIncomesByMonthUseCase(monthlyIncomeRepository),
  );
const getMonthlyIncomeByIdController = new GetMonthlyIncomeByIdController(
  new GetMonthlyIncomeByIdUseCase(monthlyIncomeRepository),
);
const updateMonthlyIncomeController = new UpdateMonthlyIncomeController(
  new UpdateMonthlyIncomeUseCase(monthlyIncomeRepository),
);
const deleteMonthlyIncomeController = new DeleteMonthlyIncomeController(
  new DeleteMonthlyIncomeUseCase(monthlyIncomeRepository),
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
