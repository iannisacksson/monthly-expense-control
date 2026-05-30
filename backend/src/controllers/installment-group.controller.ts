import { Request, Response } from "express"
import {
  CreateInstallmentGroupUseCase,
  DeleteInstallmentGroupUseCase,
  GetInstallmentGroupByIdUseCase,
  ListInstallmentGroupExpensesUseCase,
  ListInstallmentGroupsUseCase,
  RestoreInstallmentOccurrenceUseCase,
  UpdateInstallmentGroupUseCase,
} from "../application/use-cases/installment-group.use-cases";
import { ForbiddenError } from "../utils/errors"

const createInstallmentGroupUseCase = new CreateInstallmentGroupUseCase();
const listInstallmentGroupsUseCase = new ListInstallmentGroupsUseCase();
const getInstallmentGroupByIdUseCase = new GetInstallmentGroupByIdUseCase();
const listInstallmentGroupExpensesUseCase =
  new ListInstallmentGroupExpensesUseCase();
const updateInstallmentGroupUseCase = new UpdateInstallmentGroupUseCase();
const restoreInstallmentOccurrenceUseCase =
  new RestoreInstallmentOccurrenceUseCase();
const deleteInstallmentGroupUseCase = new DeleteInstallmentGroupUseCase();

export const createInstallmentPurchase = async (req: Request, res: Response) => {
  try {
    const result = await createInstallmentGroupUseCase.execute(
      req.body,
      req.user!.id,
    );
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listInstallmentGroupsByUser = async (req: Request, res: Response) => {
  try {
    const result = await listInstallmentGroupsUseCase.execute(req.user!.id);
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getInstallmentGroupById = async (req: Request, res: Response) => {
  try {
    const result = await getInstallmentGroupByIdUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const getExpensesByInstallmentGroup = async (req: Request, res: Response) => {
  try {
    const result = await listInstallmentGroupExpensesUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}

export const updateInstallmentGroup = async (req: Request, res: Response) => {
  try {
    const result = await updateInstallmentGroupUseCase.execute(
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

export const restoreInstallmentOccurrence = async (req: Request, res: Response) => {
  try {
    const result = await restoreInstallmentOccurrenceUseCase.execute(
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

export const deleteInstallmentGroup = async (req: Request, res: Response) => {
  try {
    await deleteInstallmentGroupUseCase.execute(
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
