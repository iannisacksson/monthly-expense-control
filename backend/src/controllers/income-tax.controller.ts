import { Request, Response } from "express"
import {
  CreateIncomeTaxUseCase,
  DeleteIncomeTaxUseCase,
  GetIncomeTaxByIdUseCase,
  ListIncomeTaxesUseCase,
  UpdateIncomeTaxUseCase,
} from "../application/use-cases/income-tax.use-cases";
import { ForbiddenError } from "../utils/errors"

const createIncomeTaxUseCase = new CreateIncomeTaxUseCase();
const listIncomeTaxesUseCase = new ListIncomeTaxesUseCase();
const getIncomeTaxByIdUseCase = new GetIncomeTaxByIdUseCase();
const updateIncomeTaxUseCase = new UpdateIncomeTaxUseCase();
const deleteIncomeTaxUseCase = new DeleteIncomeTaxUseCase();

export const createTax = async (req: Request, res: Response) => {
  try {
    const result = await createIncomeTaxUseCase.execute(req.body, req.user!.id);
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listTaxesByIncome = async (req: Request, res: Response) => {
  try {
    const result = await listIncomeTaxesUseCase.execute(
      req.params.incomeId as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}

export const getTaxById = async (req: Request, res: Response) => {
  try {
    const result = await getIncomeTaxByIdUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateTax = async (req: Request, res: Response) => {
  try {
    const result = await updateIncomeTaxUseCase.execute(
      req.params.id as string,
      req.body,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const deleteTax = async (req: Request, res: Response) => {
  try {
    await deleteIncomeTaxUseCase.execute(req.params.id as string, req.user!.id);
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}
