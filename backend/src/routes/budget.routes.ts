import { Router } from "express"
import {
  createBudgetRule,
  listBudgetRulesByUser,
  listBudgetRulesByFamily,
  getBudgetRuleById,
  updateBudgetRule,
  deleteBudgetRule,
  createAllocation,
  listAllocationsByRule,
  updateAllocation,
  deleteAllocation
} from "../controllers/budget.controller"

const router = Router()

router.post("/rules", createBudgetRule)
router.get("/rules/user/:userId", listBudgetRulesByUser)
router.get("/rules/family/:familyId", listBudgetRulesByFamily)
router.get("/rules/:id", getBudgetRuleById)
router.put("/rules/:id", updateBudgetRule)
router.delete("/rules/:id", deleteBudgetRule)

router.post("/allocations", createAllocation)
router.get("/allocations/rule/:ruleId", listAllocationsByRule)
router.put("/allocations/:id", updateAllocation)
router.delete("/allocations/:id", deleteAllocation)

export default router
