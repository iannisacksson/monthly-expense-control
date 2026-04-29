import { Router } from "express"
import { createExpense, listExpensesByUserAndMonth, listExpensesByFamilyAndMonth, getExpenseById, updateExpense, deleteExpense, bulkDeleteExpenses, bulkMarkExpensesPaid } from "../controllers/expense.controller"

const router = Router()

router.post("/", createExpense)
router.post("/bulk-delete", bulkDeleteExpenses)
router.post("/bulk-mark-paid", bulkMarkExpensesPaid)
router.get("/user/:userId/month/:monthId", listExpensesByUserAndMonth)
router.get("/family/:familyId/month/:monthId", listExpensesByFamilyAndMonth)
router.get("/:id", getExpenseById)
router.put("/:id", updateExpense)
router.delete("/:id", deleteExpense)

export default router
