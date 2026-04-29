import { Request, Response } from "express"
import { IncomeTaxService } from "../services/income-tax.service"

const incomeTaxService = new IncomeTaxService()

export const createTax = async (req: Request, res: Response) => {
  try {
    const result = await incomeTaxService.createTax(req.body)
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listTaxesByIncome = async (req: Request, res: Response) => {
  try {
    const result = await incomeTaxService.listTaxesByIncome(req.params.incomeId as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getTaxById = async (req: Request, res: Response) => {
  try {
    const result = await incomeTaxService.findTaxById(req.params.id as string)
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateTax = async (req: Request, res: Response) => {
  try {
    const result = await incomeTaxService.updateTax(req.params.id as string, req.body)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteTax = async (req: Request, res: Response) => {
  try {
    await incomeTaxService.deleteTax(req.params.id as string)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
