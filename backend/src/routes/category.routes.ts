import { Router } from "express"
import { createCategory, listCategoriesByUser, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller"

const router = Router()

router.post("/", createCategory)
router.get("/user/:userId", listCategoriesByUser)
router.get("/:id", getCategoryById)
router.put("/:id", updateCategory)
router.delete("/:id", deleteCategory)

export default router
