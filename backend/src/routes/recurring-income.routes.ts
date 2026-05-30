import { Router } from "express"
import { CreateRecurringIncomeController } from "../interfaces/http/controllers/recurring-income/create.controller";
import { DeleteRecurringIncomeController } from "../interfaces/http/controllers/recurring-income/delete.controller";
import { GetRecurringIncomeByIdController } from "../interfaces/http/controllers/recurring-income/get-by-id.controller";
import { ListRecurringIncomesByUserController } from "../interfaces/http/controllers/recurring-income/list-by-user.controller";
import { ListMonthlyIncomesByRecurringIncomeController } from "../interfaces/http/controllers/recurring-income/list-monthly-incomes.controller";
import { UpdateRecurringIncomeController } from "../interfaces/http/controllers/recurring-income/update.controller";
import {
  CreateRecurringIncomeUseCase,
  DeleteRecurringIncomeUseCase,
  GetRecurringIncomeByIdUseCase,
  ListRecurringIncomeEntriesUseCase,
  ListRecurringIncomesUseCase,
  UpdateRecurringIncomeUseCase,
} from "../application/use-cases/recurring-income.use-cases";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

const createRecurringIncomeController = new CreateRecurringIncomeController(
  new CreateRecurringIncomeUseCase(),
);
const listRecurringIncomesByUserController =
  new ListRecurringIncomesByUserController(new ListRecurringIncomesUseCase());
const getRecurringIncomeByIdController = new GetRecurringIncomeByIdController(
  new GetRecurringIncomeByIdUseCase(),
);
const updateRecurringIncomeController = new UpdateRecurringIncomeController(
  new UpdateRecurringIncomeUseCase(),
);
const listMonthlyIncomesByRecurringIncomeController =
  new ListMonthlyIncomesByRecurringIncomeController(
    new ListRecurringIncomeEntriesUseCase(),
  );
const deleteRecurringIncomeController = new DeleteRecurringIncomeController(
  new DeleteRecurringIncomeUseCase(),
);

router.post(
  "/",
  adaptExpressRoute(
    createRecurringIncomeController.handle.bind(
      createRecurringIncomeController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/user/:userId",
  adaptExpressRoute(
    listRecurringIncomesByUserController.handle.bind(
      listRecurringIncomesByUserController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    getRecurringIncomeByIdController.handle.bind(
      getRecurringIncomeByIdController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    updateRecurringIncomeController.handle.bind(
      updateRecurringIncomeController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/:id/monthly-incomes",
  adaptExpressRoute(
    listMonthlyIncomesByRecurringIncomeController.handle.bind(
      listMonthlyIncomesByRecurringIncomeController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    deleteRecurringIncomeController.handle.bind(
      deleteRecurringIncomeController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

export default router