import { create } from "zustand";
import type { AuthUser } from "../types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  currentUserId: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  // kept for backward compatibility with existing pages
  setCurrentUserId: (userId: string | null) => void;
  setToken: (token: string) => void;
  clearToken: () => void;
}

function persistUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem("auth_user_id", user.id);
    localStorage.setItem("auth_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("auth_user_id");
    localStorage.removeItem("auth_user");
  }
}

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("auth_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("auth_token"),
  user: readUser(),
  currentUserId: localStorage.getItem("auth_user_id"),
  isAuthenticated: !!localStorage.getItem("auth_token"),

  login: (token, user) => {
    localStorage.setItem("auth_token", token);
    persistUser(user);
    set({ token, user, currentUserId: user.id, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    persistUser(null);
    set({ token: null, user: null, currentUserId: null, isAuthenticated: false });
  },

  setUser: (user) => {
    persistUser(user);
    set({ user, currentUserId: user.id });
  },

  // backward-compat actions
  setCurrentUserId: (currentUserId) => {
    if (currentUserId) {
      localStorage.setItem("auth_user_id", currentUserId);
    } else {
      localStorage.removeItem("auth_user_id");
    }
    set({ currentUserId });
  },

  setToken: (token) => {
    localStorage.setItem("auth_token", token);
    set({ token, isAuthenticated: true });
  },

  clearToken: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user_id");
    localStorage.removeItem("auth_user");
    set({ token: null, user: null, currentUserId: null, isAuthenticated: false });
  },
}));

