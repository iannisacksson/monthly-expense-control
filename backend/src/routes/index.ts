import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import authRoutes from "./auth.routes"
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

router.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

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
