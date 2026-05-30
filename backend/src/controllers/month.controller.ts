import { Request, Response } from "express"
import {
  CreateMonthUseCase,
  DeleteMonthUseCase,
  FinalizeMonthUseCase,
  GetMonthByIdUseCase,
  ListMonthsUseCase,
  UpdateMonthUseCase,
} from "../application/use-cases/month.use-cases";
import { ForbiddenError } from "../utils/errors"

const createMonthUseCase = new CreateMonthUseCase();
const listMonthsUseCase = new ListMonthsUseCase();
const getMonthByIdUseCase = new GetMonthByIdUseCase();
const updateMonthUseCase = new UpdateMonthUseCase();
const deleteMonthUseCase = new DeleteMonthUseCase();
const finalizeMonthUseCase = new FinalizeMonthUseCase();

export const createMonth = async (req: Request, res: Response) => {
  try {
    const { user_id: _ignored, ...rest } = req.body
    const result = await createMonthUseCase.execute({
      ...rest,
      user_id: req.user!.id,
    });
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const listMonthsByUser = async (req: Request, res: Response) => {
  try {
    const result = await listMonthsUseCase.execute(req.user!.id);
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getMonthById = async (req: Request, res: Response) => {
  try {
    const result = await getMonthByIdUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateMonth = async (req: Request, res: Response) => {
  try {
    const result = await updateMonthUseCase.execute(
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

export const deleteMonth = async (req: Request, res: Response) => {
  try {
    await deleteMonthUseCase.execute(req.params.id as string, req.user!.id);
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(error.message === "Month deletion is not allowed" ? 405 : 404).json({ error: error.message })
  }
}

export const finalizeMonth = async (req: Request, res: Response) => {
  try {
    const result = await finalizeMonthUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}
