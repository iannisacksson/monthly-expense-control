import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";
import { useAuthStore } from "../store";
import type { LoginDTO, RegisterDTO, UpdateProfileDTO } from "../types";

const ME_KEY = ["auth", "me"] as const;

export function useBootstrapAuth() {
  const finishHydration = useAuthStore((state) => state.finishHydration);
  const query = useQuery({
    queryKey: ME_KEY,
    queryFn: authService.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess) {
      finishHydration({ id: query.data.id, name: query.data.name, email: query.data.email });
      return;
    }

    if (query.isError) {
      finishHydration(null);
    }
  }, [finishHydration, query.data, query.isError, query.isSuccess]);

  return query;
}

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
  const { setSession } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: LoginDTO) => authService.login(dto),
    onSuccess: (data) => {
      setSession(data.user);
      queryClient.setQueryData(ME_KEY, data.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (dto: RegisterDTO) => authService.register(dto),
  });
}

export function useLogout() {
  const { clearSession } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearSession();
      queryClient.clear();
      navigate("/login");
    },
  });

  return () => {
    mutation.mutate();
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
  const { clearSession } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => authService.deleteMe(),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      navigate("/login");
    },
  });
}
