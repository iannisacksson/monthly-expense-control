import { Router } from "express"
import { BulkDeleteExpensesController } from "../interfaces/http/controllers/expense/bulk-delete.controller";
import { BulkMarkExpensesPaidController } from "../interfaces/http/controllers/expense/bulk-mark-paid.controller";
import { CreateExpenseController } from "../interfaces/http/controllers/expense/create.controller";
import { CreateExpenseItemController } from "../interfaces/http/controllers/expense/create-item.controller";
import { DeleteExpenseController } from "../interfaces/http/controllers/expense/delete.controller";
import { DeleteExpenseItemController } from "../interfaces/http/controllers/expense/delete-item.controller";
import { GetExpenseByIdController } from "../interfaces/http/controllers/expense/get-by-id.controller";
import { ListExpenseAdjustmentsController } from "../interfaces/http/controllers/expense/list-adjustments.controller";
import { ListExpensesByUserAndMonthController } from "../interfaces/http/controllers/expense/list-by-user-and-month.controller";
import { ListExpenseItemsController } from "../interfaces/http/controllers/expense/list-items.controller";
import { UpdateExpenseController } from "../interfaces/http/controllers/expense/update.controller";
import { UpdateExpenseItemController } from "../interfaces/http/controllers/expense/update-item.controller";
import {
  BulkDeleteExpensesUseCase,
  BulkMarkExpensesPaidUseCase,
  CreateExpenseItemUseCase,
  CreateExpenseUseCase,
  DeleteExpenseItemUseCase,
  DeleteExpenseUseCase,
  GetExpenseByIdUseCase,
  ListExpenseAdjustmentsUseCase,
  ListExpenseItemsUseCase,
  ListExpensesByMonthUseCase,
  UpdateExpenseItemUseCase,
  UpdateExpenseUseCase,
} from "../application/use-cases/expense.use-cases";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

const createExpenseController = new CreateExpenseController(
  new CreateExpenseUseCase(),
);
const listExpensesByUserAndMonthController =
  new ListExpensesByUserAndMonthController(new ListExpensesByMonthUseCase());
const getExpenseByIdController = new GetExpenseByIdController(
  new GetExpenseByIdUseCase(),
);
const listExpenseAdjustmentsController = new ListExpenseAdjustmentsController(
  new ListExpenseAdjustmentsUseCase(),
);
const listExpenseItemsController = new ListExpenseItemsController(
  new ListExpenseItemsUseCase(),
);
const createExpenseItemController = new CreateExpenseItemController(
  new CreateExpenseItemUseCase(),
);
const updateExpenseItemController = new UpdateExpenseItemController(
  new UpdateExpenseItemUseCase(),
);
const deleteExpenseItemController = new DeleteExpenseItemController(
  new DeleteExpenseItemUseCase(),
);
const updateExpenseController = new UpdateExpenseController(
  new UpdateExpenseUseCase(),
);
const deleteExpenseController = new DeleteExpenseController(
  new DeleteExpenseUseCase(),
);
const bulkDeleteExpensesController = new BulkDeleteExpensesController(
  new BulkDeleteExpensesUseCase(),
);
const bulkMarkExpensesPaidController = new BulkMarkExpensesPaidController(
  new BulkMarkExpensesPaidUseCase(),
);

router.post(
  "/",
  adaptExpressRoute(
    createExpenseController.handle.bind(createExpenseController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.post(
  "/bulk-delete",
  adaptExpressRoute(
    bulkDeleteExpensesController.handle.bind(bulkDeleteExpensesController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.post(
  "/bulk-mark-paid",
  adaptExpressRoute(
    bulkMarkExpensesPaidController.handle.bind(bulkMarkExpensesPaidController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/user/:userId/month/:monthId",
  adaptExpressRoute(
    listExpensesByUserAndMonthController.handle.bind(
      listExpensesByUserAndMonthController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/:id/adjustments",
  adaptExpressRoute(
    listExpenseAdjustmentsController.handle.bind(
      listExpenseAdjustmentsController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.get(
  "/:id/items",
  adaptExpressRoute(
    listExpenseItemsController.handle.bind(listExpenseItemsController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.post(
  "/:id/items",
  adaptExpressRoute(
    createExpenseItemController.handle.bind(createExpenseItemController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.put(
  "/items/:itemId",
  adaptExpressRoute(
    updateExpenseItemController.handle.bind(updateExpenseItemController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/items/:itemId",
  adaptExpressRoute(
    deleteExpenseItemController.handle.bind(deleteExpenseItemController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    getExpenseByIdController.handle.bind(getExpenseByIdController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    updateExpenseController.handle.bind(updateExpenseController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    deleteExpenseController.handle.bind(deleteExpenseController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

export default router
