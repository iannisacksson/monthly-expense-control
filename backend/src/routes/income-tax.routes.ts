import { Router } from "express"
import { CreateIncomeTaxController } from "../interfaces/http/controllers/income-tax/create.controller";
import { DeleteIncomeTaxController } from "../interfaces/http/controllers/income-tax/delete.controller";
import { GetIncomeTaxByIdController } from "../interfaces/http/controllers/income-tax/get-by-id.controller";
import { ListIncomeTaxesByIncomeController } from "../interfaces/http/controllers/income-tax/list-by-income.controller";
import { UpdateIncomeTaxController } from "../interfaces/http/controllers/income-tax/update.controller";
import {
  CreateIncomeTaxUseCase,
  DeleteIncomeTaxUseCase,
  GetIncomeTaxByIdUseCase,
  ListIncomeTaxesUseCase,
  UpdateIncomeTaxUseCase,
} from "../application/use-cases/income-tax.use-cases";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

const createIncomeTaxController = new CreateIncomeTaxController(
  new CreateIncomeTaxUseCase(),
);
const listIncomeTaxesByIncomeController = new ListIncomeTaxesByIncomeController(
  new ListIncomeTaxesUseCase(),
);
const getIncomeTaxByIdController = new GetIncomeTaxByIdController(
  new GetIncomeTaxByIdUseCase(),
);
const updateIncomeTaxController = new UpdateIncomeTaxController(
  new UpdateIncomeTaxUseCase(),
);
const deleteIncomeTaxController = new DeleteIncomeTaxController(
  new DeleteIncomeTaxUseCase(),
);

router.post(
  "/",
  adaptExpressRoute(
    createIncomeTaxController.handle.bind(createIncomeTaxController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/income/:incomeId",
  adaptExpressRoute(
    listIncomeTaxesByIncomeController.handle.bind(
      listIncomeTaxesByIncomeController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    getIncomeTaxByIdController.handle.bind(getIncomeTaxByIdController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    updateIncomeTaxController.handle.bind(updateIncomeTaxController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    deleteIncomeTaxController.handle.bind(deleteIncomeTaxController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

export default router
