import { Router } from "express"
import { listDebtsByFamily } from "../controllers/debt.controller"

const router = Router()

router.get("/family/:familyId", listDebtsByFamily)

export default router
