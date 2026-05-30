import { Request, Response } from "express"
import {
  CreateBudgetAllocationUseCase,
  CreateBudgetRuleUseCase,
  DeleteBudgetAllocationUseCase,
  DeleteBudgetRuleUseCase,
  GetBudgetRuleByIdUseCase,
  ListBudgetAllocationsUseCase,
  ListBudgetRulesUseCase,
  UpdateBudgetAllocationUseCase,
  UpdateBudgetRuleUseCase,
} from "../application/use-cases/budget.use-cases";
import { ForbiddenError } from "../utils/errors"

const createBudgetRuleUseCase = new CreateBudgetRuleUseCase();
const listBudgetRulesUseCase = new ListBudgetRulesUseCase();
const getBudgetRuleByIdUseCase = new GetBudgetRuleByIdUseCase();
const updateBudgetRuleUseCase = new UpdateBudgetRuleUseCase();
const deleteBudgetRuleUseCase = new DeleteBudgetRuleUseCase();
const createBudgetAllocationUseCase = new CreateBudgetAllocationUseCase();
const listBudgetAllocationsUseCase = new ListBudgetAllocationsUseCase();
const updateBudgetAllocationUseCase = new UpdateBudgetAllocationUseCase();
const deleteBudgetAllocationUseCase = new DeleteBudgetAllocationUseCase();

export const createBudgetRule = async (req: Request, res: Response) => {
  try {
    const result = await createBudgetRuleUseCase.execute(
      req.body,
      req.user!.id,
    );
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listBudgetRulesByUser = async (req: Request, res: Response) => {
  try {
    const result = await listBudgetRulesUseCase.execute(req.user!.id);
    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const getBudgetRuleById = async (req: Request, res: Response) => {
  try {
    const result = await getBudgetRuleByIdUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const updateBudgetRule = async (req: Request, res: Response) => {
  try {
    const result = await updateBudgetRuleUseCase.execute(
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

export const deleteBudgetRule = async (req: Request, res: Response) => {
  try {
    await deleteBudgetRuleUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}

export const createAllocation = async (req: Request, res: Response) => {
  try {
    const result = await createBudgetAllocationUseCase.execute(
      req.body,
      req.user!.id,
    );
    return res.status(201).json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(400).json({ error: error.message })
  }
}

export const listAllocationsByRule = async (req: Request, res: Response) => {
  try {
    const result = await listBudgetAllocationsUseCase.execute(
      req.params.ruleId as string,
      req.user!.id,
    );
    return res.json(result)
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}

export const updateAllocation = async (req: Request, res: Response) => {
  try {
    const result = await updateBudgetAllocationUseCase.execute(
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

export const deleteAllocation = async (req: Request, res: Response) => {
  try {
    await deleteBudgetAllocationUseCase.execute(
      req.params.id as string,
      req.user!.id,
    );
    return res.json({ success: true })
  } catch (error: any) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    return res.status(404).json({ error: error.message })
  }
}
