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
import { getHealth, getLiveness, getMetrics, getReadiness } from "../controllers/operational.controller"

const router = Router()

router.get("/health", getHealth)
router.get("/live", getLiveness)
router.get("/ready", getReadiness)
router.get("/metrics", getMetrics)

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