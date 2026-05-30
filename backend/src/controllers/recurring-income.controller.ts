import { Request, Response } from "express"
import {
  CreateRecurringIncomeUseCase,
  DeleteRecurringIncomeUseCase,
  GetRecurringIncomeByIdUseCase,
  ListRecurringIncomeEntriesUseCase,
  ListRecurringIncomesUseCase,
  UpdateRecurringIncomeUseCase,
} from "../application/use-cases/recurring-income.use-cases";
import { ForbiddenError } from "../utils/errors"

const createRecurringIncomeUseCase = new CreateRecurringIncomeUseCase();
const listRecurringIncomesUseCase = new ListRecurringIncomesUseCase();
const getRecurringIncomeByIdUseCase = new GetRecurringIncomeByIdUseCase();
const updateRecurringIncomeUseCase = new UpdateRecurringIncomeUseCase();
const listRecurringIncomeEntriesUseCase =
  new ListRecurringIncomeEntriesUseCase();
const deleteRecurringIncomeUseCase = new DeleteRecurringIncomeUseCase();

export const createRecurringIncome = async (req: Request, res: Response) => {
  try {
    const result = await createRecurringIncomeUseCase.execute(
      req.body,
      req.user!.id,
    );
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listRecurringIncomesByUser = async (req: Request, res: Response) => {
  try {
    const result = await listRecurringIncomesUseCase.execute(req.user!.id);
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getRecurringIncomeById = async (req: Request, res: Response) => {
  try {
    const result = await getRecurringIncomeByIdUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateRecurringIncome = async (req: Request, res: Response) => {
  try {
    const result = await updateRecurringIncomeUseCase.execute(
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

export const getMonthlyIncomesByRecurringIncome = async (req: Request, res: Response) => {
  try {
    const result = await listRecurringIncomeEntriesUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}

export const deleteRecurringIncome = async (req: Request, res: Response) => {
  try {
    await deleteRecurringIncomeUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}