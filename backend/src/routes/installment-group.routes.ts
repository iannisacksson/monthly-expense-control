import { Router } from "express"
import { CreateInstallmentGroupController } from "../interfaces/http/controllers/installment-group/create.controller";
import { DeleteInstallmentGroupController } from "../interfaces/http/controllers/installment-group/delete.controller";
import { GetInstallmentGroupByIdController } from "../interfaces/http/controllers/installment-group/get-by-id.controller";
import { ListInstallmentGroupsByUserController } from "../interfaces/http/controllers/installment-group/list-by-user.controller";
import { ListExpensesByInstallmentGroupController } from "../interfaces/http/controllers/installment-group/list-expenses.controller";
import { RestoreInstallmentOccurrenceController } from "../interfaces/http/controllers/installment-group/restore-occurrence.controller";
import { UpdateInstallmentGroupController } from "../interfaces/http/controllers/installment-group/update.controller";
import {
  CreateInstallmentGroupUseCase,
  DeleteInstallmentGroupUseCase,
  GetInstallmentGroupByIdUseCase,
  ListInstallmentGroupExpensesUseCase,
  ListInstallmentGroupsUseCase,
  RestoreInstallmentOccurrenceUseCase,
  UpdateInstallmentGroupUseCase,
} from "../application/use-cases/installment-group.use-cases";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router()

const createInstallmentGroupController = new CreateInstallmentGroupController(
  new CreateInstallmentGroupUseCase(),
);
const listInstallmentGroupsByUserController =
  new ListInstallmentGroupsByUserController(new ListInstallmentGroupsUseCase());
const getInstallmentGroupByIdController = new GetInstallmentGroupByIdController(
  new GetInstallmentGroupByIdUseCase(),
);
const updateInstallmentGroupController = new UpdateInstallmentGroupController(
  new UpdateInstallmentGroupUseCase(),
);
const restoreInstallmentOccurrenceController =
  new RestoreInstallmentOccurrenceController(
    new RestoreInstallmentOccurrenceUseCase(),
  );
const listExpensesByInstallmentGroupController =
  new ListExpensesByInstallmentGroupController(
    new ListInstallmentGroupExpensesUseCase(),
  );
const deleteInstallmentGroupController = new DeleteInstallmentGroupController(
  new DeleteInstallmentGroupUseCase(),
);

router.post(
  "/",
  adaptExpressRoute(
    createInstallmentGroupController.handle.bind(
      createInstallmentGroupController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/user/:userId",
  adaptExpressRoute(
    listInstallmentGroupsByUserController.handle.bind(
      listInstallmentGroupsByUserController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/:id",
  adaptExpressRoute(
    getInstallmentGroupByIdController.handle.bind(
      getInstallmentGroupByIdController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/:id",
  adaptExpressRoute(
    updateInstallmentGroupController.handle.bind(
      updateInstallmentGroupController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.post(
  "/:id/restore-occurrence",
  adaptExpressRoute(
    restoreInstallmentOccurrenceController.handle.bind(
      restoreInstallmentOccurrenceController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/:id/expenses",
  adaptExpressRoute(
    listExpensesByInstallmentGroupController.handle.bind(
      listExpensesByInstallmentGroupController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.delete(
  "/:id",
  adaptExpressRoute(
    deleteInstallmentGroupController.handle.bind(
      deleteInstallmentGroupController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);

export default router
