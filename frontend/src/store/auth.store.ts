import { create } from "zustand";
import type { AuthUser } from "../types";

interface AuthState {
  user: AuthUser | null;
  currentUserId: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setSession: (user: AuthUser) => void;
  clearSession: () => void;
  finishHydration: (user: AuthUser | null) => void;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  currentUserId: null,
  isAuthenticated: false,
  isHydrating: true,

  setSession: (user) => {
    set({ user, currentUserId: user.id, isAuthenticated: true, isHydrating: false });
  },

  clearSession: () => {
    set({ user: null, currentUserId: null, isAuthenticated: false, isHydrating: false });
  },

  finishHydration: (user) => {
    set({
      user,
      currentUserId: user?.id ?? null,
      isAuthenticated: !!user,
      isHydrating: false,
    });
  },

  setUser: (user) => {
    set({ user, currentUserId: user.id });
  },
}));

