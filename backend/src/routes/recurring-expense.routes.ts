import { Router } from "express"
import { CreateRecurringExpenseController } from "../interfaces/http/controllers/recurring-expense/create.controller";
import { DeleteRecurringExpenseController } from "../interfaces/http/controllers/recurring-expense/delete.controller";
import { GetRecurringExpenseByIdController } from "../interfaces/http/controllers/recurring-expense/get-by-id.controller";
import { ListRecurringExpensesByUserController } from "../interfaces/http/controllers/recurring-expense/list-by-user.controller";
import { ListExpensesByRecurringExpenseController } from "../interfaces/http/controllers/recurring-expense/list-expenses.controller";
import { RestoreRecurringExpenseOccurrenceController } from "../interfaces/http/controllers/recurring-expense/restore-occurrence.controller";
import { UpdateRecurringExpenseController } from "../interfaces/http/controllers/recurring-expense/update.controller";
import {
  CreateRecurringExpenseUseCase,
  DeleteRecurringExpenseUseCase,
  GetRecurringExpenseByIdUseCase,
  ListRecurringExpenseEntriesUseCase,
  ListRecurringExpensesUseCase,
  RestoreRecurringExpenseOccurrenceUseCase,
  UpdateRecurringExpenseUseCase,
} from "../application/use-cases/recurring-expense.use-cases";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

const createRecurringExpenseController = new CreateRecurringExpenseController(
  new CreateRecurringExpenseUseCase(),
);
const listRecurringExpensesByUserController =
  new ListRecurringExpensesByUserController(new ListRecurringExpensesUseCase());
const getRecurringExpenseByIdController = new GetRecurringExpenseByIdController(
  new GetRecurringExpenseByIdUseCase(),
);
const updateRecurringExpenseController = new UpdateRecurringExpenseController(
  new UpdateRecurringExpenseUseCase(),
);
const restoreRecurringExpenseOccurrenceController =
  new RestoreRecurringExpenseOccurrenceController(
    new RestoreRecurringExpenseOccurrenceUseCase(),
  );
const listExpensesByRecurringExpenseController =
  new ListExpensesByRecurringExpenseController(
    new ListRecurringExpenseEntriesUseCase(),
  );
const deleteRecurringExpenseController = new DeleteRecurringExpenseController(
  new DeleteRecurringExpenseUseCase(),
);

router.post(
  "/",
  adaptExpressRoute(
    createRecurringExpenseController.handle.bind(
      createRecurringExpenseController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/user/:userId",
  adaptExpressRoute(
    listRecurringExpensesByUserController.handle.bind(
      listRecurringExpensesByUserController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    getRecurringExpenseByIdController.handle.bind(
      getRecurringExpenseByIdController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    updateRecurringExpenseController.handle.bind(
      updateRecurringExpenseController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.post(
  "/:id/restore-occurrence",
  adaptExpressRoute(
    restoreRecurringExpenseOccurrenceController.handle.bind(
      restoreRecurringExpenseOccurrenceController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/:id/expenses",
  adaptExpressRoute(
    listExpensesByRecurringExpenseController.handle.bind(
      listExpensesByRecurringExpenseController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    deleteRecurringExpenseController.handle.bind(
      deleteRecurringExpenseController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);

export default router