import { Request, Response } from "express"
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "../config/auth.config"
import {
  DeleteAuthenticatedProfileUseCase,
  GetAuthenticatedProfileUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  ReadSessionIdFromAccessTokenUseCase,
  RefreshSessionUseCase,
  RegisterUserUseCase,
  UpdateAuthenticatedProfileUseCase,
} from "../application/use-cases/auth.use-cases";
import { clearAuthCookies, setAuthCookies } from "../utils/auth-cookies"
import { extractRequestContext } from "../utils/request-context"

const registerUserUseCase = new RegisterUserUseCase();
const loginUserUseCase = new LoginUserUseCase();
const refreshSessionUseCase = new RefreshSessionUseCase();
const logoutUserUseCase = new LogoutUserUseCase();
const getAuthenticatedProfileUseCase = new GetAuthenticatedProfileUseCase();
const updateAuthenticatedProfileUseCase =
  new UpdateAuthenticatedProfileUseCase();
const deleteAuthenticatedProfileUseCase =
  new DeleteAuthenticatedProfileUseCase();
const readSessionIdFromAccessTokenUseCase =
  new ReadSessionIdFromAccessTokenUseCase();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const user = await registerUserUseCase.execute({ name, email, password });
    return res.status(201).json(user)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await loginUserUseCase.execute(
      { email, password },
      extractRequestContext(req),
    );
    setAuthCookies(res, result.accessToken, result.refreshToken)
    return res.json({ user: result.user })
  } catch (error: any) {
    return res.status(401).json({ error: error.message })
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME]
    if (!refreshToken) {
      return res.status(401).json({ error: "Missing refresh cookie" })
    }

    const result = await refreshSessionUseCase.execute(
      refreshToken,
      extractRequestContext(req),
    );
    setAuthCookies(res, result.accessToken, result.refreshToken)
    return res.json({ user: result.user })
  } catch (error: any) {
    clearAuthCookies(res)
    return res.status(401).json({ error: error.message })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] ?? null
    const accessToken = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME] ?? null
    const sessionId = accessToken
      ? readSessionIdFromAccessTokenUseCase.execute(accessToken)
      : null;
    await logoutUserUseCase.execute(
      refreshToken,
      sessionId,
      extractRequestContext(req),
    );
    clearAuthCookies(res)
    return res.json({ success: true })
  } catch (error: any) {
    clearAuthCookies(res)
    return res.status(400).json({ error: error.message })
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const user = await getAuthenticatedProfileUseCase.execute(userId);
    return res.json(user)
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const { name, email, password } = req.body
    const user = await updateAuthenticatedProfileUseCase.execute(userId, {
      name,
      email,
      password,
    });
    return res.json(user)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const deleteMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    await deleteAuthenticatedProfileUseCase.execute(userId);
    clearAuthCookies(res)
    return res.json({ success: true })
  } catch (error: any) {
    return res.status(404).json({ error: error.message })
  }
}
