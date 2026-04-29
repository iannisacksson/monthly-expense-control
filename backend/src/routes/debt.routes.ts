import { Router } from "express"
import { createDebt, listDebtsByFamily, getDebtById, updateDebt, deleteDebt } from "../controllers/debt.controller"

const router = Router()

router.post("/", createDebt)
router.get("/family/:familyId", listDebtsByFamily)
router.get("/:id", getDebtById)
router.put("/:id", updateDebt)
router.delete("/:id", deleteDebt)

export default router
