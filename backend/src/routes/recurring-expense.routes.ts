import { Router } from "express"
import {
  createRecurringExpense,
  listRecurringExpensesByUser,
  listRecurringExpensesByFamily,
  getRecurringExpenseById,
  updateRecurringExpense,
  getExpensesByRecurringExpense,
  deleteRecurringExpense,
  restoreRecurringExpenseOccurrence
} from "../controllers/recurring-expense.controller"

const router = Router()

router.post("/", createRecurringExpense)
router.get("/user/:userId", listRecurringExpensesByUser)
router.get("/family/:familyId", listRecurringExpensesByFamily)
router.get("/:id", getRecurringExpenseById)
router.put("/:id", updateRecurringExpense)
router.post("/:id/restore-occurrence", restoreRecurringExpenseOccurrence)
router.get("/:id/expenses", getExpensesByRecurringExpense)
router.delete("/:id", deleteRecurringExpense)

export default router