import { Router } from "express"
import { authMiddleware } from "../../../middlewares/auth.middleware"
import authRoutes from "../../../routes/auth.routes"
import userRoutes from "../../../routes/user.routes"
import monthRoutes from "../../../routes/month.routes"
import monthlyIncomeRoutes from "../../../routes/monthly-income.routes"
import recurringIncomeRoutes from "../../../routes/recurring-income.routes"
import incomeTaxRoutes from "../../../routes/income-tax.routes"
import categoryRoutes from "../../../routes/category.routes"
import subcategoryRoutes from "../../../routes/subcategory.routes"
import expenseRoutes from "../../../routes/expense.routes"
import installmentGroupRoutes from "../../../routes/installment-group.routes"
import recurringExpenseRoutes from "../../../routes/recurring-expense.routes"
import budgetRoutes from "../../../routes/budget.routes"
import { GetHealthController } from "../controllers/operational/get-health.controller";
import { GetLivenessController } from "../controllers/operational/get-liveness.controller";
import { GetMetricsController } from "../controllers/operational/get-metrics.controller";
import { GetReadinessController } from "../controllers/operational/get-readiness.controller";
import {
  GetHealthUseCase,
  GetLivenessUseCase,
  GetReadinessUseCase,
} from "../../../application/use-cases/operational.use-cases";
import { adaptExpressRoute, buildHttpRequest } from "../express-route.adapter";

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