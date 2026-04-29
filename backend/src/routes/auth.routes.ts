import { Router } from "express"
import { register, login, getMe, updateMe, deleteMe } from "../controllers/auth.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", authMiddleware, getMe)
router.put("/me", authMiddleware, updateMe)
router.delete("/me", authMiddleware, deleteMe)

export default router
