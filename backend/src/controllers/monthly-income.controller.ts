import { Request, Response } from "express"
import {
  DeleteMonthlyIncomeUseCase,
  GetMonthlyIncomeByIdUseCase,
  ListMonthlyIncomesUseCase,
  RegisterMonthlyIncomeUseCase,
  UpdateMonthlyIncomeUseCase,
} from "../application/use-cases/monthly-income.use-cases";
import { ForbiddenError } from "../utils/errors"

const registerMonthlyIncomeUseCase = new RegisterMonthlyIncomeUseCase();
const listMonthlyIncomesUseCase = new ListMonthlyIncomesUseCase();
const getMonthlyIncomeByIdUseCase = new GetMonthlyIncomeByIdUseCase();
const updateMonthlyIncomeUseCase = new UpdateMonthlyIncomeUseCase();
const deleteMonthlyIncomeUseCase = new DeleteMonthlyIncomeUseCase();

export const registerIncome = async (req: Request, res: Response) => {
  try {
    const result = await registerMonthlyIncomeUseCase.execute(
      req.body,
      req.user!.id,
    );
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listIncomesByMonth = async (req: Request, res: Response) => {
  try {
    const result = await listMonthlyIncomesUseCase.execute(
      req.params.monthId as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}

export const getIncomeById = async (req: Request, res: Response) => {
  try {
    const result = await getMonthlyIncomeByIdUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateIncome = async (req: Request, res: Response) => {
  try {
    const result = await updateMonthlyIncomeUseCase.execute(
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

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    await deleteMonthlyIncomeUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}
