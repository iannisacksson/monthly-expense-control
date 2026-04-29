import { Router } from "express"
import { addMember, listMembersByFamily, getMemberById, removeMember } from "../controllers/family-member.controller"

const router = Router()

router.post("/", addMember)
router.get("/family/:familyId", listMembersByFamily)
router.get("/:id", getMemberById)
router.delete("/:id", removeMember)

export default router
