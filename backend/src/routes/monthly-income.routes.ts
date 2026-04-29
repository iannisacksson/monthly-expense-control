import { Router } from "express"
import { registerIncome, listIncomesByMonth, getIncomeById, updateIncome, deleteIncome } from "../controllers/monthly-income.controller"

const router = Router()

router.post("/", registerIncome)
router.get("/month/:monthId", listIncomesByMonth)
router.get("/:id", getIncomeById)
router.put("/:id", updateIncome)
router.delete("/:id", deleteIncome)

export default router
