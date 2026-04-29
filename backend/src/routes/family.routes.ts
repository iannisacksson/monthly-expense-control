import { Router } from "express"
import { createFamily, listFamilies, getFamilyById, updateFamily, deleteFamily } from "../controllers/family.controller"

const router = Router()

router.post("/", createFamily)
router.get("/", listFamilies)
router.get("/:id", getFamilyById)
router.put("/:id", updateFamily)
router.delete("/:id", deleteFamily)

export default router
