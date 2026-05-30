import { Router } from "express"
import {
  createInstallmentPurchase,
  listInstallmentGroupsByUser,
  getInstallmentGroupById,
  getExpensesByInstallmentGroup,
  deleteInstallmentGroup,
  restoreInstallmentOccurrence,
  updateInstallmentGroup,
} from "../interfaces/http/controllers/installment-group.controller";

const router = Router()

router.post("/", createInstallmentPurchase)
router.get("/user/:userId", listInstallmentGroupsByUser)
router.get("/:id", getInstallmentGroupById)
router.put("/:id", updateInstallmentGroup)
router.post("/:id/restore-occurrence", restoreInstallmentOccurrence)
router.get("/:id/expenses", getExpensesByInstallmentGroup)
router.delete("/:id", deleteInstallmentGroup)

export default router
