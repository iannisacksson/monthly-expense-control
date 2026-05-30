import { Router } from "express"
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateMe,
  deleteMe,
} from "../interfaces/http/controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware"
import { loginRateLimit, refreshRateLimit } from "../middlewares/rate-limit.middleware"

const router = Router()

router.post("/register", register)
router.post("/login", loginRateLimit, login)
router.post("/refresh", refreshRateLimit, refresh)
router.post("/logout", logout)
router.get("/me", authMiddleware, getMe)
router.put("/me", authMiddleware, updateMe)
router.delete("/me", authMiddleware, deleteMe)

export default router
