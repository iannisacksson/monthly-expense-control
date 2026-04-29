import { Router } from "express"
import { createCategory, listCategoriesByUser, listCategoriesByFamily, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller"

const router = Router()

router.post("/", createCategory)
router.get("/user/:userId", listCategoriesByUser)
router.get("/family/:familyId", listCategoriesByFamily)
router.get("/:id", getCategoryById)
router.put("/:id", updateCategory)
router.delete("/:id", deleteCategory)

export default router
