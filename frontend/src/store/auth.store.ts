import { create } from "zustand";

interface AuthState {
  token: string | null;
  currentUserId: string | null;
  isAuthenticated: boolean;
  setCurrentUserId: (userId: string | null) => void;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("auth_token"),
  currentUserId: localStorage.getItem("auth_user_id"),
  isAuthenticated: !!localStorage.getItem("auth_token"),
  setCurrentUserId: (currentUserId: string | null) => {
    if (currentUserId) {
      localStorage.setItem("auth_user_id", currentUserId);
    } else {
      localStorage.removeItem("auth_user_id");
    }

    set({ currentUserId });
  },
  setToken: (token: string) => {
    localStorage.setItem("auth_token", token);
    set({ token, isAuthenticated: true });
  },
  clearToken: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user_id");
    set({ token: null, currentUserId: null, isAuthenticated: false });
  },
}));
