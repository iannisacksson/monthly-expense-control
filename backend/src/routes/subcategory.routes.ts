import { Router } from "express"
import { createSubcategory, listSubcategoriesByCategory, getSubcategoryById, updateSubcategory, deleteSubcategory } from "../controllers/subcategory.controller"

const router = Router()

router.post("/", createSubcategory)
router.get("/category/:categoryId", listSubcategoriesByCategory)
router.get("/:id", getSubcategoryById)
router.put("/:id", updateSubcategory)
router.delete("/:id", deleteSubcategory)

export default router
