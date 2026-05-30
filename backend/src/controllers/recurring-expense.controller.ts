import { Request, Response } from "express"
import {
  CreateRecurringExpenseUseCase,
  DeleteRecurringExpenseUseCase,
  GetRecurringExpenseByIdUseCase,
  ListRecurringExpenseEntriesUseCase,
  ListRecurringExpensesUseCase,
  RestoreRecurringExpenseOccurrenceUseCase,
  UpdateRecurringExpenseUseCase,
} from "../application/use-cases/recurring-expense.use-cases";
import { ForbiddenError } from "../utils/errors"

const createRecurringExpenseUseCase = new CreateRecurringExpenseUseCase();
const listRecurringExpensesUseCase = new ListRecurringExpensesUseCase();
const getRecurringExpenseByIdUseCase = new GetRecurringExpenseByIdUseCase();
const updateRecurringExpenseUseCase = new UpdateRecurringExpenseUseCase();
const restoreRecurringExpenseOccurrenceUseCase =
  new RestoreRecurringExpenseOccurrenceUseCase();
const listRecurringExpenseEntriesUseCase =
  new ListRecurringExpenseEntriesUseCase();
const deleteRecurringExpenseUseCase = new DeleteRecurringExpenseUseCase();

export const createRecurringExpense = async (req: Request, res: Response) => {
  try {
    const result = await createRecurringExpenseUseCase.execute(
      req.body,
      req.user!.id,
    );
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listRecurringExpensesByUser = async (req: Request, res: Response) => {
  try {
    const result = await listRecurringExpensesUseCase.execute(req.user!.id);
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getRecurringExpenseById = async (req: Request, res: Response) => {
  try {
    const result = await getRecurringExpenseByIdUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateRecurringExpense = async (req: Request, res: Response) => {
  try {
    const result = await updateRecurringExpenseUseCase.execute(
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

export const restoreRecurringExpenseOccurrence = async (req: Request, res: Response) => {
  try {
    const result = await restoreRecurringExpenseOccurrenceUseCase.execute(
      req.params.id as string,
      { month_id: req.body.month_id as string },
      req.user!.id,
    );
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const getExpensesByRecurringExpense = async (req: Request, res: Response) => {
  try {
    const result = await listRecurringExpenseEntriesUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}

export const deleteRecurringExpense = async (req: Request, res: Response) => {
  try {
    await deleteRecurringExpenseUseCase.execute(
      req.params.id as string,
      req.body,
      req.user!.id,
    );
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}