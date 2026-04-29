import { Router } from "express"
import userRoutes from "./user.routes"
import familyRoutes from "./family.routes"
import familyMemberRoutes from "./family-member.routes"
import monthRoutes from "./month.routes"
import monthlyIncomeRoutes from "./monthly-income.routes"
import recurringIncomeRoutes from "./recurring-income.routes"
import incomeTaxRoutes from "./income-tax.routes"
import categoryRoutes from "./category.routes"
import subcategoryRoutes from "./subcategory.routes"
import expenseRoutes from "./expense.routes"
import installmentGroupRoutes from "./installment-group.routes"
import recurringExpenseRoutes from "./recurring-expense.routes"
import debtRoutes from "./debt.routes"
import budgetRoutes from "./budget.routes"

const router = Router()

router.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

router.use("/users", userRoutes)
router.use("/families", familyRoutes)
router.use("/family-members", familyMemberRoutes)
router.use("/months", monthRoutes)
router.use("/monthly-incomes", monthlyIncomeRoutes)
router.use("/recurring-incomes", recurringIncomeRoutes)
router.use("/income-taxes", incomeTaxRoutes)
router.use("/categories", categoryRoutes)
router.use("/subcategories", subcategoryRoutes)
router.use("/expenses", expenseRoutes)
router.use("/installment-groups", installmentGroupRoutes)
router.use("/recurring-expenses", recurringExpenseRoutes)
router.use("/debts", debtRoutes)
router.use("/budgets", budgetRoutes)

export default router
