import { Router } from "express"
import {
  createTax,
  listTaxesByIncome,
  getTaxById,
  updateTax,
  deleteTax,
} from "../interfaces/http/controllers/income-tax.controller";

const router = Router()

router.post("/", createTax)
router.get("/income/:incomeId", listTaxesByIncome)
router.get("/:id", getTaxById)
router.put("/:id", updateTax)
router.delete("/:id", deleteTax)

export default router
