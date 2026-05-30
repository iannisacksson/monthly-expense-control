import { Request, Response } from "express"
import {
  BulkDeleteExpensesUseCase,
  BulkMarkExpensesPaidUseCase,
  CreateExpenseItemUseCase,
  CreateExpenseUseCase,
  DeleteExpenseItemUseCase,
  DeleteExpenseUseCase,
  GetExpenseByIdUseCase,
  ListExpenseAdjustmentsUseCase,
  ListExpenseItemsUseCase,
  ListExpensesByMonthUseCase,
  UpdateExpenseItemUseCase,
  UpdateExpenseUseCase,
} from "../application/use-cases/expense.use-cases";
import { ForbiddenError } from "../utils/errors"

const createExpenseUseCase = new CreateExpenseUseCase();
const listExpensesByMonthUseCase = new ListExpensesByMonthUseCase();
const getExpenseByIdUseCase = new GetExpenseByIdUseCase();
const listExpenseAdjustmentsUseCase = new ListExpenseAdjustmentsUseCase();
const listExpenseItemsUseCase = new ListExpenseItemsUseCase();
const createExpenseItemUseCase = new CreateExpenseItemUseCase();
const updateExpenseItemUseCase = new UpdateExpenseItemUseCase();
const deleteExpenseItemUseCase = new DeleteExpenseItemUseCase();
const updateExpenseUseCase = new UpdateExpenseUseCase();
const deleteExpenseUseCase = new DeleteExpenseUseCase();
const bulkDeleteExpensesUseCase = new BulkDeleteExpensesUseCase();
const bulkMarkExpensesPaidUseCase = new BulkMarkExpensesPaidUseCase();

export const createExpense = async (req: Request, res: Response) => {
  try {
    const result = await createExpenseUseCase.execute({
      ...req.body,
      user_id: req.user!.id,
    });
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listExpensesByUserAndMonth = async (req: Request, res: Response) => {
  try {
    const result = await listExpensesByMonthUseCase.execute(
      req.user!.id,
      req.params.monthId as string,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const result = await getExpenseByIdUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const listExpenseAdjustments = async (req: Request, res: Response) => {
  try {
    const result = await listExpenseAdjustmentsUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const listExpenseItems = async (req: Request, res: Response) => {
  try {
    const result = await listExpenseItemsUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const createExpenseItem = async (req: Request, res: Response) => {
  try {
    const result = await createExpenseItemUseCase.execute(
      req.params.id as string,
      req.body,
      req.user!.id,
    );
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const updateExpenseItem = async (req: Request, res: Response) => {
  try {
    const result = await updateExpenseItemUseCase.execute(
      req.params.itemId as string,
      req.body,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const deleteExpenseItem = async (req: Request, res: Response) => {
  try {
    await deleteExpenseItemUseCase.execute(
      req.params.itemId as string,
      req.user!.id,
    );
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const result = await updateExpenseUseCase.execute(
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

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    await deleteExpenseUseCase.execute(req.params.id as string, req.user!.id);
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const bulkDeleteExpenses = async (req: Request, res: Response) => {
  try {
    const result = await bulkDeleteExpensesUseCase.execute(
      req.body,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const bulkMarkExpensesPaid = async (req: Request, res: Response) => {
  try {
    const result = await bulkMarkExpensesPaidUseCase.execute(
      req.body,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}
