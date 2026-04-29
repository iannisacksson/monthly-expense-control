import { Router } from "express"
import { createMonth, listMonthsByUser, getMonthById, updateMonth, deleteMonth, finalizeMonth } from "../controllers/month.controller"

const router = Router()

router.post("/", createMonth)
router.get("/user/:userId", listMonthsByUser)
router.get("/:id", getMonthById)
router.patch("/:id/finalize", finalizeMonth)
router.put("/:id", updateMonth)
router.delete("/:id", deleteMonth)

export default router
