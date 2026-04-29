import { Router } from "express"
import {
  createRecurringIncome,
  listRecurringIncomesByUser,
  listRecurringIncomesByFamily,
  getRecurringIncomeById,
  updateRecurringIncome,
  getMonthlyIncomesByRecurringIncome,
  deleteRecurringIncome,
} from "../controllers/recurring-income.controller"

const router = Router()

router.post("/", createRecurringIncome)
router.get("/user/:userId", listRecurringIncomesByUser)
router.get("/family/:familyId", listRecurringIncomesByFamily)
router.get("/:id", getRecurringIncomeById)
router.put("/:id", updateRecurringIncome)
router.get("/:id/monthly-incomes", getMonthlyIncomesByRecurringIncome)
router.delete("/:id", deleteRecurringIncome)

export default router