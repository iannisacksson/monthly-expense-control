import { Router } from "express"
import {
  createExpense,
  listExpensesByUserAndMonth,
  getExpenseById,
  listExpenseAdjustments,
  listExpenseItems,
  createExpenseItem,
  updateExpenseItem,
  deleteExpenseItem,
  updateExpense,
  deleteExpense,
  bulkDeleteExpenses,
  bulkMarkExpensesPaid,
} from "../interfaces/http/controllers/expense.controller";

const router = Router()

router.post("/", createExpense)
router.post("/bulk-delete", bulkDeleteExpenses)
router.post("/bulk-mark-paid", bulkMarkExpensesPaid)
router.get("/user/:userId/month/:monthId", listExpensesByUserAndMonth)
router.get("/:id/adjustments", listExpenseAdjustments)
router.get("/:id/items", listExpenseItems)
router.post("/:id/items", createExpenseItem)
router.put("/items/:itemId", updateExpenseItem)
router.delete("/items/:itemId", deleteExpenseItem)
router.get("/:id", getExpenseById)
router.put("/:id", updateExpense)
router.delete("/:id", deleteExpense)

export default router
