import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import authRoutes from "./auth.routes"
import { GetHealthController } from "../interfaces/http/controllers/operational/get-health.controller";
import { GetLivenessController } from "../interfaces/http/controllers/operational/get-liveness.controller";
import { GetMetricsController } from "../interfaces/http/controllers/operational/get-metrics.controller";
import { GetReadinessController } from "../interfaces/http/controllers/operational/get-readiness.controller";
import {
  GetHealthUseCase,
  GetLivenessUseCase,
  GetReadinessUseCase,
} from "../application/use-cases/operational.use-cases";
import {
  adaptExpressRoute,
  buildHttpRequest,
} from "../interfaces/http/express-route.adapter";
import userRoutes from "./user.routes"
import monthRoutes from "./month.routes"
import monthlyIncomeRoutes from "./monthly-income.routes"
import recurringIncomeRoutes from "./recurring-income.routes"
import incomeTaxRoutes from "./income-tax.routes"
import categoryRoutes from "./category.routes"
import subcategoryRoutes from "./subcategory.routes"
import expenseRoutes from "./expense.routes"
import installmentGroupRoutes from "./installment-group.routes"
import recurringExpenseRoutes from "./recurring-expense.routes"
import budgetRoutes from "./budget.routes"

const router = Router()

const getHealthController = new GetHealthController(new GetHealthUseCase());
const getLivenessController = new GetLivenessController(
  new GetLivenessUseCase(),
);
const getMetricsController = new GetMetricsController();
const getReadinessController = new GetReadinessController(
  new GetReadinessUseCase(),
);

router.get(
  "/health",
  adaptExpressRoute(
    getHealthController.handle.bind(getHealthController),
    (req) => buildHttpRequest(req),
  ),
);
router.get(
  "/live",
  adaptExpressRoute(
    getLivenessController.handle.bind(getLivenessController),
    (req) => buildHttpRequest(req),
  ),
);
router.get(
  "/ready",
  adaptExpressRoute(
    getReadinessController.handle.bind(getReadinessController),
    (req) => buildHttpRequest(req),
  ),
);
router.get(
  "/metrics",
  adaptExpressRoute(
    getMetricsController.handle.bind(getMetricsController),
    (req) => buildHttpRequest(req),
  ),
);

router.use("/auth", authRoutes)

// All routes below require a valid JWT token
router.use(authMiddleware)

router.use("/users", userRoutes)
router.use("/months", monthRoutes)
router.use("/monthly-incomes", monthlyIncomeRoutes)
router.use("/recurring-incomes", recurringIncomeRoutes)
router.use("/income-taxes", incomeTaxRoutes)
router.use("/categories", categoryRoutes)
router.use("/subcategories", subcategoryRoutes)
router.use("/expenses", expenseRoutes)
router.use("/installment-groups", installmentGroupRoutes)
router.use("/recurring-expenses", recurringExpenseRoutes)
router.use("/budgets", budgetRoutes)

export default router
