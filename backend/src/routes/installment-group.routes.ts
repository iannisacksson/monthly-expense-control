import { Router } from "express"
import {
  createInstallmentPurchase,
  listInstallmentGroupsByUser,
  listInstallmentGroupsByFamily,
  getInstallmentGroupById,
  getExpensesByInstallmentGroup,
  deleteInstallmentGroup,
  restoreInstallmentOccurrence,
  updateInstallmentGroup
} from "../controllers/installment-group.controller"

const router = Router()

router.post("/", createInstallmentPurchase)
router.get("/user/:userId", listInstallmentGroupsByUser)
router.get("/family/:familyId", listInstallmentGroupsByFamily)
router.get("/:id", getInstallmentGroupById)
router.put("/:id", updateInstallmentGroup)
router.post("/:id/restore-occurrence", restoreInstallmentOccurrence)
router.get("/:id/expenses", getExpensesByInstallmentGroup)
router.delete("/:id", deleteInstallmentGroup)

export default router
