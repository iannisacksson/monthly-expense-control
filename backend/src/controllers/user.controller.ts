import { Request, Response } from "express"
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "../application/use-cases/user.use-cases";

const createUserUseCase = new CreateUserUseCase();
const getUserByIdUseCase = new GetUserByIdUseCase();
const updateUserUseCase = new UpdateUserUseCase();
const deleteUserUseCase = new DeleteUserUseCase();

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await createUserUseCase.execute(req.body);
    return res.status(201).json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await getUserByIdUseCase.execute(req.params.id as string);
    return res.json(result)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await updateUserUseCase.execute(
      req.params.id as string,
      req.body,
    );
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await deleteUserUseCase.execute(req.params.id as string);
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
