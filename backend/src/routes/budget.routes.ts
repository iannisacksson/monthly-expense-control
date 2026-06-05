import { Router } from "express";
import { CreateBudgetAllocationController } from "../interfaces/http/controllers/budget/create-allocation.controller";
import { CreateBudgetRuleController } from "../interfaces/http/controllers/budget/create-rule.controller";
import { DeleteBudgetAllocationController } from "../interfaces/http/controllers/budget/delete-allocation.controller";
import { DeleteBudgetRuleController } from "../interfaces/http/controllers/budget/delete-rule.controller";
import { GetBudgetRuleByIdController } from "../interfaces/http/controllers/budget/get-rule-by-id.controller";
import { ListBudgetAllocationsByRuleController } from "../interfaces/http/controllers/budget/list-allocations-by-rule.controller";
import { ListBudgetRulesByUserController } from "../interfaces/http/controllers/budget/list-rules-by-user.controller";
import { UpdateBudgetAllocationController } from "../interfaces/http/controllers/budget/update-allocation.controller";
import { UpdateBudgetRuleController } from "../interfaces/http/controllers/budget/update-rule.controller";
import {
  CreateBudgetAllocationUseCase,
  CreateBudgetRuleUseCase,
  DeleteBudgetAllocationUseCase,
  DeleteBudgetRuleUseCase,
  GetBudgetRuleByIdUseCase,
  ListBudgetAllocationsUseCase,
  ListBudgetRulesUseCase,
  UpdateBudgetAllocationUseCase,
  UpdateBudgetRuleUseCase,
} from "../application/use-cases/budget-rule/budget.use-cases";
import { HttpStatusCode } from "../interfaces/http/http-status-code";
import {
  adaptExpressRoute,
  buildAuthenticatedHttpRequest,
  withFallbackErrorStatus,
} from "../interfaces/http/express-route.adapter";

const router = Router();

const createBudgetRuleController = new CreateBudgetRuleController(
  new CreateBudgetRuleUseCase(),
);
const listBudgetRulesByUserController = new ListBudgetRulesByUserController(
  new ListBudgetRulesUseCase(),
);
const getBudgetRuleByIdController = new GetBudgetRuleByIdController(
  new GetBudgetRuleByIdUseCase(),
);
const updateBudgetRuleController = new UpdateBudgetRuleController(
  new UpdateBudgetRuleUseCase(),
);
const deleteBudgetRuleController = new DeleteBudgetRuleController(
  new DeleteBudgetRuleUseCase(),
);
const createBudgetAllocationController = new CreateBudgetAllocationController(
  new CreateBudgetAllocationUseCase(),
);
const listBudgetAllocationsByRuleController =
  new ListBudgetAllocationsByRuleController(new ListBudgetAllocationsUseCase());
const updateBudgetAllocationController = new UpdateBudgetAllocationController(
  new UpdateBudgetAllocationUseCase(),
);
const deleteBudgetAllocationController = new DeleteBudgetAllocationController(
  new DeleteBudgetAllocationUseCase(),
);

router.post(
  "/rules",
  adaptExpressRoute(
    createBudgetRuleController.handle.bind(createBudgetRuleController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/rules/user/:userId",
  adaptExpressRoute(
    listBudgetRulesByUserController.handle.bind(
      listBudgetRulesByUserController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.get(
  "/rules/:id",
  adaptExpressRoute(
    getBudgetRuleByIdController.handle.bind(getBudgetRuleByIdController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);
router.put(
  "/rules/:id",
  adaptExpressRoute(
    updateBudgetRuleController.handle.bind(updateBudgetRuleController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/rules/:id",
  adaptExpressRoute(
    deleteBudgetRuleController.handle.bind(deleteBudgetRuleController),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

router.post(
  "/allocations",
  adaptExpressRoute(
    createBudgetAllocationController.handle.bind(
      createBudgetAllocationController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.get(
  "/allocations/rule/:ruleId",
  adaptExpressRoute(
    listBudgetAllocationsByRuleController.handle.bind(
      listBudgetAllocationsByRuleController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
  ),
);
router.put(
  "/allocations/:id",
  adaptExpressRoute(
    updateBudgetAllocationController.handle.bind(
      updateBudgetAllocationController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.BAD_REQUEST),
  ),
);
router.delete(
  "/allocations/:id",
  adaptExpressRoute(
    deleteBudgetAllocationController.handle.bind(
      deleteBudgetAllocationController,
    ),
    (req) => buildAuthenticatedHttpRequest(req),
    withFallbackErrorStatus(HttpStatusCode.NOT_FOUND),
  ),
);

export default router;
