import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";
import { useAuthStore } from "../store";
import type { LoginDTO, RegisterDTO, UpdateProfileDTO } from "../types";

const ME_KEY = ["auth", "me"] as const;

export function useMe() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ME_KEY,
    queryFn: authService.getMe,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: LoginDTO) => authService.login(dto),
    onSuccess: (data) => {
      login(data.token, data.user);
      queryClient.invalidateQueries({ queryKey: ME_KEY });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (dto: RegisterDTO) => authService.register(dto),
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return () => {
    logout();
    queryClient.clear();
    navigate("/login");
  };
}

export function useUpdateMe() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateProfileDTO) => authService.updateMe(dto),
    onSuccess: (user) => {
      setUser({ id: user.id, name: user.name, email: user.email });
      queryClient.invalidateQueries({ queryKey: ME_KEY });
    },
  });
}

export function useDeleteMe() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => authService.deleteMe(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate("/login");
    },
  });
}
